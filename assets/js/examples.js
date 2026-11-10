/* RAENKO — интерактивные примеры работ (RAE-21). Без зависимостей. */
(function () {
  'use strict';
  var root = document.querySelector('.rx');
  if (!root) return;

  var $ = function (s, el) { return (el || root).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || root).querySelectorAll(s)); };
  var rub = function (n) { return Math.round(n).toLocaleString('ru-RU').replace(/,/g, ' ') + ' ₽'; };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var el = function (tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  var now = function () { var d = new Date(); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); };

  /* плавная анимация числа */
  function tween(node, to, fmt) {
    var from = parseFloat(node.dataset.v || '0');
    node.dataset.v = to;
    if (reduce || from === to) { node.textContent = fmt(to); return; }
    var t0 = performance.now(), dur = 450;
    cancelAnimationFrame(node._raf);
    (function step(t) {
      var k = Math.min(1, (t - t0) / dur); k = 1 - Math.pow(1 - k, 3);
      node.textContent = fmt(from + (to - from) * k);
      if (k < 1) node._raf = requestAnimationFrame(step);
    })(t0);
  }

  /* заливка ползунков */
  function paintRange(r) { r.style.setProperty('--fill', ((r.value - r.min) / (r.max - r.min) * 100) + '%'); }
  $$('input[type="range"]').forEach(function (r) { paintRange(r); r.addEventListener('input', function () { paintRange(r); }); });

  /* группы чипов-радио */
  function radioGroup(group, onChange) {
    group.addEventListener('click', function (e) {
      var b = e.target.closest('.rx-chip'); if (!b) return;
      $$('.rx-chip', group).forEach(function (c) { c.classList.toggle('is-on', c === b); c.setAttribute('aria-checked', c === b); });
      onChange && onChange(b);
    });
  }

  /* сегментные переключатели */
  function segment(seg, attr, scope) {
    seg.addEventListener('click', function (e) {
      var b = e.target.closest('.rx-seg-btn'); if (!b) return;
      var v = b.dataset[attr];
      $$('.rx-seg-btn', seg).forEach(function (x) { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', x === b); });
      if (scope) $$('[data-' + attr + ']', scope).forEach(function (p) { if (!p.classList.contains('rx-seg-btn')) p.hidden = p.dataset[attr] !== v; });
      seg.dispatchEvent(new CustomEvent('rx:change', { detail: v }));
    });
  }

  /* ================= Вкладки ================= */
  var tabs = $$('.rx-tab');
  function openTab(t, focus) {
    tabs.forEach(function (x) {
      var on = x === t;
      x.classList.toggle('is-active', on); x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1;
      var p = document.getElementById(x.getAttribute('aria-controls'));
      p.hidden = !on; p.classList.toggle('is-active', on);
    });
    window.dispatchEvent(new Event('resize'));
    if (focus) t.focus();
    // прокручиваем только ленту вкладок по горизонтали, страницу не двигаем
    var bar = t.parentElement;
    if (bar && bar.scrollWidth > bar.clientWidth) {
      var x = t.offsetLeft - (bar.clientWidth - t.offsetWidth) / 2;
      bar.scrollTo({ left: Math.max(0, x), behavior: reduce ? 'auto' : 'smooth' });
    }
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { openTab(t); });
    t.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (d) { e.preventDefault(); openTab(tabs[(i + d + tabs.length) % tabs.length], true); }
    });
  });

  /* ================= 01 Сайт → бот → CRM ================= */
  (function () {
    var form = $('#rx-flow-form'); if (!form) return;
    var service = 'Поддерживающая', num = 1042;
    var feed = $('#rx-tg-feed'), rows = $('#rx-crm-rows'), note = $('.rx-form-note', form);
    var arrows = $$('.rx-flow-arrow'), btn = $('button[type="submit"]', form);
    var STAT = ['Новая', 'В работе', 'Выполнена'];

    radioGroup($('.rx-chips', form), function (b) { service = b.dataset.val; });

    rows.addEventListener('click', function (e) {
      var s = e.target.closest('.rx-status'); if (!s) return;
      var n = (+s.dataset.s + 1) % 3; s.dataset.s = n; s.textContent = STAT[n];
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim(), phone = form.phone.value.trim();
      if (!name || !phone) { note.style.color = '#C2400F'; note.textContent = 'Заполните имя и телефон'; return; }
      note.style.color = ''; note.textContent = '';
      btn.disabled = true;
      var id = num++, t = now(), step = reduce ? 0 : 650;

      arrows[0].classList.add('is-hot');
      setTimeout(function () {
        var m = el('div', 'rx-tg-msg is-new');
        m.appendChild(el('b', null, 'Новая заявка №' + id));
        m.appendChild(document.createTextNode(name + ' · ' + phone));
        m.appendChild(el('br'));
        m.appendChild(document.createTextNode(service + ' уборка'));
        var acts = el('div', 'rx-tg-acts');
        var accept = el('button', null, 'Принять'), call = el('button', null, 'Позвонить');
        accept.type = call.type = 'button'; accept.dataset.id = id;
        acts.appendChild(accept); acts.appendChild(call);
        var reply = el('div', 'rx-tg-reply'); reply.hidden = true;
        m.appendChild(acts); m.appendChild(reply); m.appendChild(el('time', null, t));
        accept.addEventListener('click', function () {
          accept.textContent = 'Принята ✓'; accept.classList.add('is-done'); accept.disabled = true;
          reply.hidden = false; reply.textContent = 'Клиенту отправлено: «Заявка принята, менеджер свяжется в течение 15 минут»';
          var st = rows.querySelector('.rx-status[data-id="' + id + '"]');
          if (st && st.dataset.s === '0') { st.dataset.s = 1; st.textContent = STAT[1]; }
        });
        call.addEventListener('click', function () {
          call.textContent = 'Звоним…'; call.disabled = true;
          setTimeout(function () { call.textContent = 'Позвонить'; call.disabled = false; }, 1600);
        });
        feed.appendChild(m);
        while (feed.children.length > 3) feed.removeChild(feed.firstElementChild);
        arrows[0].classList.remove('is-hot'); arrows[1].classList.add('is-hot');
      }, step);

      setTimeout(function () {
        var r = el('div', 'rx-crm-row is-new');
        var who = el('div'); who.appendChild(el('b', null, name)); who.appendChild(el('small', null, service + ' · №' + id)); r.appendChild(who);
        var s = el('button', 'rx-status', STAT[0]); s.type = 'button'; s.dataset.s = 0; s.dataset.id = id; r.appendChild(s);
        rows.insertBefore(r, rows.firstChild);
        while (rows.children.length > 5) rows.removeChild(rows.lastElementChild);
        arrows[1].classList.remove('is-hot');
        note.textContent = 'Готово! Заявка №' + id + ' у владельца';
        btn.disabled = false;
      }, step * 2);
    });
  })();

  /* ================= 02 Онлайн-запись ================= */
  (function () {
    var stage = $('.rx-book'); if (!stage) return;
    var DAYS = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
    var MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    var TIMES = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
    var daysBox = $('#rx-book-days'), slotsBox = $('#rx-book-slots'), go = $('#rx-book-go'), card = $('#rx-book-card');
    var svc = $('#rx-book-svc .rx-chip.is-on'), dayIdx = 0, time = null, mine = {};

    /* «Занятость» детерминирована от даты, чтобы при перерисовке не прыгала */
    function busy(date, t) {
      var n = date.getDate() * 31 + date.getMonth() * 7 + parseInt(t, 10) * 13;
      return (n % 5 === 0) || (n % 7 === 0) || (n % 11 === 0);
    }
    var dates = [];
    for (var i = 0; i < 7; i++) { var d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + i); dates.push(d); }

    function renderDays() {
      daysBox.innerHTML = '';
      dates.forEach(function (d, i) {
        var b = el('button', 'rx-day' + (i === dayIdx ? ' is-on' : '') + (i === 0 ? ' is-today' : '')); b.type = 'button';
        b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', i === dayIdx);
        b.setAttribute('aria-label', (i === 0 ? 'Сегодня, ' : '') + d.getDate() + ' ' + MONTHS[d.getMonth()]);
        b.appendChild(el('small', null, DAYS[d.getDay()]));
        b.appendChild(el('b', null, d.getDate()));
        if (d.getDay() === 1) { b.disabled = true; b.title = 'Выходной'; }
        b.addEventListener('click', function () { dayIdx = i; time = null; renderDays(); renderSlots(); });
        daysBox.appendChild(b);
      });
    }
    function renderSlots() {
      var d = dates[dayIdx], nowH = new Date().getHours(), key = d.toDateString();
      slotsBox.innerHTML = '';
      var free = 0;
      TIMES.forEach(function (t) {
        var past = dayIdx === 0 && parseInt(t, 10) <= nowH;
        var isMine = mine[key + t];
        var b = el('button', 'rx-slot' + (t === time ? ' is-on' : '') + (isMine ? ' is-mine' : ''), t); b.type = 'button';
        b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', t === time);
        if (past || busy(d, t) || isMine) { b.disabled = true; b.setAttribute('aria-label', t + ', занято'); }
        else free++;
        if (isMine) b.title = 'Ваша запись';
        b.addEventListener('click', function () { time = t; renderSlots(); });
        slotsBox.appendChild(b);
      });
      if (!free) slotsBox.appendChild(el('div', 'rx-slots-empty', 'На этот день всё занято, выберите другой.'));
      go.disabled = !time;
      go.textContent = time ? 'Записаться на ' + time : 'Выберите время';
    }

    radioGroup($('#rx-book-svc'), function (b) { svc = b; });

    go.addEventListener('click', function () {
      if (!time) return;
      var d = dates[dayIdx], t = time;
      mine[d.toDateString() + t] = true; time = null;
      var dateStr = d.getDate() + ' ' + MONTHS[d.getMonth()] + ', ' + DAYS[d.getDay()];
      var remindH = ('0' + (parseInt(t, 10) - 2)).slice(-2) + ':00';
      if (dayIdx === 0 && parseInt(t, 10) - 2 <= new Date().getHours()) remindH = now();

      card.innerHTML = '';
      var c = el('div', 'rx-conf');
      var head = el('div', 'rx-conf-head');
      var ok = el('span', 'rx-conf-ok'); ok.innerHTML = '<svg viewBox="0 0 24 24"><path d="m5 12 5 5 9-10"/></svg>';
      head.appendChild(ok); head.appendChild(el('b', null, 'Вы записаны'));
      c.appendChild(head);
      var dl = el('dl');
      [['Услуга', svc.dataset.name], ['Когда', dateStr + ', ' + t], ['Мастер', 'Ольга'], ['Стоимость', rub(+svc.dataset.price)]].forEach(function (r) {
        dl.appendChild(el('dt', null, r[0])); dl.appendChild(el('dd', null, r[1]));
      });
      c.appendChild(dl);
      var rem = el('div', 'rx-remind');
      rem.appendChild(el('div', 'rx-remind-label', 'Telegram, ' + (dayIdx === 0 ? 'сегодня' : d.getDate() + ' ' + MONTHS[d.getMonth()]) + ' в ' + remindH));
      var m = el('div', 'rx-tg-msg is-new');
      m.appendChild(el('b', null, 'Напоминание о записи'));
      m.appendChild(document.createTextNode(svc.dataset.name + ' сегодня в ' + t + '. Ждём вас по адресу ул. Лесная, 12.'));
      var acts = el('div', 'rx-tg-acts');
      var yes = el('button', null, 'Приду'), move = el('button', null, 'Перенести');
      yes.type = move.type = 'button';
      yes.addEventListener('click', function () { yes.textContent = 'Подтверждено ✓'; yes.classList.add('is-done'); yes.disabled = move.disabled = true; });
      move.addEventListener('click', function () {
        delete mine[d.toDateString() + t]; renderSlots();
        move.textContent = 'Слот освобождён'; move.classList.add('is-done'); yes.disabled = move.disabled = true;
      });
      acts.appendChild(yes); acts.appendChild(move); m.appendChild(acts);
      m.appendChild(el('time', null, remindH));
      rem.appendChild(m); c.appendChild(rem);
      card.appendChild(c);
      renderSlots();
      if (window.innerWidth < 820) card.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
    });

    if (dates[0].getDay() === 1) dayIdx = 1;
    renderDays(); renderSlots();
  })();

  /* ================= 03 Калькуляторы ================= */
  (function () {
    var stage = $('.rx-calc'); if (!stage) return;
    segment($('.rx-seg', stage), 'calc', stage);

    /* --- смета ремонта --- */
    var TYPES = { cosm: ['Косметический ремонт', 4500], cap: ['Капитальный ремонт', 9500], des: ['Дизайнерский ремонт', 16000] };
    var OPTS = {
      demo: ['Демонтаж', function (a) { return a * 900; }],
      el: ['Электрика', function (a) { return a * 1500; }],
      pl: ['Сантехника', function () { return 85000; }],
      clean: ['Уборка после ремонта', function (a) { return a * 250; }]
    };
    var area = $('#rx-area'), areaOut = $('#rx-area-out'), type = 'cap';
    var total = $('#rx-est-total'), list = $('#rx-est-list'), kp = $('#rx-kp');
    var lines = [];

    function calcEst() {
      var a = +area.value;
      areaOut.textContent = a + ' м²';
      lines = [[TYPES[type][0] + ', ' + a + ' м²', a * TYPES[type][1]]];
      $$('#rx-est-opts input:checked').forEach(function (c) { var o = OPTS[c.dataset.k]; lines.push([o[0], o[1](a)]); });
      var sum = lines.reduce(function (s, l) { return s + l[1]; }, 0);
      tween(total, sum, rub);
      list.innerHTML = '';
      lines.forEach(function (l) { var li = el('li'); li.appendChild(el('span', null, l[0])); li.appendChild(el('span', null, rub(l[1]))); list.appendChild(li); });
      if (!kp.hidden) fillKp();
      return sum;
    }
    function fillKp() {
      var rows = $('#rx-kp-rows'); rows.innerHTML = '';
      lines.forEach(function (l) { var tr = el('tr'); tr.appendChild(el('td', null, l[0])); tr.appendChild(el('td', null, rub(l[1]))); rows.appendChild(tr); });
      $('#rx-kp-total').textContent = rub(lines.reduce(function (s, l) { return s + l[1]; }, 0));
      $('#rx-kp-num').textContent = '№ КП-' + (2400 + (+area.value)) + ' от ' + new Date().toLocaleDateString('ru-RU');
    }
    area.addEventListener('input', calcEst);
    radioGroup($('#rx-est-type'), function (b) { type = b.dataset.k; calcEst(); });
    $('#rx-est-opts').addEventListener('change', calcEst);
    $('#rx-kp-btn').addEventListener('click', function () {
      fillKp(); kp.hidden = false;
      kp.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
    });
    calcEst();

    /* --- экономия на рутине --- */
    var ids = ['req', 'min', 'rate', 'auto'], inp = {};
    ids.forEach(function (k) { inp[k] = $('#rx-s-' + k); inp[k].addEventListener('input', calcSave); });
    var WORKDAYS = 22;
    function calcSave() {
      var req = +inp.req.value, min = +inp.min.value, rate = +inp.rate.value, auto = +inp.auto.value / 100;
      $('#rx-s-req-out').textContent = req;
      $('#rx-s-min-out').textContent = min + ' мин';
      $('#rx-s-rate-out').textContent = rub(rate);
      $('#rx-s-auto-out').textContent = Math.round(auto * 100) + '%';
      var hours = req * min * WORKDAYS / 60, saveM = hours * auto * rate;
      tween($('#rx-s-hours'), hours, function (v) { return Math.round(v) + ' ч · ' + rub(v * rate); });
      $('#rx-bar-now-l').textContent = Math.round(hours) + ' ч';
      $('#rx-bar-after-l').textContent = Math.round(hours * (1 - auto)) + ' ч';
      $('#rx-bar-after').style.width = Math.max(3, (1 - auto) * 100) + '%';
      tween($('#rx-s-month'), saveM, rub);
      tween($('#rx-s-year'), saveM * 12, rub);
    }
    calcSave();
  })();

  /* ================= 04 До / после ================= */
  (function () {
    var ba = $('#rx-ba'); if (!ba) return;
    var range = $('.rx-ba-range', ba);
    range.addEventListener('input', function () { ba.style.setProperty('--pos', range.value + '%'); });
    var seg = $('.rx-ba-wrap .rx-seg'), scaleBox = $('.rx-bf-scale', ba), choice = 'desk';
    var mobile = window.matchMedia('(max-width: 560px)');
    function fitBefore() { if (!ba.clientWidth) return; scaleBox.style.transform = ba.dataset.dev === 'phone' ? 'scale(' + (ba.clientWidth / 760) + ')' : ''; }
    function apply() { ba.dataset.dev = mobile.matches ? 'phone' : choice; fitBefore(); }
    segment(seg, 'dev');
    seg.addEventListener('rx:change', function (e) { choice = e.detail; apply(); setTimeout(fitBefore, 480); });
    if (mobile.addEventListener) mobile.addEventListener('change', apply); else mobile.addListener(apply);
    window.addEventListener('resize', fitBefore);
    ba.addEventListener('transitionend', fitBefore);
    apply();
  })();
})();
