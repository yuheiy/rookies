const path = require('path')
const fs = require('fs')
const del = require('del')
const gulp = require('gulp')
const plugins = require('gulp-load-plugins')()
const browserSync = require('browser-sync').create()

const config = {
  title: 'ライデンの新人ブログ',
  description: '株式会社ライデンの新人社員による、日常の日々を綴るブログです。',
  url: 'https://ryden-inc.github.io/rookies',
  root: '/rookies/',
  dateFormat: 'MMM D, YYYY',
}
const authors = {
  yuhei: {
    name: '安田 祐平',
    title: 'エンジニア',
    description: '2016年新卒入社。Webフロントエンドスペシャリスト。広告業界の荒んだWebサイトにWebの理念を適応させるため、最高企業ライデンへの入社を決める。今後の世界を変革させる人物。',
  },
}

const html = done => {
  const mkdirp = require('mkdirp')
  const frontMatter = require('front-matter')
  const marked = require('marked')
  const moment = require('moment')
  const pug = require('pug')

  const excerptPattern = /<!-- *more *-->/
  const postDir = 'src/posts'
  const postFiles = fs.readdirSync(postDir)
  const posts = postFiles
    .map(file => fs.readFileSync(path.join(postDir, file), 'utf8'))
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
      const slug = path.basename(postFiles[i], '.md')
      const link = `/posts/${slug}.html`
      const parsed = marked(body)
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

  const utilFuncs = {
    urlFor: relativePath => path.join(config.root, relativePath),
    getDateTime: date => new Date(date).toISOString(),
    getDisplayDate: (date, format) => moment(new Date(date)).format(format),
    getAuthor: author => ({...authors[author]}),
  }

  mkdirp.sync(path.join('dist', config.root, 'posts'))

  fs.writeFileSync(
    path.join('dist', config.root, 'index.html'),
    pug.renderFile('src/html/index.pug', {
      ...config,
      ...utilFuncs,
      currentPath: '/',
      posts,
    }),
    'utf8',
  )

  fs.writeFileSync(
    path.join('dist', config.root, 'posts/index.html'),
    pug.renderFile('src/html/archive.pug', {
      ...config,
      ...utilFuncs,
      currentPath: '/posts/',
      posts,
    }),
    'utf8',
  )

  posts.forEach(post => {
    fs.writeFileSync(
      path.join('dist', config.root, post.link),
      pug.renderFile('src/html/post.pug', {
        ...config,
        ...utilFuncs,
        currentPath: post.link,
        post,
      }),
      'utf8',
    )
  })

  // todo: render atom.xml

  browserSync.reload()
  done()
}

const css = () =>
  gulp.src('src/css/index.scss')
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream({match: '**/*.css'}))

const serve = done =>
  browserSync.init({
    notify: false,
    server: 'dist',
    startPath: config.root,
    ghostMode: false,
    open: false,
  }, done)

const clean = () => del('dist')

const watch = done => {
  gulp.watch([
    'src/html/**/*.pug',
    'src/posts/**/*.md',
  ], html)
  gulp.watch('src/css/**/*.scss', css)

  done()
}

export default gulp.series(
  clean,
  gulp.parallel(html, css),
  serve,
  watch,
)
