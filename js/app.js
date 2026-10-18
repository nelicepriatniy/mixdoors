const heroSlider = new Swiper('.hero-slider', {
  speed: 400,
  autoplay: {
    delay: 3000,
  },
  pagination: {
    el: '.hero-slider-padgination',
    type: 'bullets',
  },
  effect: 'fade',
  fadeEffect: {
    crossFade: true
  },
});
