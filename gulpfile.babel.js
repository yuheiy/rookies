const Promise = require('bluebird')
const path = require('path')
const fs = Promise.promisifyAll(require('fs'))
const mkdirp = Promise.promisifyAll(require('mkdirp'))
const gulp = require('gulp')
const plugins = require('gulp-load-plugins')()
const browserSync = require('browser-sync').create()
const marked = require('marked')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config.js')
const config = require('./config.json')
const authors = require('./authors.json')

const isRelease = process.argv.includes('--release')

const utilFuncs = {
  urlFor: relativePath => path.join(config.root, relativePath),
  toIsoTime: date => new Date(date).toISOString(),
  toDisplayDate: (date, format) => {
    const moment = require('moment')
    return moment(new Date(date)).format(format)
  },
  stripHtml: require('striptags'),
}

const renderer = (() => {
  // https://github.com/chjj/marked/blob/master/lib/marked.js#L1096-L1108
  function unescape(html) {
    // explicitly match decimal, hex, and named HTML entities
    return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/g, function(_, n) {
      n = n.toLowerCase();
      if (n === 'colon') return ':';
      if (n.charAt(0) === '#') {
        return n.charAt(1) === 'x'
          ? String.fromCharCode(parseInt(n.substring(2), 16))
          : String.fromCharCode(+n.substring(1));
      }
      return '';
    });
  }

  const renderer = new marked.Renderer()

  renderer.heading = (text, level, raw) =>
    `<h${level} id="${renderer.options.headerPrefix}${raw.toLowerCase()}">${text}</h${level}>\n`

  renderer.link = (href, title, text) => {
    if (renderer.options.sanitize) {
      let prot
      try {
        prot = decodeURIComponent(unescape(href))
          .replace(/[^\w:]/g, '')
          .toLowerCase()
      } catch (e) {
        return ''
      }
      if (prot.startsWith('javascript:') || prot.startsWith('vbscript:')) return ''
    }

    // パスにサブディレクトリをprependする
    if (/^\/(\w|-|\.|~)+/.test(href)) href = href.replace('/', config.root)

    return `<a href="${href}"${title ? ` title="${title}"` : ''}>${text}</a>`
  }

  renderer.image = (href, title, alt) => {
    // パスにサブディレクトリをprependする
    if (/^\/(\w|-|\.|~)+/.test(href)) href = href.replace('/', config.root)

    return `<img src="${href}" alt="${alt}"${title ? ` title="${title}"` : ''}${renderer.options.xhtml ? '/>' : '>'}`
  }

  return renderer
})()

const posts = async () => {
  const frontMatter = require('front-matter')
  const cheerio = require('cheerio')
  const markedOpts = {renderer}
  const excerptPattern = /<!-- *more *-->/
  const postDir = 'src/posts'
  const postFiles = (await fs.readdirAsync(postDir))
    .filter(file => file.endsWith('.md'))
  const posts = (await Promise.all(postFiles.map(file => fs.readFileAsync(path.join(postDir, file), 'utf8'))))
    .map(data => frontMatter(data))
    .map(({
      attributes: {
        title,
        date,
        updated,
        author,
      },
      body,
    }, i) => {
      author = ({...authors[author]})
      const slug = path.basename(postFiles[i], '.md')
      const link = `/posts/${slug}.html`
      const parsed = marked(body, markedOpts)
      const content = parsed.replace(excerptPattern, '')
      const excerpt = parsed.substring(0, parsed.search(excerptPattern))
      const $ = cheerio.load(parsed)
      const coverImageSrc = $('img').first().attr('src')
      let coverImage
      if (coverImageSrc) {
        if (/^https?:\/\//.test(coverImageSrc)) {
          coverImage = coverImageSrc
        } else if (coverImageSrc.startsWith('//')) {
          const [scheme] = /^https?/.exec(config.url)
          coverImage = `${scheme}:${coverImageSrc}`
        } else {
          coverImage = `${config.url}${coverImageSrc.replace(config.root, '/')}`
        }
      }

      return {
        title,
        link,
        date,
        updated,
        author,
        content,
        excerpt,
        coverImage,
      }
    })
    .sort((a, b) => {
      if (a.date > b.date) return -1
      if (a.date < b.date) return 1
      return 0
    })
    .map((post, i, posts) => {
      const prev = posts[i + 1]
      const next = posts[i - 1]

      return {
        ...post,
        prev,
        next,
      }
    })

  await mkdirp.mkdirpAsync('cache')
  return fs.writeFileAsync('cache/posts.json', JSON.stringify(posts))
}

const processHtml = (file, data) => {
  const {minify} = require('html-minifier')
  const result = isRelease ? minify(data, {
    minifyCSS: true,
    minifyJS: true,
    removeComments: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes: true,
    removeRedundantAttributes: true,
    removeEmptyAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    removeOptionalTags: true,
  }) : data
  return fs.writeFileAsync(file, result)
}

const html = async done => {
  const pug = require('pug')

  await mkdirp.mkdirpAsync(path.join('dist', config.root, 'posts'))
  const posts = JSON.parse(await fs.readFileAsync('cache/posts.json', 'utf8'))
  const postCompiler = pug.compileFile('src/html/post.pug')

  await Promise.all([
    processHtml(
      path.join('dist', config.root, 'index.html'),
      pug.renderFile('src/html/index.pug', {
        ...config,
        ...utilFuncs,
        currentPath: '/',
        posts,
      }),
    ),
    processHtml(
      path.join('dist', config.root, 'posts/index.html'),
      pug.renderFile('src/html/archive.pug', {
        ...config,
        ...utilFuncs,
        currentPath: '/posts/',
        posts,
      }),
    ),
    ...posts.map(post =>
      processHtml(
        path.join('dist', config.root, post.link),
        postCompiler({
          ...config,
          ...utilFuncs,
          currentPath: post.link,
          post,
        })
      )
    )
  ])

  browserSync.reload()
  done()
}

export const xml = () =>
  gulp.src([
    'src/xml/atom.pug',
    'src/xml/sitemap.pug',
  ])
    .pipe(plugins.data(() => {
      const posts = JSON.parse(fs.readFileSync('cache/posts.json', 'utf8'))
      return {
        ...config,
        ...utilFuncs,
        posts,
      }
    }))
    .pipe(plugins.pug({
      pretty: true,
    }))
    .pipe(plugins.rename({extname: '.xml'}))
    .pipe(gulp.dest(path.join('dist', config.root)))

const postTasks = gulp.series(
  posts,
  gulp.parallel(html, xml),
)

const css = () => {
  const AUTOPREXIER_BROWSERS = [
    'last 1 version',
    '> 5% in JP',
  ]

  return gulp.src('src/css/ryden.scss')
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(plugins.postcss([
      require('autoprefixer')({
        browsers: AUTOPREXIER_BROWSERS,
        cascade: false,
      }),
      ...(isRelease ? [
        require('css-mqpacker')(),
        require('csswring')(),
      ] : []),
    ]))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest(path.join('dist', config.root, 'css')))
    .pipe(browserSync.stream({match: '**/*.css'}))
}

const jsCompiler = webpack(webpackConfig)

const js = done => {
  jsCompiler.run((err, stats) => {
    if (err) throw new gutil.PluginError('webpack:build', err)
    plugins.util.log('[webpack:build]', stats.toString({
      colors: true,
    }))
    browserSync.reload()
    done()
  })
}

const img = () => {
  const destDir = path.join('dist', config.root, 'img')

  return gulp.src('src/img/**/*')
    .pipe(plugins.changed(destDir))
    .pipe(plugins.if(isRelease, plugins.imagemin()))
    .pipe(gulp.dest(destDir))
    .pipe(browserSync.stream())
}

const copy = () => {
  const destDir = path.join('dist', config.root)

  return gulp.src('src/static/**/*')
    .pipe(plugins.changed(destDir))
    .pipe(gulp.dest(destDir))
    .pipe(browserSync.stream())
}

const clean = () => {
  const del = require('del')
  return del('dist')
}

const serve = done =>
  browserSync.init({
    notify: false,
    server: 'dist',
    startPath: config.root,
    ghostMode: false,
    open: false,
  }, done)

const watch = done => {
  gulp.watch('src/posts/**/*.md', postTasks)
  gulp.watch('src/html/**/*', html)
  gulp.watch('src/xml/**/*.pug', xml)
  gulp.watch('src/css/**/*.scss', css)
  gulp.watch('src/js/**/*.js', js)
  gulp.watch('src/img/**/*', img)
  gulp.watch('src/static/**/*', copy)

  done()
}

export const build = gulp.series(
  clean,
  gulp.parallel(
    postTasks,
    css,
    js,
    img,
    copy,
  ),
)

export default gulp.series(build, serve, watch)

export const publish = done => {
  const ghpages = require('gh-pages')
  ghpages.publish(path.join('dist', config.root), done)
}
