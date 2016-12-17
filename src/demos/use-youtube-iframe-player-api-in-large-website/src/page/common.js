'use strict'

module.exports = () => {

  const loadYoutubeAPI = require('../loadYoutubeAPI')
  const stacker = document.getElementById('stacker')

  loadYoutubeAPI.then(() => {
    const li = document.createElement('li')
    li.textContent = 'use from `common.js`'
    stacker.appendChild(li)
  })

  setTimeout(() => {
    loadYoutubeAPI.then(() => {
      const li = document.createElement('li')
      li.textContent = 'use from `common.js`'
      stacker.appendChild(li)
    })
  }, 1500)

}
