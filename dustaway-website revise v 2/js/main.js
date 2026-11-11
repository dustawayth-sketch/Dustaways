/* =========================================================
   Dust Away — Landing page script (no dependencies)
   Language toggle, mobile menu, booking + business forms → LINE
   ========================================================= */
(function () {
  'use strict';

  var LINE_ID = '@065zopjp';

  var lang = 'th';
  try { lang = localStorage.getItem('dustaway-lang') || 'th'; } catch (e) { /* storage blocked */ }

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var T = {
    th: {
      required: 'กรุณากรอกข้อมูลให้ครบ: ',
      bookingTitle: 'จองคิว Dust Away',
      bizTitle: 'ขอใบเสนอราคาธุรกิจ Dust Away',
      f: { service: 'บริการ', date: 'วันที่', time: 'เวลา', name: 'ชื่อ', phone: 'โทร', province: 'จังหวัด', type: 'ที่พัก', address: 'ที่อยู่', note: 'รายการ/หมายเหตุ', mg: 'Mite Guard', business: 'ธุรกิจ', bizType: 'ประเภท', units: 'จำนวนที่นอน', contact: 'ผู้ติดต่อ' },
      yes: 'สมัคร (ทุก 3 เดือน)',
      askPrice: 'รบกวนแจ้งราคาด้วยครับ/ค่ะ'
    },
    en: {
      required: 'Please fill in: ',
      bookingTitle: 'Dust Away booking',
      bizTitle: 'Dust Away business quote request',
      f: { service: 'Service', date: 'Date', time: 'Time', name: 'Name', phone: 'Phone', province: 'Province', type: 'Home', address: 'Address', note: 'Items/notes', mg: 'Mite Guard', business: 'Business', bizType: 'Type', units: 'Mattresses', contact: 'Contact' },
      yes: 'Yes (every 3 months)',
      askPrice: 'Please let me know the price.'
    }
  };
  var t = function () { return T[lang]; };

  /* ---------------- Language toggle ---------------- */
  // Thai is written in the HTML; English lives in data-en / data-en-html / data-en-placeholder.
  $$('[data-en]').forEach(function (el) { el.setAttribute('data-th', el.textContent); });
  $$('[data-en-html]').forEach(function (el) { el.setAttribute('data-th-html', el.innerHTML); });
  $$('[data-en-placeholder]').forEach(function (el) { el.setAttribute('data-th-placeholder', el.getAttribute('placeholder') || ''); });

  function applyLang(next) {
    lang = next === 'en' ? 'en' : 'th';
    document.documentElement.lang = lang;
    $$('[data-en]').forEach(function (el) { el.textContent = el.getAttribute(lang === 'en' ? 'data-en' : 'data-th'); });
    $$('[data-en-html]').forEach(function (el) { el.innerHTML = el.getAttribute(lang === 'en' ? 'data-en-html' : 'data-th-html'); });
    $$('[data-en-placeholder]').forEach(function (el) { el.setAttribute('placeholder', el.getAttribute(lang === 'en' ? 'data-en-placeholder' : 'data-th-placeholder')); });
    $$('.lang-switch button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === lang)); });
    try { localStorage.setItem('dustaway-lang', lang); } catch (e) { /* ignore */ }
  }
  $$('.lang-switch button').forEach(function (b) {
    b.addEventListener('click', function () { applyLang(b.dataset.lang); });
  });

  /* ---------------- Mobile menu ---------------- */
  var menuBtn = $('.menu-toggle');
  var nav = $('#main-nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    $$('a', nav).forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); });
    });
  }

  /* ---------------- Preselect service from cards/packages ---------------- */
  var service = $('#bk-service');
  $$('[data-service]').forEach(function (el) {
    el.addEventListener('click', function () { if (service) service.value = el.dataset.service; });
  });
  var mgCta = $('#mg-cta');
  if (mgCta) mgCta.addEventListener('click', function () { var mg = $('#bk-mg'); if (mg) mg.checked = true; });

  // Earliest bookable date = tomorrow (local time)
  var dateInput = $('#bk-date');
  if (dateInput) {
    var d = new Date();
    d.setDate(d.getDate() + 1);
    dateInput.min = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  /* ---------------- Helpers ---------------- */
  function validate(form, errorEl) {
    var required = $$('[required]', form);
    var missing = [];
    required.forEach(function (el) {
      var bad = !String(el.value || '').trim();
      el.setAttribute('aria-invalid', String(bad));
      if (bad) {
        var label = form.querySelector('label[for="' + el.id + '"]');
        missing.push(label ? label.textContent.trim() : el.name);
      }
    });
    if (missing.length) {
      errorEl.hidden = false;
      errorEl.textContent = t().required + missing.join(', ');
      var first = required.filter(function (el) { return el.getAttribute('aria-invalid') === 'true'; })[0];
      if (first) first.focus();
      return false;
    }
    errorEl.hidden = true;
    return true;
  }
  var val = function (id) { var el = $(id); return el ? String(el.value || '').trim() : ''; };
  var sel = function (id) { var el = $(id); return el && el.options ? el.options[el.selectedIndex].textContent.trim() : ''; };
  function openLine(lines) {
    var url = 'https://line.me/R/oaMessage/' + encodeURIComponent(LINE_ID) + '/?' + encodeURIComponent(lines.join('\n'));
    window.open(url, '_blank', 'noopener');
  }

  /* ---------------- Booking form → LINE ---------------- */
  var form = $('#booking-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate(form, $('#bk-error'))) return;
      var f = t().f;
      var lines = [
        t().bookingTitle,
        f.service + ': ' + sel('#bk-service'),
        f.date + ': ' + val('#bk-date') + '  ' + f.time + ': ' + val('#bk-time'),
        f.name + ': ' + val('#bk-name'),
        f.phone + ': ' + val('#bk-phone'),
        f.province + ': ' + sel('#bk-province') + ' (' + sel('#bk-type') + ')',
        f.address + ': ' + val('#bk-address')
      ];
      if (val('#bk-note')) lines.push(f.note + ': ' + val('#bk-note'));
      var mg = $('#bk-mg');
      if (mg && mg.checked) lines.push(f.mg + ': ' + t().yes);
      lines.push(t().askPrice);
      openLine(lines);
    });
  }

  /* ---------------- Business quote form → LINE ---------------- */
  var bizForm = $('#biz-form');
  if (bizForm) {
    bizForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate(bizForm, $('#bz-error'))) return;
      var f = t().f;
      openLine([
        t().bizTitle,
        f.business + ': ' + val('#bz-name'),
        f.bizType + ': ' + sel('#bz-type'),
        f.units + ': ' + val('#bz-units'),
        f.contact + ': ' + val('#bz-contact'),
        f.phone + ': ' + val('#bz-phone')
      ]);
    });
  }

  /* ---------------- Init ---------------- */
  var year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
  applyLang(lang);
})();
