'use strict';
const cheerio = require('cheerio');

hexo.extend.filter.register('template_locals', (locals) => {
  if (locals.page.__post) {
    const $ = cheerio.load(locals.page.content);
    const image = $('img').attr('src');
    locals.page.coverImage = image;
  }
  return locals;
});
