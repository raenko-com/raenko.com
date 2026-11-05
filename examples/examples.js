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
    if (focus) t.focus();
    t.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
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
        var acts = el('div', 'rx-tg-acts'); acts.appendChild(el('span', null, 'Принять')); acts.appendChild(el('span', null, 'Позвонить'));
        m.appendChild(acts); m.appendChild(el('time', null, t));
        feed.appendChild(m);
        while (feed.children.length > 3) feed.removeChild(feed.firstElementChild);
        arrows[0].classList.remove('is-hot'); arrows[1].classList.add('is-hot');
      }, step);

      setTimeout(function () {
        var r = el('div', 'rx-crm-row is-new');
        var who = el('div'); who.appendChild(el('b', null, name)); who.appendChild(el('small', null, service + ' · №' + id)); r.appendChild(who);
        var s = el('button', 'rx-status', STAT[0]); s.type = 'button'; s.dataset.s = 0; r.appendChild(s);
        rows.insertBefore(r, rows.firstChild);
        while (rows.children.length > 5) rows.removeChild(rows.lastElementChild);
        arrows[1].classList.remove('is-hot');
        note.textContent = 'Готово! Заявка №' + id + ' у владельца';
        btn.disabled = false;
      }, step * 2);
    });
  })();

  /* ================= 02 ИИ-помощник ================= */
  (function () {
    var stage = $('.rx-ai'); if (!stage) return;
    segment($('.rx-seg', stage), 'mode', stage);

    /* --- консультант (ответы заготовлены) --- */
    var FAQ = [
      { k: ['достав', 'привез', 'курьер'], a: 'Доставка по городу 300 ₽, от 3000 ₽ бесплатно. Привезём за 1,5–2 часа или к точному времени.' },
      { k: ['успе', 'сегодня', '18', 'срочн', 'быстр', '~когда'], a: 'Да, если оформить заказ до 16:00, привезём к 18:00. Оформить сейчас?' },
      { k: ['оплат', 'карт', 'налич', 'получени', 'перевод'], a: 'Можно картой на сайте, по СБП или наличными курьеру при получении.' },
      { k: ['цен', '~стои', '~сколько', 'дорог', 'бюджет'], a: 'Букеты от 1500 ₽. Хотите, подберу варианты под ваш бюджет?' },
      { k: ['роз', 'тюльпан', 'пион', 'букет', 'цвет'], a: 'Сейчас в наличии розы, тюльпаны и сезонные пионы. Могу показать готовые букеты или собрать под ваш вкус.' },
      { k: ['адрес', 'где', 'самовывоз', 'забрать'], a: 'Самовывоз: ул. Лесная, 12, ежедневно с 8:00 до 22:00.' },
      { k: ['открытк', 'подпис', 'записк'], a: 'Открытку с вашим текстом добавим бесплатно, просто напишите его в комментарии к заказу.' },
      { k: ['привет', 'здравств', 'добр'], a: 'Здравствуйте! Чем могу помочь?' }
    ];
    var fallback = 'Хороший вопрос! Точно ответить не могу, поэтому передал его менеджеру. Он напишет вам в течение 10 минут.';
    var chat = $('#rx-chat-feed'), form = $('#rx-chat-form'), input = $('#rx-chat-text'), busy = false;

    function answer(q) {
      var s = q.toLowerCase(), best = null, score = 0;
      FAQ.forEach(function (f) {
        var c = f.k.reduce(function (sum, k) { var w = k[0] === '~' ? .5 : 1; return sum + (s.indexOf(k.replace('~', '')) !== -1 ? w : 0); }, 0);
        if (c > score) { score = c; best = f; }
      });
      return best ? best.a : fallback;
    }
    function ask(q) {
      q = q.trim(); if (!q || busy) return;
      busy = true;
      chat.appendChild(el('div', 'rx-bubble rx-bubble--me', q));
      var typing = el('div', 'rx-bubble rx-bubble--bot rx-typing');
      typing.innerHTML = '<i></i><i></i><i></i>';
      chat.appendChild(typing); chat.scrollTop = chat.scrollHeight;
      setTimeout(function () {
        typing.remove();
        var a = answer(q), b = el('div', 'rx-bubble rx-bubble--bot', a);
        if (a !== fallback) b.appendChild(el('small', null, 'Ответ из базы знаний магазина'));
        chat.appendChild(b); chat.scrollTop = chat.scrollHeight; busy = false;
      }, reduce ? 50 : 900);
    }
    form.addEventListener('submit', function (e) { e.preventDefault(); ask(input.value); input.value = ''; });
    $('#rx-chat-suggest').addEventListener('click', function (e) {
      var b = e.target.closest('.rx-chip'); if (!b) return; ask(b.textContent);
    });

    /* --- разбор отзыва (простой разбор по ключевым словам) --- */
    var SAMPLES = [
      'Заказывал букет на день рождения жены, курьер опоздал на полтора часа и никто не перезвонил. Цветы красивые, но настроение испорчено.',
      'Спасибо огромное! Букет свежий, собран со вкусом, привезли точно ко времени. Жена в восторге, будем заказывать ещё.',
      'Подскажите, можно ли заказать букет заранее на 8 марта и оплатить при получении?'
    ];
    var NEG = ['опозд', 'не перезвон', 'никто не', 'плох', 'ужас', 'испорч', 'грязн', 'хам', 'груб', 'долго', 'вял', 'разочар', 'верните', 'обман', 'не приш', 'не привез', 'недоволен', 'отврат', 'кошмар'];
    var POS = ['спасибо', 'отличн', 'понрав', 'красив', 'свеж', 'вкус', 'восторг', 'рекоменд', 'супер', 'лучш', 'вовремя', 'точно ко времени', 'прекрас', 'молодц', 'благодар'];
    var CAT = [
      { n: 'Доставка', k: ['курьер', 'достав', 'опозд', 'привез', 'ко времени', 'вовремя'] },
      { n: 'Качество товара', k: ['букет', 'цвет', 'свеж', 'вял', 'роз', 'собран'] },
      { n: 'Сервис', k: ['перезвон', 'менеджер', 'оператор', 'хам', 'груб', 'ответ'] },
      { n: 'Оплата', k: ['оплат', 'цен', 'дорог', 'деньг', 'верните'] }
    ];
    var ta = $('#rx-review-text'), out = $('#rx-review-out'), go = $('#rx-review-go');

    function count(s, list) { return list.filter(function (k) { return s.indexOf(k) !== -1; }).length; }

    function analyze(text) {
      var s = text.toLowerCase(), neg = count(s, NEG), pos = count(s, POS);
      var question = /\?/.test(s) || /^(подскаж|можно|как |сколько|есть ли)/.test(s);
      var tone, score;
      if (neg > pos) { tone = 'Негатив'; score = Math.max(.08, .35 - .08 * (neg - pos)); }
      else if (pos > neg) { tone = 'Позитив'; score = Math.min(.94, .68 + .08 * (pos - neg)); }
      else { tone = question ? 'Нейтрально' : (neg ? 'Смешанный' : 'Нейтрально'); score = .5; }
      var cats = CAT.filter(function (c) { return count(s, c.k) > 0; }).map(function (c) { return c.n; });
      if (question) cats.unshift('Вопрос');
      if (!cats.length) cats = ['Общее'];
      var urgent = tone === 'Негатив' ? 'Ответить сегодня' : question ? 'Ответить в течение часа' : 'Не срочно';
      var draft;
      if (tone === 'Негатив') {
        draft = 'Здравствуйте! Нам очень жаль, что так вышло' + (cats.indexOf('Доставка') !== -1 ? ' с доставкой' : '') +
          '. Мы уже разбираемся с ситуацией. В качестве извинения дарим скидку 20% на следующий заказ, промокод ПРОСТИТЕ20. Менеджер свяжется с вами сегодня.';
      } else if (question) {
        draft = 'Здравствуйте! Да, конечно: заказ можно оформить заранее на любую дату, а оплатить картой, по СБП или наличными при получении. Подсказать с выбором букета?';
      } else if (tone === 'Позитив') {
        draft = 'Спасибо за тёплые слова! Очень рады, что букет понравился. Будем ждать вас снова, а на следующий заказ дарим скидку 10%.';
      } else {
        draft = 'Здравствуйте! Спасибо, что поделились мнением. Расскажите, пожалуйста, подробнее, что нам улучшить?';
      }
      return { tone: tone, score: score, cats: cats, urgent: urgent, draft: draft };
    }

    function render(r) {
      out.innerHTML = '';
      var wrap = el('div', 'rx-an');

      var t = el('div'); t.appendChild(el('div', 'rx-an-label', 'Тональность'));
      var m = el('div', 'rx-meter'), dot = el('i'); dot.style.left = '50%'; m.appendChild(dot); t.appendChild(m);
      wrap.appendChild(t);

      var row = el('div', 'rx-an-row');
      row.appendChild(el('span', 'rx-pill ' + (r.tone === 'Негатив' ? 'rx-pill--neg' : r.tone === 'Позитив' ? 'rx-pill--pos' : ''), r.tone));
      r.cats.forEach(function (c) { row.appendChild(el('span', 'rx-pill', c)); });
      row.appendChild(el('span', 'rx-pill ' + (r.tone === 'Негатив' ? 'rx-pill--warn' : ''), r.urgent));
      wrap.appendChild(row);

      var d = el('div'); d.appendChild(el('div', 'rx-an-label', 'Черновик ответа'));
      d.appendChild(el('div', 'rx-draft', r.draft)); wrap.appendChild(d);

      var acts = el('div', 'rx-draft-acts');
      var send = el('button', 'rx-btn rx-btn--accent', 'Отправить'); send.type = 'button';
      var edit = el('button', 'rx-btn rx-btn--ghost', 'Изменить'); edit.type = 'button';
      send.addEventListener('click', function () { send.textContent = 'Отправлено ✓'; send.disabled = true; });
      edit.addEventListener('click', function () { var dr = $('.rx-draft', wrap); dr.contentEditable = true; dr.focus(); });
      acts.appendChild(send); acts.appendChild(edit); wrap.appendChild(acts);

      out.appendChild(wrap);
      requestAnimationFrame(function () { requestAnimationFrame(function () { dot.style.left = (r.score * 100) + '%'; }); });
    }

    go.addEventListener('click', function () {
      if (!ta.value.trim()) { ta.focus(); return; }
      go.disabled = true; go.textContent = 'Анализирую…';
      out.innerHTML = ''; var ty = el('div', 'rx-typing'); ty.innerHTML = '<i></i><i></i><i></i>'; out.appendChild(ty);
      setTimeout(function () { render(analyze(ta.value)); go.disabled = false; go.textContent = 'Разобрать отзыв'; }, reduce ? 50 : 800);
    });
    $('#rx-review-samples').addEventListener('click', function (e) {
      var b = e.target.closest('.rx-chip'); if (!b) return;
      ta.value = SAMPLES[+b.dataset.i]; go.click();
    });
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
    var seg = $('.rx-ba-wrap .rx-seg');
    segment(seg, 'dev');
    seg.addEventListener('rx:change', function (e) { ba.dataset.dev = e.detail; });
  })();
})();
