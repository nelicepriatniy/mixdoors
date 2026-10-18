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

const headerBurger = document.querySelector('.header-burger');
const catalogDrawer = document.querySelector('#catalogDrawer');
const overlay = document.querySelector('.overlay');
const catalogDrawerClose = catalogDrawer.querySelector('.close');
const menuSectionBtns = catalogDrawer.querySelectorAll('button.menu-section-btn');
const leadModal = document.querySelector('#leadModal');

function openCatalogDrawer() {
  catalogDrawer.classList.add('active');
  overlay.classList.add('active');
  document.documentElement.classList.add('lock');
}

function closeOverlays() {
  catalogDrawer.classList.remove('active');
  leadModal.classList.remove('active');
  overlay.classList.remove('active');
  document.documentElement.classList.remove('lock');
}

headerBurger.addEventListener('click', openCatalogDrawer);
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
