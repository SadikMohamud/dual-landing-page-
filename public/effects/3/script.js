document.addEventListener('DOMContentLoaded', () => {
  const mask = document.getElementById('mask');
  const target = document.getElementById('mask-target');

  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let size = 40;

  const renderMask = () => {
    gsap.set(mask, {
      webkitMaskPosition: `${mouse.x - size / 2}px ${mouse.y - size / 2}px`,
      maskPosition: `${mouse.x - size / 2}px ${mouse.y - size / 2}px`,
      webkitMaskSize: `${size}px`,
      maskSize: `${size}px`
    });
  };

  renderMask();

  window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;

    gsap.to(mask, {
      webkitMaskPosition: `${mouse.x - size / 2}px ${mouse.y - size / 2}px`,
      maskPosition: `${mouse.x - size / 2}px ${mouse.y - size / 2}px`,
      duration: 0.18,
      ease: 'power2.out',
      overwrite: true
    });
  });

  target.addEventListener('mouseenter', () => {
    size = 400;

    gsap.to(mask, {
      webkitMaskSize: `${size}px`,
      maskSize: `${size}px`,
      webkitMaskPosition: `${mouse.x - size / 2}px ${mouse.y - size / 2}px`,
      maskPosition: `${mouse.x - size / 2}px ${mouse.y - size / 2}px`,
      duration: 0.5,
      ease: 'back.out(1.7)'
    });
  });

  target.addEventListener('mouseleave', () => {
    size = 40;

    gsap.to(mask, {
      webkitMaskSize: `${size}px`,
      maskSize: `${size}px`,
      webkitMaskPosition: `${mouse.x - size / 2}px ${mouse.y - size / 2}px`,
      maskPosition: `${mouse.x - size / 2}px ${mouse.y - size / 2}px`,
      duration: 0.4,
      ease: 'power3.out'
    });
  });
});
