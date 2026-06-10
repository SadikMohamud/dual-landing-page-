document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const content = document.querySelector('.content');

  const MathUtils = {
    lerp: (a, b, n) => (1 - n) * a + n * b,
    distance: (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1),
  };

  const getMousePos = (ev) => {
    let posx = 0;
    let posy = 0;

    if (ev.pageX || ev.pageY) {
      posx = ev.pageX;
      posy = ev.pageY;
    } else if (ev.clientX || ev.clientY) {
      posx = ev.clientX + body.scrollLeft + document.documentElement.scrollLeft;
      posy = ev.clientY + body.scrollTop + document.documentElement.scrollTop;
    }

    return { x: posx, y: posy };
  };

  let mousePos = { x: 0, y: 0 };
  let lastMousePos = { x: 0, y: 0 };
  let cacheMousePos = { x: 0, y: 0 };

  window.addEventListener('mousemove', (ev) => {
    mousePos = getMousePos(ev);
  });

  const getMouseDistance = () =>
    MathUtils.distance(mousePos.x, mousePos.y, lastMousePos.x, lastMousePos.y);

  class TrailImage {
    constructor(el) {
      this.DOM = { el };
      this.rect = null;
      this.getRect();
    }

    getRect() {
      this.rect = this.DOM.el.getBoundingClientRect();
    }

    isActive() {
      return gsap.isTweening(this.DOM.el) || parseFloat(getComputedStyle(this.DOM.el).opacity) !== 0;
    }
  }

  class ImageTrail {
    constructor() {
      this.DOM = { content };
      this.images = [];
      [...this.DOM.content.querySelectorAll('.content__img')].forEach((img) => {
        this.images.push(new TrailImage(img));
      });

      this.imagesTotal = this.images.length;
      this.imgPosition = 0;
      this.zIndexVal = 1;
      this.threshold = 100;

      requestAnimationFrame(() => this.render());
    }

    render() {
      const distance = getMouseDistance();

      cacheMousePos.x = MathUtils.lerp(cacheMousePos.x || mousePos.x, mousePos.x, 0.1);
      cacheMousePos.y = MathUtils.lerp(cacheMousePos.y || mousePos.y, mousePos.y, 0.1);

      if (distance > this.threshold) {
        this.showNextImage();

        this.zIndexVal += 1;
        this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;

        lastMousePos = { ...mousePos };
      }

      let isIdle = true;
      for (const img of this.images) {
        if (img.isActive()) {
          isIdle = false;
          break;
        }
      }

      if (isIdle && this.zIndexVal !== 1) {
        this.zIndexVal = 1;
      }

      requestAnimationFrame(() => this.render());
    }

    showNextImage() {
      const img = this.images[this.imgPosition];
      gsap.killTweensOf(img.DOM.el);

      gsap.timeline()
        .set(img.DOM.el, {
          opacity: 1,
          scale: 1,
          zIndex: this.zIndexVal,
          x: cacheMousePos.x - img.rect.width / 2,
          y: cacheMousePos.y - img.rect.height / 2,
        }, 0)
        .to(img.DOM.el, {
          duration: 0.9,
          ease: 'expo.out',
          x: mousePos.x - img.rect.width / 2,
          y: mousePos.y - img.rect.height / 2,
        }, 0)
        .to(img.DOM.el, {
          duration: 1,
          ease: 'power1.out',
          opacity: 0,
        }, 0.4)
        .to(img.DOM.el, {
          duration: 1,
          ease: 'power4.out',
          scale: 0.2,
        }, 0.4);
    }
  }

  function preloadImages() {
    const images = [...document.querySelectorAll('.content__img')];
    return Promise.all(images.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    }));
  }

  preloadImages().then(() => {
    new ImageTrail();
  });
});
