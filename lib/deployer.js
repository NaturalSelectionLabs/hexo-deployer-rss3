const fs = require('hexo-fs');
const path = require('path');

const RSS3 = require('rss3').default;

const axios = require('axios');
const FormData = require('form-data');

// print usage help
const help = () => {

  const help
    = 'You have to configure the deployment settings in _config.yml first.\n\n'
    + 'Example:\n'
    + 'deploy:\n'
    + '- type: rss3\n'
    + '  endpoint: https://hub.rss3.io\n'
    + '  privateKey: 47e18d6c386898b424025cd9db446f779ef24ad33a26c499c87bb3d9372540ba\n'
    + '  ipfs:\n'
    + '    deploy: true\n'
    + '    gateway: pinata\n'
    + '    api:\n'
    + '      key: 1234567890abcdefghij\n'
    + '      secret: 700f8359e6b463c04c617f275e9aae7e037ea3889ad58eed51218d9bb9e8c6ff;\n'
  ;

  console.log(help);
};


exports = module.exports = async (args) => {
  // I don't know how hexo-deployer-git can grab "this" config
  const publicDir = this.public_dir || 'public';

  if (!args.privateKey || !args.endpoint) {
    help();
    return;
  }

  // prepare to retrieve RSS3 items

  const rss3 = new RSS3({
    endpoint: args.endpoint,
    privateKey: args.privateKey
  });

  await rss3.profile.get()

  // Retrieve posted items

  let postedItems;
  let startItem = undefined;

  // filter out hexo items

  const publishedPosts = new Map();

  postedItems = await rss3.items.get();

  do {
    postedItems.items?.forEach((item) => {
      if (item.tags?.includes('Hexo')) {
        // Is a hexo post (or posted by hexo-deployer-rss3)

        // hrtv1: Hexo RSS3 Tag Version 1, combine post id (filename) into tags, like 'source/:source'

        if (item.tags.includes('hrtv1')) {
          // it is.
          const tagv1Rule = /^source\/(.+)/;
          let source;
          item.tags.forEach((tag) => {
            if (tagv1Rule.exec(tag) !== null) {
              source = tagv1Rule.exec(tag)[1]
            }
          });

          if (source) {
            publishedPosts.set(source, item);
          }

        }

        // hrtv2: Hexo RSS3 Tag Version 2, will use plugin-defined field
        // (waiting for SDK)

        // for those need update: change their modify time to sth like 0, 
        // thus trigger force patch.

        
      }
    });
    startItem = postedItems.items_next;
    postedItems = await rss3.items.get(startItem);
  } while (startItem);

  // load generated posts
  const siteStr = fs.readFileSync('.posts.json');
  const site = JSON.parse(siteStr);
  const allPosts = site.posts;

  // sort items

  allPosts.sort((a, b) => {
    const aPublish = new Date(a.created_at);
    const bPublish = new Date(b.created_at);

    // inc
    return aPublish.getTime() - bPublish.getTime();

  });

  // prepare posts

  const postsToUpdate = [];
  const postsNew = [];

  // parse posts to rss3-item formats

  async function parseToRSS3Item(post, id) {

    console.log("Start processing", post.title || post.source, "...");

    let item = {
      title: post.title,
      summary: post.summary,
      tags: [],

      type: 'Hexo post',

      contents: [{
        address: [],
        tags: post.tags,
        mime_type: 'text/html'
      }]
    };

    // add tags
    post.tags.forEach((tag) => {
      item.tags.push(tag);
    });
    if (!item.tags.includes('Hexo')) {
      item.tags.push('Hexo');
    }
    item.tags.push('hrtv1'); // Hexo RSS3 tag Version 1
    item.tags.push('source/' + post.source);

    // assign id for patch need
    if (id) {
      item = Object.assign(item, {
        id: id
      });
    }

    // if need upload to ipfs
    if (args.ipfs?.deploy) {

      item.tags.push('hrt-ipfs'); // Hexo RSS3 tag IPFS

      let filePath = path.join(publicDir, post.path)

      if (post.path.endsWith(".html")) {
        // xxxxx.html
        filePath = path.join(publicDir, post.path)
      }else if (post.path.endsWith("\\")) {
        // xxxxx/ + index.html
        filePath = path.join(publicDir, post.path, 'index.html')
      }else{
        // xxxxx + .html
        filePath = path.join(publicDir, post.path, '.html')
      }

      const file = fs.createReadStream(filePath);

      switch (args.ipfs.gateway) {
        case 'pinata':
          item.tags.push('hrt-ipfs-pinata'); // Hexo RSS3 tag IPFS pinata
          if (file) {
            const formData = new FormData();
            formData.append('file', file);

            // For no-title posts, specify undefined title would cause bad request
            const pinataMetadataStringify = JSON.stringify({
              name: post.title || post.source,
            });
            formData.append('pinataMetadata', pinataMetadataStringify);

            const pinataOptionsStringify = JSON.stringify({
              cidVersion: 0,
            });
            formData.append('pinataOptions', pinataOptionsStringify);

            let res;
            try {
              res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
                maxBodyLength: 'Infinity',
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                    pinata_api_key: args.ipfs.api.key,
                    pinata_secret_api_key: args.ipfs.api.secret,
                },
              });
            } catch (e) {
              console.warn(e);
            }
            if (res.data?.IpfsHash) {
              item.contents[0].address.push('https://gateway.pinata.cloud/ipfs/' + res.data.IpfsHash);
            }
        }
        break;

      }
    }

    item.contents[0].address.push(post.link);

    return item;
  }

  async function unpinFromIPFS(link, tags) {
    if (tags.includes('hrt-ipfs-pinata')) {
      const hashToUnpin = /^https:\/\/gateway.pinata.cloud\/ipfs\/(.+)$/.exec(link)[1];
      let res;
      try {
        res = await axios.delete(`https://api.pinata.cloud/pinning/unpin/${hashToUnpin}`, {
            headers: {
              pinata_api_key: args.ipfs.api.key,
              pinata_secret_api_key: args.ipfs.api.secret,
            }
          }
        );
      } catch (e) {
        console.warn(e);
      }
    }
  }

  // compare items

  for (const post of allPosts) {
    if (publishedPosts.has(post.source)) {
      const posted = publishedPosts.get(post.source);
      const onRSS3Date = new Date(posted.date_modified);
      const localModifyDate = new Date(post.updated_at);
      const isBehind = onRSS3Date.getTime() < localModifyDate.getTime();
      if (isBehind) {
        // Modified
        if (posted.tags?.includes('hrt-ipfs')) {
          // Unpin old file
          unpinFromIPFS(posted.contents[0].address[0], posted.tags);
        }

        // Parse new item
        const modifyItem = await parseToRSS3Item(post, posted.id);
        postsToUpdate.push(modifyItem);
      }
    } else {
      // New
      const newItem = await parseToRSS3Item(post, undefined);
      postsNew.push(newItem);
    }
  }

  // patch updated items
  for (const item of postsToUpdate) {
    await rss3.item.patch(item);
  }

  // post new items
  for (const item of postsNew) {
    await rss3.item.post(item);
  }

  console.log("Start sync RSS3 persona ...");

  rss3.persona.sync();

  fs.unlinkSync('.posts.json')

  // done

};
