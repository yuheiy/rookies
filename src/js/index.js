const modules = new Map()

modules.set('highlight', async () => {
  if (!document.querySelector('pre')) return

  await import('prismjs')
  // global Prism

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
  const clickableElement = document.createElement('span')
  const logo = document.querySelector('.global-header__logo')
  const {default: initNojun} = await import('./nojun.js')

  while (logo.firstChild) clickableElement.appendChild(logo.firstChild)
  initNojun(clickableElement)
  logo.appendChild(clickableElement)
})

const run = map => {
  const types = Object.keys(document.body.dataset)

  for (const [type, func] of map) {
    if (types.includes(type)) func()
  }
}

run(modules)
