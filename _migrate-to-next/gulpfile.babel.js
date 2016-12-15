const Promise = require('bluebird')
const path = require('path')
const fs = Promise.promisifyAll(require('fs'))
const mkdirp = Promise.promisifyAll(require('mkdirp'))
const del = require('del')
const gulp = require('gulp')
const plugins = require('gulp-load-plugins')()
const browserSync = require('browser-sync').create()
const config = require('./config.json')
const authors = require('./authors.json')

const utilFuncs = {
  urlFor: relativePath => path.join(config.root, relativePath),
  toIsoTime: date => new Date(date).toISOString(),
  toDisplayDate: (date, format) => require('moment')(new Date(date)).format(format),
  stripHtml: require('striptags'),
}

const posts = async () => {
  const frontMatter = require('front-matter')
  const marked = require('marked')

  const excerptPattern = /<!-- *more *-->/
  const postDir = 'src/posts'
  const postFiles = await fs.readdirAsync(postDir)
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
      const parsed = marked(body)

// https://github.com/chjj/marked#renderer
// https://github.com/chjj/marked/blob/master/lib/marked.js#L890-L897
// todo: hack <img> element


      const content = parsed.replace(excerptPattern, '')
      const excerpt = parsed.substring(0, parsed.search(excerptPattern))

      return {
        title,
        link,
        date,
        updated,
        author,
        content,
        excerpt,
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
  const result = minify(data, {
    removeComments: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes: true,
    removeRedundantAttributes: true,
    removeEmptyAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    removeOptionalTags: true,
  })
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

const css = () => {
  const AUTOPREXIER_BROWSERS = [
    'last 1 version',
    '> 5% in JP',
  ]

  return gulp.src('src/css/index.scss')
    .pipe(plugins.rename({basename: 'ryden'}))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(plugins.autoprefixer({
      browsers: AUTOPREXIER_BROWSERS,
      cascade: false,
    }))
    .pipe(plugins.cssnano())
    .pipe(plugins.sourcemaps.write('.', {
      destPath: 'ryden.css',
    }))
    .pipe(gulp.dest(path.join('dist', config.root, 'css')))
    .pipe(browserSync.stream({match: '**/*.css'}))
}

const img = () =>
  gulp.src('src/img/**/*')
    .pipe(gulp.dest(path.join('dist', config.root, 'img')))
    .pipe(browserSync.stream())
    .pipe(plugins.imagemin())
    .pipe(gulp.dest(path.join('dist', config.root, 'img')))

const copy = () =>
  gulp.src('src/static/**/*')
    .pipe(gulp.dest(path.join('dist', config.root)))
    .pipe(browserSync.stream())

const clean = () => del('dist')

const serve = done =>
  browserSync.init({
    notify: false,
    server: 'dist',
    middleware(req, res, next) {
      // `html-minifier`使うと`browserSync`のスクリプトが挿入されないので自力でやる
      const {pathname} = require('url').parse(req.url)
      if (
        pathname === config.root ||
        pathname === path.join(config.root, 'index.html') ||
        pathname === path.join(config.root, 'posts/') ||
        pathname === path.join(config.root, 'posts/index.html') ||
        new RegExp(`^${path.join(config.root, 'posts/').replace(/\//g, '\\\/')}(\\w|-)*\.html$`).test(pathname) // `/:root/posts/post-title-like-this.html`
      ) {
        let filepath = path.join('dist', pathname)
        if (filepath.endsWith('/')) filepath += 'index.html'
        const defaultBody = fs.readFileSync(path.join(filepath), 'utf8')
        const insertIndex = '<!DOCTYPE html>'.length
        return res.end(defaultBody.substring(0, insertIndex) + '<script async src="/browser-sync/browser-sync-client.js"></script>' + defaultBody.substring(insertIndex))
      }
      next()
    },
    startPath: config.root,
    ghostMode: false,
    open: false,
  }, done)

const postTasks = gulp.series(
  posts,
  gulp.parallel(html, xml),
)

const watch = done => {
  gulp.watch('src/posts/**/*.md', postTasks)
  gulp.watch('src/html/**/*.pug', html)
  gulp.watch('src/xml/**/*.pug', xml)
  gulp.watch('src/css/**/*.scss', css)
  gulp.watch('src/img/**/*', img)
  gulp.watch('src/static/**/*', copy)

  done()
}

export const build = gulp.series(
  clean,
  gulp.parallel(
    postTasks,
    css,
    img,
    copy,
  ),
)

export default gulp.series(build, serve, watch)

export const publish = gulp.series(
  build,
  done => {
    const ghpages = require('gh-pages')
    ghpages.publish(path.join('dist', config.root), done)
  }
)
