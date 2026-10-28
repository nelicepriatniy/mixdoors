const heroSliderEl = document.querySelector('.hero-slider');

if (heroSliderEl) {
  const heroCurrent = document.querySelector('.hero .slider-nums .current');
  const heroCount = document.querySelector('.hero .slider-nums .count');

  function formatSlideNum(num) {
    return String(num).padStart(2, '0');
  }

  const heroSlider = new Swiper(heroSliderEl, {
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
    on: {
      init(swiper) {
        heroCurrent.textContent = formatSlideNum(swiper.realIndex + 1);
        heroCount.textContent = formatSlideNum(swiper.slides.length);
      },
      slideChange(swiper) {
        heroCurrent.textContent = formatSlideNum(swiper.realIndex + 1);
      },
    },
  });
}

// ===== Популярные модели =====

const popularSliderEl = document.querySelector('.popular-slider');
const popularMedia = window.matchMedia('(max-width: 1280px)');
let popularSlider = null;

function mountPopularSlider() {
  if (!popularSliderEl || popularSlider) return;
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  popularSlider = new Swiper(popularSliderEl, {
    slidesPerView: 'auto',
    spaceBetween: 12 * rem,
    speed: 400,
  });
}

function unmountPopularSlider() {
  if (!popularSlider) return;
  popularSlider.destroy(true, true);
  popularSlider = null;
}

function syncPopularSlider() {
  if (popularMedia.matches) {
    mountPopularSlider();
  } else {
    unmountPopularSlider();
  }
}

if (popularSliderEl) {
  syncPopularSlider();
  popularMedia.addEventListener('change', syncPopularSlider);
}

const headerBurger = document.querySelector('.header-burger');
const catalogDrawer = document.querySelector('#catalogDrawer');
const overlay = document.querySelector('.overlay');
const catalogDrawerClose = catalogDrawer.querySelector('.close');
const menuSectionBtns = catalogDrawer.querySelectorAll('button.menu-section-btn');
const leadModal = document.querySelector('#leadModal');
const zoomModal = document.querySelector('.zoom-modal');
const searchModal = document.querySelector('#searchModal');

function openCatalogDrawer() {
  catalogDrawer.classList.add('active');
  overlay.classList.add('active');
  document.documentElement.classList.add('lock');
}

function closeOverlays() {
  catalogDrawer.classList.remove('active');
  leadModal.classList.remove('active');
  if (zoomModal) {
    zoomModal.classList.remove('active');
    const zoomImage = zoomModal.querySelector('.zoom-stage img');
    if (zoomImage) {
      zoomImage.style.transform = '';
    }
  }
  if (searchModal) {
    searchModal.classList.remove('active');
  }
  overlay.classList.remove('active');
  document.documentElement.classList.remove('lock');
}

headerBurger.addEventListener('click', openCatalogDrawer);

// ===== Поиск =====

const searchOpeners = document.querySelectorAll('.header-search, .search-icon');
const searchClose = searchModal ? searchModal.querySelector('.close') : null;
const searchForm = searchModal ? searchModal.querySelector('.search-form') : null;
const searchInput = searchModal ? searchModal.querySelector('.search-input') : null;

function openSearch() {
  closeOverlays();
  overlay.classList.add('active');
  searchModal.classList.add('active');
  document.documentElement.classList.add('lock');
  setTimeout(() => searchInput.focus(), 100);
}

if (searchModal) {
  searchOpeners.forEach((opener) => {
    opener.addEventListener('click', openSearch);
  });

  searchClose.addEventListener('click', closeOverlays);
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
  });
}

// ===== Мобильное меню =====

const mobileToggle = document.querySelector('.mobile-toggle');

if (mobileToggle) {
  mobileToggle.addEventListener('click', openCatalogDrawer);
}
catalogDrawerClose.addEventListener('click', closeOverlays);
overlay.addEventListener('click', closeOverlays);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeOverlays();
  }
});

menuSectionBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    btn.nextElementSibling.classList.toggle('active');
  });
});

const toastEl = document.querySelector('.toast');
let toastTimer = null;

function showToast(text) {
  toastEl.textContent = text;
  toastEl.classList.add('active');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove('active');
  }, 2600);
}

const leadTypes = {
  measure: ['Бесплатный замер', 'Специалист свяжется с вами и согласует удобное время замера.'],
  chat: ['Задать вопрос', 'Оставьте телефон или комментарий - специалист ответит по вашему вопросу.'],
  calc: ['Заявка на расчёт', 'Оставьте контакты - менеджер уточнит размеры, комплектацию и подготовит расчёт стоимости.'],
  estimate: ['Рассчитать решение', 'Расскажите о задаче - мы уточним детали и предложим следующий шаг.'],
  service: ['Рассчитать стоимость', 'Оставьте контакты - менеджер уточнит объём работ.'],
};

const leadBtns = document.querySelectorAll('[data-lead]');
const leadHeading = leadModal.querySelector('.modal-head .heading');
const leadText = leadModal.querySelector('.modal-body .text');
const leadClose = leadModal.querySelector('.close');
const leadForm = leadModal.querySelector('.lead-form');

function openLead(type) {
  const lead = leadTypes[type] || leadTypes.measure;
  leadHeading.textContent = lead[0];
  leadText.textContent = lead[1];
  overlay.classList.add('active');
  leadModal.classList.add('active');
}

leadBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    openLead(btn.dataset.lead);
  });
});

leadClose.addEventListener('click', closeOverlays);

const phoneTemplate = '+7 (___) ___-__-__';
const phonePositions = [4, 5, 6, 9, 10, 11, 13, 14, 16, 17];
const phoneInputs = document.querySelectorAll('.phone-mask');

function formatPhone(digits) {
  const chars = phoneTemplate.split('');
  digits.split('').forEach((d, i) => {
    chars[phonePositions[i]] = d;
  });
  return chars.join('');
}

function setPhoneDigits(input, digits) {
  input.dataset.digits = digits.slice(0, 10);
  input.value = formatPhone(input.dataset.digits);
  const next = input.value.indexOf('_');
  const pos = next < 0 ? input.value.length : next;
  input.setSelectionRange(pos, pos);
  input.closest('.field').classList.remove('error');
}

phoneInputs.forEach((input) => {
  input.dataset.digits = '';

  input.addEventListener('focus', () => {
    setTimeout(() => setPhoneDigits(input, input.dataset.digits), 0);
  });

  input.addEventListener('keydown', (e) => {
    if (/^\d$/.test(e.key)) {
      e.preventDefault();
      setPhoneDigits(input, input.dataset.digits + e.key);
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      setPhoneDigits(input, input.dataset.digits.slice(0, -1));
    } else if (!['Tab', 'Shift', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
      e.preventDefault();
    }
  });

  input.addEventListener('paste', (e) => {
    e.preventDefault();
    let digits = e.clipboardData.getData('text').replace(/\D/g, '');
    if (digits.length === 11 && (digits[0] === '7' || digits[0] === '8')) {
      digits = digits.slice(1);
    }
    setPhoneDigits(input, digits);
  });

  input.addEventListener('blur', () => {
    if (!input.dataset.digits) {
      input.value = '';
    }
  });
});

function validateForm(form) {
  let firstInvalid = null;
  const name = form.querySelector('[name="name"]');
  const phone = form.querySelector('.phone-mask');
  const consent = form.querySelector('.consent');
  const consentInput = consent.querySelector('input');
  const consentError = form.querySelector('.consent-error');

  form.querySelectorAll('.field').forEach((field) => field.classList.remove('error'));
  consent.classList.remove('error');
  consentError.classList.remove('active');

  if (!name.value.trim()) {
    name.closest('.field').classList.add('error');
    firstInvalid = firstInvalid || name;
  }

  if (phone.dataset.digits.length !== 10) {
    phone.closest('.field').classList.add('error');
    firstInvalid = firstInvalid || phone;
  }

  if (!consentInput.checked) {
    consent.classList.add('error');
    consentError.classList.add('active');
    firstInvalid = firstInvalid || consentInput;
  }

  if (firstInvalid) {
    firstInvalid.focus();
  }

  return !firstInvalid;
}

leadForm.querySelector('[name="name"]').addEventListener('input', (e) => {
  e.target.closest('.field').classList.remove('error');
});

leadForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validateForm(leadForm)) return;
  closeOverlays();
  showToast('Спасибо! Заявка отправлена.');
});

const cookie = document.querySelector('#cookie');

function setCookieConsent(value) {
  localStorage.setItem('siteCookies', value);
  cookie.classList.remove('active');
}

cookie.querySelector('.cookie-accept').addEventListener('click', () => {
  setCookieConsent('accepted');
  showToast('Настройки cookies сохранены');
});

cookie.querySelector('.cookie-decline').addEventListener('click', () => {
  setCookieConsent('necessary');
});

cookie.querySelector('.cookie-close').addEventListener('click', () => {
  setCookieConsent('necessary');
});

if (!localStorage.getItem('siteCookies')) {
  setTimeout(() => {
    cookie.classList.add('active');
  }, 700);
}


// ===== Каталог =====

const filterGroups = document.querySelectorAll('.filter-group');

filterGroups.forEach((group) => {
  const title = group.querySelector('.filter-group-title');
  if (!title) return;
  title.addEventListener('click', () => {
    group.classList.toggle('collapsed');
  });
});

const mobileFilterToggle = document.querySelector('.mobile-filter-toggle');

if (mobileFilterToggle) {
  mobileFilterToggle.addEventListener('click', () => {
    const box = document.querySelector('.catalog .filter-box');
    if (!box) return;
    const willOpen = !box.classList.contains('mobile-open');
    box.classList.toggle('mobile-open', willOpen);
    mobileFilterToggle.classList.toggle('active', willOpen);
    mobileFilterToggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    const label = mobileFilterToggle.querySelector('span');
    if (label) {
      label.textContent = willOpen ? 'Скрыть фильтры' : 'Все фильтры';
    }
    if (willOpen) {
      box.querySelectorAll('.filter-group.collapsed').forEach((group) => {
        group.classList.remove('collapsed');
      });
      box.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  });
}

const sortSelect = document.querySelector('.sort-select');

if (sortSelect) {
  const sortTrigger = sortSelect.querySelector('.sort-select-trigger');
  const sortTriggerText = sortTrigger.querySelector('span');
  const sortOptions = sortSelect.querySelectorAll('.sort-select-option');

  sortTrigger.addEventListener('click', () => {
    sortSelect.classList.toggle('active');
  });

  sortOptions.forEach((option) => {
    option.addEventListener('click', () => {
      sortOptions.forEach((item) => item.classList.remove('active'));
      option.classList.add('active');
      sortTriggerText.textContent = option.textContent;
      sortSelect.classList.remove('active');
    });
  });

  document.addEventListener('click', (e) => {
    if (!sortSelect.contains(e.target)) {
      sortSelect.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      sortSelect.classList.remove('active');
    }
  });
}


// ===== Зум =====

let openZoom = function () {};

if (zoomModal) {
  const zoomImage = zoomModal.querySelector('.zoom-stage img');
  const zoomStage = zoomModal.querySelector('.zoom-stage');
  const zoomHeading = zoomModal.querySelector('.zoom-head .heading');
  const zoomClose = zoomModal.querySelector('.close');
  const zoomTools = zoomModal.querySelectorAll('.zoom-tool[data-zoom]');
  let productZoomScale = 1;
  let productZoomX = 0;
  let productZoomY = 0;
  let productZoomDragging = false;
  let productZoomPointer = null;
  let productZoomStartX = 0;
  let productZoomStartY = 0;
  let productZoomOriginX = 0;
  let productZoomOriginY = 0;

  function applyProductZoom() {
    zoomImage.style.transform = `translate3d(${productZoomX}px, ${productZoomY}px, 0) scale(${productZoomScale})`;
    zoomStage.classList.toggle('is-zoomed', productZoomScale > 1);
    zoomStage.classList.toggle('is-dragging', productZoomDragging);
  }

  function clampProductPan() {
    if (productZoomScale <= 1) {
      productZoomX = 0;
      productZoomY = 0;
      return;
    }

    const maxX = Math.max(0, (zoomImage.clientWidth * (productZoomScale - 1)) / 2);
    const maxY = Math.max(0, (zoomImage.clientHeight * (productZoomScale - 1)) / 2);
    productZoomX = Math.max(-maxX, Math.min(maxX, productZoomX));
    productZoomY = Math.max(-maxY, Math.min(maxY, productZoomY));
  }

  function resetProductZoom() {
    productZoomScale = 1;
    productZoomX = 0;
    productZoomY = 0;
    productZoomDragging = false;
    productZoomPointer = null;
    applyProductZoom();
  }

  function setProductZoom(delta) {
    productZoomScale = Math.max(1, Math.min(4, productZoomScale + delta));
    clampProductPan();
    applyProductZoom();
  }

  openZoom = function (src, title) {
    if (src) zoomImage.src = src;
    if (title && zoomHeading) zoomHeading.textContent = title;
    resetProductZoom();
    overlay.classList.add('active');
    zoomModal.classList.add('active');
    document.documentElement.classList.add('lock');
  };

  zoomClose.addEventListener('click', closeOverlays);

  zoomTools.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.zoom === 'reset') {
        resetProductZoom();
        return;
      }
      setProductZoom(Number(btn.dataset.zoom));
    });
  });

  zoomStage.addEventListener('wheel', (e) => {
    e.preventDefault();
    setProductZoom(e.deltaY < 0 ? 0.2 : -0.2);
  }, { passive: false });

  zoomStage.addEventListener('pointerdown', (e) => {
    if (productZoomScale <= 1 || e.button !== 0) return;
    productZoomDragging = true;
    productZoomPointer = e.pointerId;
    productZoomStartX = e.clientX;
    productZoomStartY = e.clientY;
    productZoomOriginX = productZoomX;
    productZoomOriginY = productZoomY;
    zoomStage.setPointerCapture(e.pointerId);
    applyProductZoom();
    e.preventDefault();
  });

  zoomStage.addEventListener('pointermove', (e) => {
    if (!productZoomDragging || e.pointerId !== productZoomPointer) return;
    productZoomX = productZoomOriginX + (e.clientX - productZoomStartX);
    productZoomY = productZoomOriginY + (e.clientY - productZoomStartY);
    clampProductPan();
    applyProductZoom();
    e.preventDefault();
  });

  function endZoomPan() {
    if (!productZoomDragging) return;
    if (productZoomPointer !== null) {
      try {
        zoomStage.releasePointerCapture(productZoomPointer);
      } catch (err) { }
    }
    productZoomDragging = false;
    productZoomPointer = null;
    applyProductZoom();
  }

  zoomStage.addEventListener('pointerup', endZoomPan);
  zoomStage.addEventListener('pointercancel', endZoomPan);
  zoomStage.addEventListener('pointerleave', endZoomPan);

  document.querySelectorAll('.gallery .item').forEach((item) => {
    item.addEventListener('click', () => {
      const image = item.querySelector('img');
      const name = item.querySelector('.name');
      if (!image) return;
      openZoom(image.src, name ? name.textContent.trim() : '');
    });
  });
}

// ===== Карточка товара =====

const productSliderEl = document.querySelector('.product-slider');

if (productSliderEl) {
  const productThumbs = document.querySelectorAll('.product-thumbs .thumb');

  const productSlider = new Swiper(productSliderEl, {
    speed: 400,
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    on: {
      slideChange(swiper) {
        productThumbs.forEach((thumb, i) => {
          thumb.classList.toggle('active', i === swiper.realIndex);
        });
      },
    },
  });

  productThumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => {
      productSlider.slideTo(i);
    });
  });

  productSliderEl.addEventListener('click', () => {
    const activeSlide = productSlider.slides[productSlider.activeIndex];
    const image = activeSlide.querySelector('img');
    if (image) openZoom(image.src);
  });

  document.querySelectorAll('.product-info .options').forEach((group) => {
    const options = group.querySelectorAll('.option');

    options.forEach((option) => {
      option.addEventListener('click', () => {
        options.forEach((item) => item.classList.remove('active'));
        option.classList.add('active');
      });
    });
  });

  const packages = document.querySelectorAll('.purchase .package');
  const unitPrice = document.querySelector('.purchase .unit-price');
  const totalPrice = document.querySelector('.purchase-sum-r .price');
  const composition = document.querySelector('.purchase .set-composition');

  const qtyBox = document.querySelector('.purchase .qty');
  const qtyNum = qtyBox ? qtyBox.querySelector('span') : null;
  let productQty = 1;

  function formatProductPrice(value) {
    const prefix = document.querySelector('.purchase')?.dataset.prefix || '';
    return `${prefix}${value.toLocaleString('ru-RU')} ₽`;
  }

  function updatePurchasePrice() {
    const active = document.querySelector('.purchase .package.active strong');
    if (active && unitPrice && totalPrice) {
      const unit = Number(active.textContent.replace(/\D/g, '')) || 0;
      unitPrice.textContent = formatProductPrice(unit);
      totalPrice.textContent = formatProductPrice(unit * productQty);
      if (qtyNum) qtyNum.textContent = String(productQty);
      return;
    }

    const size = document.querySelector('.entrance-size-options .option.active');
    const base = Number(document.querySelector('.purchase')?.dataset.price) || 0;
    if (!size || !unitPrice || !totalPrice || !base) return;

    if (size.dataset.request === '1') {
      unitPrice.textContent = 'По запросу';
      totalPrice.textContent = 'По запросу';
      if (composition) composition.textContent = 'Для размера более 2400 × 1100 нужен индивидуальный расчёт';
    } else {
      const multiplier = Number(size.dataset.multiplier) || 1;
      const unit = Math.round(base * multiplier);
      unitPrice.textContent = formatProductPrice(unit);
      totalPrice.textContent = formatProductPrice(unit * productQty);
      if (composition) {
        composition.textContent = multiplier > 1
          ? 'К стоимости применено увеличение +20%'
          : 'Цена указана за выбранную комплектацию';
      }
    }

    if (qtyNum) qtyNum.textContent = String(productQty);
  }

  document.querySelectorAll('.entrance-size-options .option').forEach((option) => {
    option.addEventListener('click', updatePurchasePrice);
  });

  packages.forEach((card) => {
    card.addEventListener('click', () => {
      packages.forEach((item) => item.classList.remove('active'));
      card.classList.add('active');
      if (composition) composition.textContent = card.querySelector('.package-title').textContent;
      updatePurchasePrice();
    });
  });

  if (qtyBox) {
    qtyBox.addEventListener('click', (event) => {
      const button = event.target.closest('button');
      if (!button) return;
      productQty = Math.max(1, productQty + Number(button.dataset.qty));
      updatePurchasePrice();
    });
  }
}


// ===== Механизмы =====

// ===== Акции =====

// ===== Доставка =====

// ===== Установка =====

// ===== Панели =====

// ===== Корзина =====
