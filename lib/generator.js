const fs = require('hexo-fs');

const { truncate, stripHTML } = require('hexo-util');

exports = module.exports = (locals) => {

  const tmpFile = '.posts.json'; // tmp file

  const site = {
    posts: []
  };

  locals.posts.forEach(post => {
    if (post.published) { // only for those already published
      const item = {
        source: post.source,
        path: post.path,
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

      site.posts.push(item);

    }
  });

  const siteStr = JSON.stringify(site);
  fs.writeFileSync(tmpFile, siteStr);

};
