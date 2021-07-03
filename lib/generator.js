const fs = require('hexo-fs');

const { stripHTML } = require('hexo-util');

exports = module.exports = (locals) => {

  const tmpFile = '.posts.json'; // tmp file

  const oPosts = [];

  locals.posts.forEach(post => {
    if (post.published) { // only for those already published
      const item = {
        title: post.title,
        created_at: post.date,
        updated_at: post.updated,
        summary: stripHTML(post.excerpt || post.content),
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
