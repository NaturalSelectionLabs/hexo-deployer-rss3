const fs = require('hexo-fs');

const { truncate, stripHTML } = require('hexo-util');

exports = module.exports = (locals) => {

  const tmpFile = '.posts.json'; // tmp file

  const oPosts = [];

  locals.posts.forEach(post => {
    if (post.published) { // only for those already published
      const item = {
        source: post.source,
        title: post.title,
        created_at: post.date,
        updated_at: post.updated,
        summary: truncate(stripHTML(post.excerpt || post.content), { length: 280 }),
        photos: post.photos,
        tags: [],
        link: post.permalink
      };

      post.tags.forEach((tag) => {
        item.tags.push(tag.name);
      })

      oPosts.push(item);

    }
  });

  const siteStr = JSON.stringify(oPosts);
  fs.writeFileSync(tmpFile, siteStr);

};
