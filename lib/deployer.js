const fs = require('hexo-fs');

const RSS3 = require('rss3').default;

// print usage help
const help = () => {

  const help
    = 'You have to configure the deployment settings in _config.yml first.\n\n'
    + 'Example:\n'
    + 'deploy:\n'
    + '- type: rss3\n'
    + '  endpoint: https://hub.rss3.io\n'
    + '  privateKey: 47e18d6c386898b424025cd9db446f779ef24ad33a26c499c87bb3d9372540ba';

  console.log(help);
};


exports = module.exports = async (args) => {

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
    postedItems.items.forEach((item) => {
      if (item.tags.includes('Hexo')) {
        // Is a hexo post (or posted by hexo-deployer-rss3)
        publishedPosts.set(item.title, {
          date_published: item.date_published,
          date_modified: item.date_modified,
          id: item.id
        });
      }
    });
    startItem = postedItems.items_next;
    postedItems = await rss3.items.get(startItem);
  } while (startItem);

  // load generated posts
  const postStr = fs.readFileSync('.posts.json').toString();
  const allPosts = JSON.parse(postStr);

  // prepare posts

  const postsToUpdate = [];
  const postsNew = [];

  // parse posts to rss3-item formats

  function parseToRSS3Item(post, id) {
    let item = {
      title: post.title,
      summary: post.summary,
      tags: [],
      // date_published: post.created_at,
      // date_modified: post.updated_at,

      type: 'Hexo post',

      contents: [{
        address: [post.link],
        tags: post.tags,
        mime_type: 'text/html'
      }]
    };
    post.tags.forEach((tag) => {
      item.tags.push(tag);
    });
    if (!item.tags.includes('Hexo')) {
      item.tags.push('Hexo');
    }
    if (id) {
      item = Object.assign(item, {
        id: id
      });
    }
    return item;
  }

  // compare items

  allPosts.forEach((post) => {
    if (publishedPosts.has(post.title)) {
      const posted = publishedPosts.get(post.title);
      const onRSS3Date = new Date(posted.date_modified);
      const localModifyDate = new Date(post.updated_at);
      const isBehind = onRSS3Date.getTime() < localModifyDate.getTime();
      if (isBehind) {
        // Modified
        postsToUpdate.push(parseToRSS3Item(post, posted.id));
      }
    } else {
      // New
      postsNew.push(parseToRSS3Item(post, undefined));
    }
  });

  // sort items

  postsNew.sort((a, b) => {
    const aPublish = new Date(a.date_published);
    const bPublish = new Date(b.date_published);

    // inc
    return aPublish.getTime() - bPublish.getTime();

  });

  // patch updated items
  for (const item of postsToUpdate) {
    await rss3.item.patch(item);
  }

  // post new items
  for (const item of postsNew) {
    await rss3.item.post(item);
  }

  rss3.persona.sync();

  // done

};
