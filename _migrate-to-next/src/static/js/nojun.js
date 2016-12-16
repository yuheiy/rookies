(function() {
  'use strict'

  var handleTripleClick = function(target, callback) {
    var TRIPLE_CLICK_COUNT = 3
    var CLICK_INTERVAL_DELAY = 400

    var clickCount = 0
    var clickTimeout = null
    var handleClick = function() {
      var context = this
      var args = arguments

      if (++clickCount === TRIPLE_CLICK_COUNT) {
        callback.apply(context, args)
        clearTimeout(clickTimeout)
        clickCount = 0
      } else {
        clearTimeout(clickTimeout)
        clickTimeout = setTimeout(function() {
          clickCount = 0
        }, CLICK_INTERVAL_DELAY)
      }
    }

    target.addEventListener('click', handleClick)
  }

  var Nojun = function(opts) {
    this.element = document.createElement('img')
    this.element.src = 'img/nojun.png'
    this.width = 64
    this.height = 64
    this.x = opts.startX - (this.width / 2)
    this.y = opts.startY - (this.height / 2)
    this.z = 180
    this.v = {
      x: Math.random() * 5 - 2.5,
      y: Math.random() * 5 - 2.5,
      z: Math.random() * 29 + 1
    }
    this.stageWidth = window.innerWidth
    this.stageHeight = window.innerHeight
    this.isVisible = true
    document.body.appendChild(this.element)
  }

  Nojun.prototype.setSize = function(opts) {
    this.stageWidth = opts.width
    this.stageHeight = opts.height
  }

  Nojun.prototype.destory = function() {
    this.isVisible = false
    document.body.removeChild(this.element)
  }

  Nojun.prototype.updatePosition = function() {
    this.x += this.v.x
    this.y += this.v.y
    this.z += this.v.z
    if (360 <= this.z) this.z -= 360

    var elementSize = Math.max(this.width, this.height) * Math.sqrt(2)

    if (
      this.x >= this.stageWidth || this.x + elementSize <= 0 ||
      this.y >= this.stageHeight || this.y + elementSize <= 0
    ) {
      this.destory()
    }
  }

  Nojun.prototype.render = function() {
    console.log('render');
    var style = this.element.style
    style.position = 'fixed'
    style.top = 0
    style.left = 0
    style.transform =
      'translate(' + this.x + 'px,' + this.y + 'px) rotate(' + this.z + 'deg)'
    style.pointerEvents = 'none'
  }

  var init = function() {
    var nojunList = []
    var requestId = null
    var logo = document.querySelector('.global-header__logo')
    var clickableElement = document.createElement('span')
    clickableElement.appendChild(logo.firstChild)
    logo.appendChild(clickableElement)

    handleTripleClick(clickableElement, function(event) {
      var nojun = new Nojun(event.clientX, event.clientY)
      nojunList.push(nojun)

      if (!requestId) {
        requestId = requestAnimationFrame(function loop() {
          nojunList.forEach(function(nojun, i, arr) {
            nojun.updatePosition()

            if (nojun.isVisible) {
              nojun.render()
            } else {
              arr.splice(i, 1)
            }
          })

          if (nojunList.length) {
            requestId = requestAnimationFrame(loop)
          } else {
            requestId = null
          }
        })
      }
    })
  }

  init()
})();
