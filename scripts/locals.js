'use strict';
const cheerio = require('cheerio');

hexo.extend.filter.register('template_locals', (locals) => {
  if (locals.page.__post) {
    const {authors} = hexo.locals.toObject().data;
    const author = authors[locals.page.author];
    locals.page.author = author;
  }
  return locals;
});

hexo.extend.filter.register('template_locals', (locals) => {
  if (locals.page.__post) {
    const $ = cheerio.load(locals.page.content);
    const $firstImage = $('img').first();
    const src = $firstImage.attr('src');

    if (src) {
      const url = /^https?:\/\//.test(src)
        ? src
        : locals.config.url + src.replace(locals.config.root, '/');
      locals.page.coverImage = url;
    }
  }
  return locals;
});
