const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
const del = require('del')
const moment = require('moment')
const frontMatter = require('front-matter')
const marked = require('marked')
const pug = require('pug')
const gulp = require('gulp')
const plugins = require('gulp-load-plugins')()
const browserSync = require('browser-sync').create()

const config = {
  title: 'ライデンの新人ブログ',
  description: '株式会社ライデンの新人社員による、日常の日々を綴るブログです。',
  url: 'https://ryden-inc.github.io/rookies',
  root: '/rookies/',
  dateFormat: 'MMM D, YYYY',
  postCountInHome: 5,
}
const authors = {
  maika: {
    name: '岡村 昧香',
    title: 'ディレクター',
    description: 'つくって遊ぶのが好きな、新米ディレクター。絡まったイヤホン直してもらって受け取った瞬間に絡ませるような女。ファンタならフルーツパンチ、手を汚すなら犯罪じゃなくて桃、血なら鼻血。よろしく。',
  },
  yuhei: {
    name: '安田 祐平',
    title: 'エンジニア',
    description: '2016年新卒入社。Webフロントエンドスペシャリスト。広告業界の荒んだWebサイトにWebの理念を適応させるため、最高企業ライデンへの入社を決める。今後の世界を変革させる人物。',
  },
  'hideo-m': {
    name: '松本 英夫',
    title: 'エンジニア',
    description: '1993年にNCSA Mosaicに出会ってから早幾年。キャリアだけが長くて時運に乗れない残念なタイプ。',
  },
}

const utilFuncs = {
  urlFor: relativePath => path.join(config.root, relativePath),
  toIsoTime: date => new Date(date).toISOString(),
  toDisplayDate: (date, format) => moment(new Date(date)).format(format),
}

const posts = done => {
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
      author = ({...authors[author]})
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
    .map((post, i, posts) => {
      const prev = posts[i + 1]
      const next = posts[i - 1]

      return {
        ...post,
        prev,
        next,
      }
    })

  mkdirp.sync('cache')
  fs.writeFileSync('cache/posts.json', JSON.stringify(posts))
  done()
}

const html = done => {
  mkdirp.sync(path.join('dist', config.root, 'posts'))
  const posts = JSON.parse(fs.readFileSync('cache/posts.json', 'utf8'))

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

const css = () =>
  gulp.src('src/css/index.scss')
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(gulp.dest(path.join('dist', config.root, 'css')))
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
  gulp.watch('src/posts/**/*.md', gulp.series(
    posts,
    gulp.parallel(html, xml),
  ))
  gulp.watch('src/html/**/*.pug', html)
  gulp.watch('src/xml/**/*.pug', xml)
  gulp.watch('src/css/**/*.scss', css)

  done()
}

export default gulp.series(
  clean,
  gulp.parallel(
    gulp.series(
      posts,
      gulp.parallel(html, xml),
    ),
    css,
  ),
  serve,
  watch,
)
