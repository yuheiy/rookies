// YoutubeIFramePlayerAPIを利用する際は、必ずこの関数を使う。
//
// Usage:
// ```
// const loadYoutubeAPI = require('./path/to/loadYoutubeAPI')
//
// loadYoutubeAPI.then(() => {
//   const player = new YT.Player('player', {})
// })
// ```
'use strict'

const loadYouTubeIFramePlayerAPI = () => new Promise(resolve => {
  const youtubeScript = document.createElement('script')
  youtubeScript.src = 'https://www.youtube.com/iframe_api'

  const firstScript = document.querySelector('script')
  firstScript.parentNode.insertBefore(youtubeScript, firstScript)

  window.onYouTubeIframeAPIReady = () => {
    if (process.env.NODE_ENV !== 'production') {
      console.info('YouTubeIFramePlayerAPI has loaded')
    }
    resolve()
  }
})

// export instance of promise
const resolver = loadYouTubeIFramePlayerAPI()
module.exports = resolver
