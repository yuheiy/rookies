const path = require('path')
const fs = require('fs')
const gulp = require('gulp')
const plugins = require('gulp-load-plugins')()
const browserSync = require('browser-sync').create()
const frontMatter = require('front-matter')
const marked = require('marked')

export const html = done => {
  const excerptPattern = /<!-- *more *-->/
  const postDir = 'src/posts'
  const posts = fs.readdirSync(postDir)
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
    }) => {
      const parsed = marked(body)
      const content = parsed.replace(excerptPattern, '')
      const excerpt = parsed.substring(0, parsed.search(excerptPattern))

      return {
        title,
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

  console.log(posts)

  done()
}

const css = () =>
  gulp.src('src/css/index.scss')
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(gulp.dest('dist/css'))
