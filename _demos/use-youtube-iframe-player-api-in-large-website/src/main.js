'use strict'

const run = page => {
  switch (page) {
    case 'common':
      require('./page/common')()
      break

    case 'home':
      require('./page/home')()
      break

    case 'about':
      require('./page/about')()
      break

    default:
      console.error(`\`${page}\` is not defined in routes`)
      break
  }
}

window.run = run
