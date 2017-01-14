class Stage {
  constructor(container) {
    this._container = container
    this._nojunList = []
  }

  setSize() {
    this._stageWidth = window.innerWidth
    this._stageHeight = window.innerHeight
  }

  addChild(nojun) {
    this._nojunList.push(nojun)
    this._container.appendChild(nojun.element)
  }

  removeChild(nojun) {
    const index = this._nojunList.indexOf(nojun)
    this._nojunList.splice(index, 1)
    this._container.removeChild(nojun.element)
  }

  update() {
    this._nojunList.forEach(nojun => {
      nojun.updatePosition()
    })
  }

  removeNonVisibleChildren() {
    this._nojunList
      .filter(nojun => !nojun.isVisible(this._stageWidth, this._stageHeight))
      .forEach(nojun => this.removeChild(nojun))
  }

  render() {
    this._nojunList.forEach(nojun => {
      nojun.render()
    })
  }
}

class Nojun {
  constructor(startX, startY) {
    this.element = document.createElement('img')
    this.element.src = 'img/nojun.png'
    this._width = 64
    this._height = 64
    this._x = startX - (this._width / 2)
    this._y = startY - (this._height / 2)
    this._z = 180
    this._v = {
      x: Math.random() * 5 - 2.5,
      y: Math.random() * 5 - 2.5,
      z: Math.random() * 29 + 1,
    }
  }

  updatePosition() {
    this._x += this._v.x
    this._y += this._v.y
    this._z += this._v.z
    if (360 <= this._z) this._z -= 360
  }

  isVisible(stageWidth, stageHeight) {
    const size = Math.max(this._width, this._height)
    const elementSize = size * Math.sqrt(2)
    const centerX = this._x + (size / 2)
    const x = centerX - (elementSize / 2)
    const x2 = centerX + (elementSize / 2)
    const centerY = this._y + (size / 2)
    const y = centerY - (elementSize / 2)
    const y2 = centerY + (elementSize / 2)

    return x2 > 0 && x < stageWidth &&
      y2 > 0 && y < stageHeight
  }

  render() {
    this.element.removeAttribute('style')

    const {style} = this.element
    style.position = 'fixed'
    style.top = 0
    style.left = 0
    style.transform = `translate(${this._x}px, ${this._y}px) rotate(${this._z}deg)`
    style.pointerEvents = 'none'
  }
}

const handleTripleClick = (target, listener) => {
  const CLICK_INTERVAL_DELAY = 400
  let clickCount = 0
  let clickTimeout = null

  const handleClick = (...args) => {
    if (++clickCount === 3) {
      listener(...args)
      clearTimeout(clickTimeout)
      clickCount = 0
    } else {
      clearTimeout(clickTimeout)
      clickTimeout = setTimeout(() => clickCount = 0, CLICK_INTERVAL_DELAY)
    }
  }

  target.addEventListener('click', handleClick)
}

const initNojun = target => {
  const stage = new Stage(document.body)
  stage.setSize()

  handleTripleClick(target, e => {
    const nojun = new Nojun(e.clientX, e.clientY)
    stage.addChild(nojun)
  })

  window.addEventListener('resize', () => stage.setSize())

  requestAnimationFrame(function tick() {
    requestAnimationFrame(tick)
    stage.update()
    stage.render()
    stage.removeNonVisibleChildren()
  })
}

export default initNojun
