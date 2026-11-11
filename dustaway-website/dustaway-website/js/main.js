/* =========================================================
   Dust Away — Landing page script (no dependencies)
   ========================================================= */
(function () {
  'use strict';

  var LINE_ID = '@065zopjp';
  var MIN_ORDER = 1990;
  var MULTI_DISCOUNT = 0.25;   // 2nd item onward
  var MITE_GUARD_DISCOUNT = 0.15;

  var lang = 'th';
  try { lang = localStorage.getItem('dustaway-lang') || 'th'; } catch (e) { /* storage blocked */ }

  var fmt = function (n) { return '฿' + Math.round(n).toLocaleString('en-US'); };
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* Strings that JavaScript writes into the page */
  var T = {
    th: {
      full: function (n) { return 'ราคาเต็ม (' + n + ' ชิ้น)'; },
      multi: 'ส่วนลดชิ้นที่ 2 ขึ้นไป 25%',
      minAdj: 'ปรับเป็นยอดขั้นต่ำ',
      mg: 'Mite Guard −15%',
      empty: 'เพิ่มที่นอนอย่างน้อย 1 ชิ้นเพื่อดูราคา',
      minNote: 'ยอดขั้นต่ำต่อครั้ง ฿1,990 · เพิ่มอีกชิ้นเพื่อความคุ้มค่า',
      total: 'ยอดรวม',
      perVisit: 'ต่อรอบ (ทุก 3 เดือน)',
      times: ' รอบ',
      deposit: 'มัดจำ 50% ที่ต้องโอน',
      balance: 'ชำระเมื่องานเสร็จ',
      quoteNote: 'ทีมงานจะแจ้งราคาและยอดมัดจำทาง LINE',
      required: 'กรุณากรอกข้อมูลให้ครบ: ',
      mattressNone: 'ที่นอน (ระบุขนาด/จำนวนในหมายเหตุ)',
      msgTitle: 'จองคิว Dust Away',
      fields: { service: 'บริการ', date: 'วันที่', time: 'เวลา', name: 'ชื่อ', phone: 'โทร', province: 'จังหวัด', type: 'ที่พัก', address: 'ที่อยู่', note: 'หมายเหตุ', mg: 'Mite Guard', total: 'ยอดรวม', deposit: 'มัดจำ 50%' },
      yes: 'สมัคร (ทุก 3 เดือน −15%)',
      quoteSubject: 'ขอใบเสนอราคา Dust Away สำหรับธุรกิจ',
      quoteBody: function (u, c, unit, annual) { return 'สวัสดีครับ/ค่ะ\n\nต้องการขอใบเสนอราคา\n- จำนวนที่นอน: ' + u + '\n- จำนวนรอบต่อปี: ' + c + '\n- ราคาประมาณการ: ' + unit + ' ต่อที่นอน/รอบ (' + annual + ' ต่อปี ไม่รวม VAT)\n\nชื่อธุรกิจ:\nประเภทธุรกิจ:\nชื่อผู้ติดต่อ:\nเบอร์โทร:\n'; },
      sizes: { s35: 'ที่นอน 3.5 ฟุต', s5: 'ที่นอน 5 ฟุต', s6: 'ที่นอน 6 ฟุต' }
    },
    en: {
      full: function (n) { return 'Full price (' + n + (n === 1 ? ' item)' : ' items)'); },
      multi: '25% off from 2nd item',
      minAdj: 'Adjusted to minimum order',
      mg: 'Mite Guard −15%',
      empty: 'Add at least 1 mattress to see the price',
      minNote: 'Minimum order is ฿1,990 · add another item for better value',
      total: 'Total',
      perVisit: 'Per visit (every 3 months)',
      times: '',
      deposit: '50% deposit to transfer',
      balance: 'Balance on completion',
      quoteNote: 'Our team will confirm the price and deposit on LINE',
      required: 'Please fill in: ',
      mattressNone: 'Mattress (sizes/quantity in note)',
      msgTitle: 'Dust Away booking',
      fields: { service: 'Service', date: 'Date', time: 'Time', name: 'Name', phone: 'Phone', province: 'Province', type: 'Home', address: 'Address', note: 'Note', mg: 'Mite Guard', total: 'Total', deposit: '50% deposit' },
      yes: 'Yes (every 3 months, −15%)',
      quoteSubject: 'Dust Away business quote request',
      quoteBody: function (u, c, unit, annual) { return 'Hello,\n\nI would like a quote:\n- Mattresses: ' + u + '\n- Visits per year: ' + c + '\n- Estimate: ' + unit + ' per mattress/visit (' + annual + ' per year, ex-VAT)\n\nBusiness name:\nBusiness type:\nContact name:\nPhone:\n'; },
      sizes: { s35: 'Mattress 3.5 ft', s5: 'Mattress 5 ft', s6: 'Mattress 6 ft' }
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
    renderCalc();
    renderBiz();
    renderDeposit();
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

  /* ---------------- Mattress price calculator ---------------- */
  var calcRows = $$('.qty-row');
  var calcMg = $('#calc-mg');
  var calcState = { items: [], full: 0, disc: 0, base: 0, total: 0, belowMin: false };

  function calculate() {
    var prices = [];
    var items = [];
    calcRows.forEach(function (row) {
      var count = parseInt($('output', row).value || $('output', row).textContent, 10) || 0;
      var price = parseInt(row.dataset.price, 10);
      if (count > 0) items.push({ size: row.dataset.size, count: count });
      for (var i = 0; i < count; i++) prices.push(price);
    });
    prices.sort(function (a, b) { return b - a; });
    var full = prices.reduce(function (a, b) { return a + b; }, 0);
    var disc = prices.slice(1).reduce(function (a, b) { return a + b * MULTI_DISCOUNT; }, 0);
    var sub = full - disc;
    var empty = prices.length === 0;
    var base = empty ? 0 : Math.max(sub, MIN_ORDER);
    var mg = calcMg && calcMg.checked;
    calcState = {
      items: items, count: prices.length, full: full, disc: disc, base: base, empty: empty,
      belowMin: !empty && sub < MIN_ORDER, mg: mg, total: mg ? base * (1 - MITE_GUARD_DISCOUNT) : base
    };
    return calcState;
  }

  function renderCalc() {
    if (!calcRows.length) return;
    var s = calculate();
    var lines = $('#calc-lines');
    lines.innerHTML = '';
    var add = function (label, value) {
      var div = document.createElement('div');
      div.className = 'line';
      var a = document.createElement('span'); a.textContent = label;
      var b = document.createElement('span'); b.textContent = value;
      div.appendChild(a); div.appendChild(b);
      lines.appendChild(div);
    };
    if (s.empty) {
      add(t().empty, '');
    } else {
      add(t().full(s.count), fmt(s.full));
      if (s.disc > 0) add(t().multi, '−' + fmt(s.disc));
      if (s.belowMin) add(t().minAdj, fmt(MIN_ORDER));
      if (s.mg) add(t().mg, '−' + fmt(s.base * MITE_GUARD_DISCOUNT));
    }
    var minEl = $('#calc-min');
    minEl.hidden = !s.belowMin;
    minEl.textContent = t().minNote;
    $('#calc-total-label').textContent = s.mg ? t().perVisit : t().total;
    $('#calc-total').textContent = fmt(s.total);
    $('#calc-deposit').textContent = fmt(s.total / 2);
    $('#calc-balance').textContent = fmt(s.total - Math.round(s.total / 2));
    renderDeposit();
  }

  calcRows.forEach(function (row) {
    var out = $('output', row);
    var set = function (d) {
      var v = Math.max(0, Math.min(20, (parseInt(out.textContent, 10) || 0) + d));
      out.textContent = String(v);
      out.value = String(v);
      renderCalc();
    };
    $('.inc', row).addEventListener('click', function () { set(1); });
    $('.dec', row).addEventListener('click', function () { set(-1); });
  });
  if (calcMg) calcMg.addEventListener('change', renderCalc);

  // "Book at this price" → choose mattress service in the booking form
  var calcBook = $('#calc-book');
  if (calcBook) calcBook.addEventListener('click', function () {
    selectService('mattress');
    var bkMg = $('#bk-mg');
    if (bkMg && calcMg) bkMg.checked = calcMg.checked;
    renderDeposit();
  });

  /* ---------------- Business estimator ---------------- */
  var bizUnits = $('#biz-units');
  function bizValues() {
    var u = parseInt(bizUnits.value, 10);
    var checked = $('input[name="cycles"]:checked');
    var c = checked ? parseInt(checked.value, 10) : 2;
    var unit = u >= 200 ? 690 : u >= 50 ? 790 : 890;
    var tier = u >= 200 ? 'Enterprise' : u >= 50 ? 'Growth' : 'Starter';
    return { u: u, c: c, unit: unit, tier: tier, annual: unit * u * c };
  }
  function renderBiz() {
    if (!bizUnits) return;
    var v = bizValues();
    $('#biz-units-out').textContent = String(v.u);
    $('#biz-tier').textContent = v.tier;
    $('#biz-unit').textContent = fmt(v.unit);
    $('#biz-annual').textContent = fmt(v.annual);
    var href = 'mailto:Dustaway.th@gmail.com?subject=' + encodeURIComponent(t().quoteSubject) +
      '&body=' + encodeURIComponent(t().quoteBody(v.u, v.c, fmt(v.unit), fmt(v.annual)));
    $('#biz-quote').setAttribute('href', href);
  }
  if (bizUnits) {
    bizUnits.addEventListener('input', renderBiz);
    $$('input[name="cycles"]').forEach(function (r) { r.addEventListener('change', renderBiz); });
  }

  /* ---------------- Booking form ---------------- */
  var form = $('#booking-form');
  var service = $('#bk-service');
  var bkMgBox = $('#bk-mg');

  function selectService(value) {
    if (!service) return;
    service.value = value;
    renderDeposit();
  }

  // Package buttons preselect their package
  $$('[data-pkg]').forEach(function (btn) {
    btn.addEventListener('click', function () { selectService(btn.dataset.pkg); });
  });
  var mgCta = $('#mg-cta');
  if (mgCta) mgCta.addEventListener('click', function () { if (bkMgBox) bkMgBox.checked = true; renderDeposit(); });

  function bookingPrice() {
    if (!service) return 0;
    if (service.value === 'mattress') {
      if (calcState.empty) return 0;
      var base = calcState.base;
      return bkMgBox && bkMgBox.checked ? base * (1 - MITE_GUARD_DISCOUNT) : base;
    }
    var p = parseInt(service.options[service.selectedIndex].dataset.price, 10) || 0;
    return bkMgBox && bkMgBox.checked ? p * (1 - MITE_GUARD_DISCOUNT) : p;
  }

  function mattressSummary() {
    if (calcState.empty) return t().mattressNone;
    return calcState.items.map(function (i) { return t().sizes[i.size] + ' × ' + i.count; }).join(', ');
  }

  function renderDeposit() {
    var box = $('#bk-deposit');
    if (!box || !service) return;
    var total = bookingPrice();
    box.hidden = false;
    box.innerHTML = '';
    var mk = function (label, value) {
      var span = document.createElement('span');
      span.textContent = label + ' ';
      var b = document.createElement('b');
      b.textContent = value;
      span.appendChild(b);
      box.appendChild(span);
    };
    if (total > 0) {
      mk(t().fields.total + ':', fmt(total));
      mk(t().deposit + ':', fmt(total / 2));
    } else {
      var p = document.createElement('span');
      p.textContent = t().quoteNote;
      box.appendChild(p);
    }
  }
  if (service) service.addEventListener('change', renderDeposit);
  if (bkMgBox) bkMgBox.addEventListener('change', renderDeposit);

  // Earliest bookable date = tomorrow (local time)
  var dateInput = $('#bk-date');
  if (dateInput) {
    var d = new Date();
    d.setDate(d.getDate() + 1);
    var iso = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    dateInput.min = iso;
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
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
      var err = $('#bk-error');
      if (missing.length) {
        err.hidden = false;
        err.textContent = t().required + missing.join(', ');
        var first = required.filter(function (el) { return el.getAttribute('aria-invalid') === 'true'; })[0];
        if (first) first.focus();
        return;
      }
      err.hidden = true;

      var f = t().fields;
      var opt = service.options[service.selectedIndex];
      var serviceText = service.value === 'mattress' ? mattressSummary() : opt.textContent.trim();
      var total = bookingPrice();
      var v = function (id) { var el = $(id); return el ? String(el.value || '').trim() : ''; };
      var sel = function (id) { var el = $(id); return el ? el.options[el.selectedIndex].textContent.trim() : ''; };

      var lines = [
        t().msgTitle,
        f.service + ': ' + serviceText,
        f.date + ': ' + v('#bk-date') + ' ' + f.time + ': ' + v('#bk-time'),
        f.name + ': ' + v('#bk-name'),
        f.phone + ': ' + v('#bk-phone'),
        f.province + ': ' + sel('#bk-province') + ' (' + sel('#bk-type') + ')',
        f.address + ': ' + v('#bk-address')
      ];
      if (bkMgBox && bkMgBox.checked) lines.push(f.mg + ': ' + t().yes);
      if (v('#bk-note')) lines.push(f.note + ': ' + v('#bk-note'));
      if (total > 0) lines.push(f.total + ': ' + fmt(total) + ' · ' + f.deposit + ': ' + fmt(total / 2));

      var url = 'https://line.me/R/oaMessage/' + encodeURIComponent(LINE_ID) + '/?' + encodeURIComponent(lines.join('\n'));
      window.open(url, '_blank', 'noopener');
    });
  }

  /* ---------------- Init ---------------- */
  var year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
  applyLang(lang);
})();
