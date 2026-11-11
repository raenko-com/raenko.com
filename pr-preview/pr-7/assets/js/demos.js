/* RAENKO — интерактивные демо для страниц услуг (RAE-25). Префикс rd-. Данные вымышленные, ничего не отправляется. */
(function () {
  'use strict';
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var now = function () { var d = new Date(); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, reduce ? 0 : ms); }); };

  function typeText(node, text, speed) {
    node.textContent = '';
    if (reduce) { node.textContent = text; return Promise.resolve(); }
    return new Promise(function (res) {
      var i = 0;
      (function tick() {
        node.textContent = text.slice(0, i += 2);
        if (i < text.length) node._t = setTimeout(tick, speed || 14); else res();
      })();
    });
  }

  var ICO = {
    bot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M18.5 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l9.5 17h-19z"/><path d="M12 10v4M12 17h.01"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/></svg>'
  };

  /* ================= Бот: ответы на частые вопросы ================= */
  function botFaq(root) {
    var Q = {
      price: { q: 'Сколько стоит стрижка?', a: 'Женская стрижка от 1 500 ₽, мужская от 900 ₽. Окрашивание считаем после консультации.', next: ['book', 'addr'] },
      addr: { q: 'Где вы находитесь?', a: 'ул. Цветочная, 12. Работаем каждый день с 9:00 до 21:00. Парковка во дворе.', next: ['book', 'price'] },
      book: { q: 'Хочу записаться', a: 'Отлично! Ближайшие свободные окна: сегодня 18:30, завтра 11:00 и 15:30. Какое время удобно?', slots: ['Сегодня 18:30', 'Завтра 11:00', 'Завтра 15:30'] },
      human: { q: 'Позовите администратора', a: 'Передал ваш вопрос администратору Анне, она ответит в течение 10 минут. Заявка уже в CRM ✓', next: ['price', 'addr'] }
    };
    var LABEL = { price: 'Цены', addr: 'Адрес и часы', book: 'Записаться', human: 'Позвать человека' };
    root.innerHTML =
      '<div class="rd-grid rd-grid--chat">' +
        '<div class="rd-phone"><div class="rd-tg-h"><span class="rd-ava">' + ICO.bot + '</span><div><b>Студия «Локон»</b><small>бот · онлайн</small></div></div>' +
        '<div class="rd-feed" aria-live="polite"></div><div class="rd-quick"></div></div>' +
        '<div class="rd-side"><div class="rd-stat"><small>Ответов без участия сотрудников</small><b class="rd-auto">0</b></div>' +
        '<div class="rd-stat"><small>Заявок передано в CRM</small><b class="rd-leads">0</b></div>' +
        '<p class="rd-note">Бот отвечает на частые вопросы мгновенно и днём, и ночью. Сложные вопросы передаёт человеку, ничего не теряется.</p>' +
        '<button class="rd-btn rd-btn--ghost rd-reset" type="button">Начать заново</button></div>' +
      '</div>';
    var feed = $('.rd-feed', root), quick = $('.rd-quick', root), auto = 0, leads = 0;
    function msg(text, me) {
      var m = document.createElement('div');
      m.className = 'rd-msg' + (me ? ' rd-msg--me' : '');
      m.innerHTML = esc(text) + '<time>' + now() + '</time>';
      feed.appendChild(m);
      feed.scrollTop = feed.scrollHeight;
      return m;
    }
    function typing() {
      var t = document.createElement('div'); t.className = 'rd-msg rd-typing'; t.innerHTML = '<i></i><i></i><i></i>';
      feed.appendChild(t); feed.scrollTop = feed.scrollHeight; return t;
    }
    function buttons(keys) {
      quick.innerHTML = keys.map(function (k) { return '<button type="button" data-k="' + k + '">' + esc(LABEL[k] || k) + '</button>'; }).join('');
    }
    function slots(list) {
      quick.innerHTML = list.map(function (s) { return '<button type="button" data-slot="' + esc(s) + '">' + esc(s) + '</button>'; }).join('');
    }
    function ask(k) {
      var item = Q[k]; quick.innerHTML = '';
      msg(item.q, true);
      var t = typing();
      wait(800).then(function () {
        t.remove(); msg(item.a);
        if (k === 'human') { leads++; $('.rd-leads', root).textContent = leads; } else { auto++; $('.rd-auto', root).textContent = auto; }
        if (item.slots) slots(item.slots); else buttons(item.next.concat(['human']));
      });
    }
    quick.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.dataset.k) return ask(b.dataset.k);
      quick.innerHTML = '';
      msg(b.dataset.slot, true);
      var t = typing();
      wait(800).then(function () {
        t.remove();
        msg('Готово ✓ Записал вас: ' + b.dataset.slot + '. Напомню за 2 часа до визита.');
        auto++; leads++;
        $('.rd-auto', root).textContent = auto; $('.rd-leads', root).textContent = leads;
        buttons(['price', 'addr', 'human']);
      });
    });
    function start() {
      feed.innerHTML = ''; auto = 0; leads = 0;
      $('.rd-auto', root).textContent = 0; $('.rd-leads', root).textContent = 0;
      msg('Здравствуйте! Я бот студии «Локон». Подскажу цены, адрес или запишу вас. Что интересно?');
      buttons(['price', 'addr', 'book', 'human']);
    }
    $('.rd-reset', root).addEventListener('click', start);
    start();
  }

  /* ================= ИИ: разбор входящих заявок ================= */
  function aiInbox(root) {
    var MAIL = [
      { from: 'Ирина, ООО «СтройДом»', subj: 'Нужен расчёт на 3 объекта', text: 'Добрый день! Нам нужна уборка после ремонта на трёх объектах в центре, около 240 м² всего. Желательно до пятницы. Пришлите, пожалуйста, стоимость. Телефон +7 918 555-12-30.',
        type: 'Коммерческое предложение', urgency: 'Высокая', urgencyLvl: 3, fields: [['Клиент', 'ООО «СтройДом», Ирина'], ['Объём', '3 объекта, 240 м²'], ['Срок', 'до пятницы'], ['Телефон', '+7 918 555-12-30']], who: 'Отдел продаж',
        draft: 'Ирина, добрый день! Спасибо за обращение. Для трёх объектов общей площадью 240 м² ориентировочная стоимость уборки после ремонта 38 000–45 000 ₽. Успеваем до пятницы. Можем приехать на осмотр завтра в 10:00 или 15:00, как вам удобнее?' },
      { from: 'Павел', subj: 'Не пришёл мастер', text: 'Здравствуйте, записывался на вчера на 14:00, мастер так и не приехал, никто не позвонил. Очень неприятно. Заказ №1187.',
        type: 'Жалоба', urgency: 'Критичная', urgencyLvl: 4, fields: [['Клиент', 'Павел'], ['Заказ', '№1187'], ['Суть', 'мастер не приехал'], ['Настроение', 'недоволен']], who: 'Руководитель сервиса',
        draft: 'Павел, здравствуйте. Приносим извинения за сорванный визит по заказу №1187, это наша ошибка. Руководитель сервиса уже разбирается и свяжется с вами в течение 15 минут. В качестве компенсации сделаем скидку 20% на этот заказ.' },
      { from: 'Мария', subj: 'Вопрос про график', text: 'Подскажите, вы работаете в воскресенье? И можно ли оплатить картой на месте?',
        type: 'Вопрос', urgency: 'Обычная', urgencyLvl: 1, fields: [['Клиент', 'Мария'], ['Вопросы', 'график, оплата картой']], who: 'Ответ отправлен автоматически',
        draft: 'Мария, здравствуйте! Да, в воскресенье работаем с 10:00 до 18:00. Оплатить можно картой или по QR-коду на месте. Записать вас?' }
    ];
    root.innerHTML =
      '<div class="rd-grid rd-grid--ai">' +
        '<div class="rd-inbox"><div class="rd-inbox-h">' + ICO.mail + '<b>Входящие</b><span class="rd-badge">3 новых</span></div>' +
          MAIL.map(function (m, i) { return '<button type="button" class="rd-mail' + (i === 0 ? ' is-on' : '') + '" data-i="' + i + '"><b>' + esc(m.from) + '</b><span>' + esc(m.subj) + '</span></button>'; }).join('') +
        '</div>' +
        '<div class="rd-ai">' +
          '<div class="rd-ai-src"></div>' +
          '<div class="rd-ai-h"><span class="rd-ava rd-ava--acc">' + ICO.spark + '</span><b>ИИ-помощник</b><small class="rd-ai-st">анализирует…</small></div>' +
          '<div class="rd-ai-tags"></div><dl class="rd-ai-fields"></dl>' +
          '<div class="rd-draft"><small>Черновик ответа</small><p></p></div>' +
          '<div class="rd-ai-act"><button type="button" class="rd-btn rd-send">Отправить</button><button type="button" class="rd-btn rd-btn--ghost rd-edit">Поправить</button></div>' +
        '</div>' +
      '</div>';
    var run = 0;
    function show(i) {
      var my = ++run, m = MAIL[i];
      $$('.rd-mail', root).forEach(function (b) { b.classList.toggle('is-on', +b.dataset.i === i); });
      $('.rd-ai-src', root).innerHTML = '<b>' + esc(m.from) + '</b><p>' + esc(m.text) + '</p>';
      $('.rd-ai-st', root).textContent = 'анализирует…';
      $('.rd-ai', root).classList.add('is-busy');
      $('.rd-ai-tags', root).innerHTML = ''; $('.rd-ai-fields', root).innerHTML = '';
      var p = $('.rd-draft p', root); clearTimeout(p._t); p.textContent = '';
      var send = $('.rd-send', root); send.disabled = true; send.textContent = 'Отправить';
      wait(700).then(function () {
        if (my !== run) return;
        $('.rd-ai-tags', root).innerHTML = '<span class="rd-tag">' + esc(m.type) + '</span><span class="rd-tag rd-u' + m.urgencyLvl + '">Срочность: ' + esc(m.urgency) + '</span><span class="rd-tag rd-tag--ghost">→ ' + esc(m.who) + '</span>';
        return wait(500);
      }).then(function () {
        if (my !== run) return;
        $('.rd-ai-fields', root).innerHTML = m.fields.map(function (f) { return '<div><dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('');
        return wait(400).then(function () { if (my === run) return typeText(p, m.draft, 12); });
      }).then(function () {
        if (my !== run) return;
        $('.rd-ai-st', root).textContent = 'готово за 2 секунды';
        $('.rd-ai', root).classList.remove('is-busy');
        send.disabled = false;
      });
    }
    $('.rd-inbox', root).addEventListener('click', function (e) { var b = e.target.closest('.rd-mail'); if (b) show(+b.dataset.i); });
    $('.rd-send', root).addEventListener('click', function () { this.textContent = 'Отправлено ✓'; this.disabled = true; });
    $('.rd-edit', root).addEventListener('click', function () { var p = $('.rd-draft p', root); p.contentEditable = 'true'; p.focus(); });
    show(0);
  }

  /* ================= Поддержка: мониторинг и сбой ================= */
  function support(root) {
    root.innerHTML =
      '<div class="rd-grid rd-grid--sup">' +
        '<div class="rd-mon">' +
          '<div class="rd-mon-h"><div><small>Сайт клиента</small><b>lokon-studio.ru</b></div><span class="rd-status is-ok"><i></i><span>Работает</span></span></div>' +
          '<div class="rd-kpis"><div><small>Доступность за 30 дней</small><b class="rd-up">99,98%</b></div><div><small>Время ответа</small><b class="rd-ms">182 мс</b></div><div><small>Последний бэкап</small><b>сегодня, 04:00</b></div></div>' +
          '<div class="rd-bars" aria-hidden="true"></div>' +
          '<div class="rd-mon-act"><button type="button" class="rd-btn rd-crash">' + ICO.alert + 'Смоделировать сбой</button><span class="rd-mon-note">Нажмите и посмотрите, как мы реагируем</span></div>' +
        '</div>' +
        '<div class="rd-phone rd-phone--sm"><div class="rd-tg-h"><span class="rd-ava">' + ICO.bot + '</span><div><b>Мониторинг RAENKO</b><small>бот</small></div></div><div class="rd-feed" aria-live="polite"></div></div>' +
      '</div>';
    var bars = $('.rd-bars', root);
    bars.innerHTML = Array.apply(null, Array(30)).map(function (_, i) { return '<i class="' + (i === 11 ? 'warn' : '') + '" style="height:' + (60 + ((i * 37) % 40)) + '%"></i>'; }).join('');
    var feed = $('.rd-feed', root), st = $('.rd-status', root), btn = $('.rd-crash', root), ms = $('.rd-ms', root);
    function msg(html, cls) {
      var m = document.createElement('div'); m.className = 'rd-msg ' + (cls || ''); m.innerHTML = html + '<time>' + now() + '</time>';
      feed.appendChild(m); feed.scrollTop = feed.scrollHeight;
    }
    msg('Ежедневный отчёт: всё работает, резервная копия создана ✓');
    var live = setInterval(function () { if (!btn.disabled) ms.textContent = (160 + Math.round(Math.random() * 60)) + ' мс'; }, 1500);
    btn.addEventListener('click', function () {
      btn.disabled = true;
      st.className = 'rd-status is-bad'; $('span', st).textContent = 'Не отвечает'; ms.textContent = '—';
      root.classList.add('is-down');
      wait(500).then(function () {
        msg('<b>⚠️ lokon-studio.ru не отвечает</b><br>Ошибка 502. Дежурный уже разбирается.', 'rd-msg--bad');
        return wait(1600);
      }).then(function () {
        st.className = 'rd-status is-warn'; $('span', st).textContent = 'Восстанавливаем';
        msg('Перезапускаем сервер и проверяем базу данных…');
        return wait(1800);
      }).then(function () {
        st.className = 'rd-status is-ok'; $('span', st).textContent = 'Работает';
        root.classList.remove('is-down'); ms.textContent = '175 мс';
        msg('<b>✅ Сайт снова работает</b><br>Простой 3 минуты. Причина: переполнение памяти, увеличили лимит, чтобы не повторилось.', 'rd-msg--ok');
        btn.disabled = false;
      });
    });
    root._stop = function () { clearInterval(live); };
  }

  /* ================= Продвижение: откуда приходят заявки ================= */
  function promo(root) {
    var CH = [
      { id: 'direct', name: 'Яндекс Директ', leads: [9, 12, 14, 17], cost: 18000 },
      { id: 'maps', name: 'Яндекс Карты', leads: [5, 6, 8, 9], cost: 0 },
      { id: 'gis', name: '2ГИС', leads: [3, 4, 4, 6], cost: 0 },
      { id: 'seo', name: 'Поиск (SEO)', leads: [2, 3, 5, 7], cost: 0 }
    ];
    var on = { direct: true, maps: true, gis: true, seo: true };
    root.innerHTML =
      '<div class="rd-grid rd-grid--promo">' +
        '<div class="rd-chs">' + CH.map(function (c, i) {
          return '<label class="rd-ch rd-c' + i + '"><input type="checkbox" checked data-ch="' + c.id + '"><i></i><span><b>' + c.name + '</b><small>' + (c.cost ? 'реклама ' + c.cost.toLocaleString('ru-RU') + ' ₽/мес' : 'бесплатный канал') + '</small></span><em data-n="' + c.id + '"></em></label>';
        }).join('') + '</div>' +
        '<div class="rd-chart"><div class="rd-chart-h"><div><small>Заявок за месяц</small><b class="rd-total">0</b></div><div><small>Цена заявки</small><b class="rd-cpl">—</b></div></div>' +
          '<div class="rd-cols">' + [1, 2, 3, 4].map(function (w) { return '<div class="rd-col"><div class="rd-stack" data-w="' + (w - 1) + '"></div><small>' + w + ' нед.</small></div>'; }).join('') + '</div>' +
          '<p class="rd-note">Пример отчёта для клиента: видно, какой канал сколько заявок приносит и во что обходится каждая.</p>' +
        '</div>' +
      '</div>';
    var max = [0, 1, 2, 3].reduce(function (m, w) { return Math.max(m, CH.reduce(function (s, c) { return s + c.leads[w]; }, 0)); }, 0);
    function draw() {
      var total = 0, cost = 0;
      CH.forEach(function (c) {
        var n = c.leads.reduce(function (a, b) { return a + b; }, 0);
        $('[data-n="' + c.id + '"]', root).textContent = on[c.id] ? n : '—';
        if (on[c.id]) { total += n; cost += c.cost; }
      });
      $$('.rd-stack', root).forEach(function (s) {
        var w = +s.dataset.w;
        s.innerHTML = CH.map(function (c, i) { return on[c.id] ? '<i class="rd-c' + i + '" style="height:' + (c.leads[w] / max * 100) + '%" title="' + c.name + ': ' + c.leads[w] + '"></i>' : ''; }).join('');
      });
      $('.rd-total', root).textContent = total;
      $('.rd-cpl', root).textContent = total ? Math.round(cost / total).toLocaleString('ru-RU') + ' ₽' : '—';
    }
    root.addEventListener('change', function (e) { if (e.target.dataset.ch) { on[e.target.dataset.ch] = e.target.checked; draw(); } });
    draw();
  }

  var MAP = { 'bot-faq': botFaq, ai: aiInbox, support: support, promo: promo };
  $$('[data-demo]').forEach(function (el) { var f = MAP[el.dataset.demo]; if (f) f(el); });
})();
