(function () {
  'use strict';

  var handleTripleClick = function (target, callback) {
    var TRIPLE_CLICK_COUNT = 3;
    var CLICK_INTERVAL_DELAY = 400;

    var clickCount = 0;
    var clickTimeout = null;
    var onClick = function () {
      var context = this;
      var args = arguments;

      if (++clickCount === TRIPLE_CLICK_COUNT) {
        callback.apply(context, args);
        clearTimeout(clickTimeout);
        clickCount = 0;
      } else {
        clearTimeout(clickTimeout);
        clickTimeout = setTimeout(function () {
          clickCount = 0;
        }, CLICK_INTERVAL_DELAY);
      }
    };

    target.addEventListener('click', onClick, false);
  };

  var Nojun = function (startX, startY) {
    this.element = document.createElement('img');
    this.element.src = 'img/nojun.png';
    this.width = 64;
    this.height = 64;
    this.x = startX - (this.width / 2);
    this.y = startY - (this.height / 2);
    this.z = 180;
    this.v = {
      x: Math.random() * 5 - 2.5,
      y: Math.random() * 5 - 2.5,
      z: Math.random() * 29 + 1
    };
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    this.isVisible = true;
    document.body.appendChild(this.element);
  };

  Nojun.prototype.setSize = function (windowWidth, windowHeight) {
    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
  };

  Nojun.prototype.update = function () {
    this.x += this.v.x;
    this.y += this.v.y;
    this.z += this.v.z;

    if (360 <= this.z) {
      this.z -= 360;
    }

    var elementSize = Math.max(this.width, this.height) * Math.sqrt(2);

    if (
      this.x >= this.windowWidth || this.x + elementSize <= 0 ||
      this.y >= this.windowHeight || this.y + elementSize <= 0
    ) {
      this.isVisible = false;
      document.body.removeChild(this.element);
    }
  };

  Nojun.prototype.render = function () {
    var el = this.element;
    el.style.position = 'fixed';
    el.style.top = 0;
    el.style.left = 0;
    el.style.transform =
      'translate(' + this.x + 'px,' + this.y + 'px) rotate(' + this.z + 'deg)';
    el.style.pointerEvents = 'none';
  };

  var init = function () {
    var nojunList = [];
    var requestId = null;

    handleTripleClick(document.querySelector('.logo span'), function (event) {
      var nojun = new Nojun(event.clientX, event.clientY);
      nojunList.push(nojun);

      if (!requestId) {
        requestId = requestAnimationFrame(function loop () {
          nojunList.forEach(function (nojun, i, arr) {
            nojun.update();

            if (nojun.isVisible) {
              nojun.render();
            } else {
              arr.splice(i, 1);
            }
          });

          if (nojunList.length) {
            requestId = requestAnimationFrame(loop);
          } else {
            requestId = null;
          }
        });
      }
    });

    window.addEventListener('resize', function () {
      var windowWidth = window.innerWidth;
      var windowHeight = window.innerHeight;

      nojunList.forEach(function (nojun) {
        nojun.setSize(windowWidth, windowHeight);
      });
    }, false);
  };

  init();
})();
