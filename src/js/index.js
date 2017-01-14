const modules = new Map()

modules.set('highlight', async () => {
  if (!document.querySelector('pre')) return

  const Prism = await import('prismjs')

  await Promise.all([
    import('prismjs/components/prism-bash.js'),
    import('prismjs/components/prism-jade.js'),
    import('prismjs/components/prism-json.js'),
    import('prismjs/components/prism-markdown.js'),
    import('prismjs/components/prism-jsx.js'),
    import('prismjs/components/prism-scss.js'),
    import('prismjs/components/prism-stylus.js'),
  ])

  Prism.highlightAll()
})

modules.set('nojun', async () => {
  const logo = document.querySelector('.global-header__logo')
  const clickableElement = document.createElement('span')
  clickableElement.appendChild(logo.firstChild)
  logo.appendChild(clickableElement)

  const {default: initNojun} = await import('./nojun.js')
  initNojun(clickableElement)
})

const run = map => {
  const types = Object.keys(document.body.dataset)

  for (const [type, func] of map) {
    if (types.includes(type)) func()
  }
}

run(modules)
