/* RAENKO — общий скрипт сайта (RAE-25): шапка, меню, кнопка контактов, схемы, формы. */
(function () {
  'use strict';
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var body = document.body;

  /* ---------- цветовая схема (только для превью) ---------- */
  var THEMES = ['indigo', 'ultra', 'raspberry'];
  function setTheme(t, save) {
    if (THEMES.indexOf(t) < 0) return;
    body.dataset.theme = t;
    $$('[data-set-theme]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.setTheme === t); });
    if (save) { try { localStorage.setItem('raenko-theme', t); } catch (e) {} }
  }
  var fromUrl = new URLSearchParams(location.search).get('theme');
  var saved = null;
  try { saved = localStorage.getItem('raenko-theme'); } catch (e) {}
  setTheme(fromUrl || saved || 'indigo', !!fromUrl);
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-set-theme]');
    if (b) setTheme(b.dataset.setTheme, true);
  });

  /* ---------- шапка ---------- */
  var header = $('.header');
  function onScroll() { header && header.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // выпадающее меню услуг открывается наведением и фокусом (CSS), «Услуги» ведёт к блоку услуг

  // мобильное меню
  var mnav = $('#mnav');
  function menu(open) {
    if (!mnav) return;
    mnav.classList.toggle('is-open', open);
    mnav.setAttribute('aria-hidden', !open);
    body.style.overflow = open ? 'hidden' : '';
    $$('[data-menu-open]').forEach(function (b) { b.setAttribute('aria-expanded', open); });
  }
  $$('[data-menu-open]').forEach(function (b) { b.addEventListener('click', function () { menu(true); }); });
  $$('[data-menu-close]').forEach(function (b) { b.addEventListener('click', function () { menu(false); }); });
  if (mnav) mnav.addEventListener('click', function (e) { if (e.target.closest('a')) menu(false); });

  /* ---------- плавающая кнопка контактов ---------- */
  var fab = $('.fab');
  if (fab) {
    var main = $('.fab-main', fab);
    var toggle = function (open) {
      fab.classList.toggle('is-open', open);
      main.setAttribute('aria-expanded', open);
      main.setAttribute('aria-label', open ? 'Закрыть контакты' : 'Связаться с нами');
    };
    main.addEventListener('click', function () { toggle(!fab.classList.contains('is-open')); });
    document.addEventListener('click', function (e) { if (!fab.contains(e.target)) toggle(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { toggle(false); menu(false); } });
    $$('.fab-menu a', fab).forEach(function (a) { a.addEventListener('click', function () { toggle(false); }); });
    // иконка чередуется: телефон ↔ сообщение
    setInterval(function () { if (!fab.classList.contains('is-open')) fab.classList.toggle('alt'); }, 2600);
    // подсказка один раз через несколько секунд
    setTimeout(function () {
      fab.classList.add('show-tip');
      setTimeout(function () { fab.classList.remove('show-tip'); }, 4000);
    }, 6000);
  }

  /* ---------- форма заявки (в превью ничего не отправляется) ---------- */
  $$('form[data-lead]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!f.reportValidity()) return;
      f.classList.add('is-sent');
      var btn = $('button[type=submit]', f);
      if (btn) { btn.disabled = true; btn.textContent = 'Заявка отправлена'; }
    });
  });

  // кнопки «Обсудить» у тарифов: подставляем тему в форму
  $$('[data-topic]').forEach(function (a) {
    a.addEventListener('click', function () {
      var msg = $('#lead-form textarea[name=msg]');
      if (msg && !msg.value) msg.value = 'Интересует: ' + a.dataset.topic;
    });
  });

  /* ---------- появление блоков при прокрутке ---------- */
  var items = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- примеры RAE-21: показываем только нужные вкладки ---------- */
  var rx = $('.rx[data-tabs]');
  if (rx) {
    var allow = rx.dataset.tabs.split(',');
    var first = null;
    $$('.rx-tab', rx).forEach(function (t) {
      var ok = allow.indexOf(t.dataset.tab) >= 0;
      t.hidden = !ok;
      if (ok && !first) first = t;
    });
    if (first) first.click();
    if (allow.length < 2) { var tl = $('.rx-tabs', rx); if (tl) tl.hidden = true; }
  }

  /* ---------- FAQ: открыт один вопрос, плавное открытие и закрытие ---------- */
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function animH(d, open) {
    if (d._anim) d._anim.cancel();
    var sum = $('summary', d), start = d.offsetHeight;
    if (open) d.open = true;
    var end = open ? d.scrollHeight : sum.offsetHeight;
    if (reduce || !d.animate) { d.open = open; return; }
    d.classList.toggle('is-closing', !open);
    var a = d._anim = d.animate({ height: [start + 'px', end + 'px'] }, { duration: 320, easing: 'cubic-bezier(.2,.7,.2,1)' });
    a.onfinish = function () { d._anim = null; d.classList.remove('is-closing'); if (!open) d.open = false; };
    a.oncancel = function () { d._anim = null; d.classList.remove('is-closing'); };
  }
  $$('.faq').forEach(function (faq) {
    var list = $$('details', faq);
    list.forEach(function (d) {
      $('summary', d).addEventListener('click', function (e) {
        e.preventDefault();
        var willOpen = !d.open || d.classList.contains('is-closing');
        list.forEach(function (o) { if (o !== d && o.open && !o.classList.contains('is-closing')) animH(o, false); });
        animH(d, willOpen);
      });
    });
  });

  /* ---------- «Кому подходит»: точки карусели на телефоне ---------- */
  $$('[data-carousel]').forEach(function (c) {
    var dots = c.nextElementSibling;
    if (!dots || !dots.classList.contains('uc-dots')) return;
    var n = c.children.length;
    for (var i = 0; i < n; i++) dots.appendChild(document.createElement('i'));
    function upd() {
      var w = c.firstElementChild.offsetWidth + 12, k = Math.round(c.scrollLeft / w);
      if (c.scrollLeft + c.clientWidth >= c.scrollWidth - 4) k = n - 1;
      $$('i', dots).forEach(function (d, j) { d.classList.toggle('is-on', j === k); });
    }
    c.addEventListener('scroll', upd, { passive: true });
    upd();
    // на телефоне листается сама; касание ставит на паузу, через 6 секунд листает дальше
    var mq = window.matchMedia('(max-width: 640px)'), pausedUntil = 0, visible = false;
    function pause() { pausedUntil = Date.now() + 6000; }
    ['touchstart', 'pointerdown', 'wheel'].forEach(function (ev) { c.addEventListener(ev, pause, { passive: true }); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { threshold: 0.5 }).observe(c);
    setInterval(function () {
      if (!mq.matches || !visible || reduce || Date.now() < pausedUntil || document.hidden) return;
      var w = c.firstElementChild.offsetWidth + 12;
      var end = c.scrollLeft + c.clientWidth >= c.scrollWidth - 4;
      c.scrollTo({ left: end ? 0 : c.scrollLeft + w, behavior: 'smooth' });
    }, 2800);
  });

  /* ---------- шаги «Как мы работаем»: одна подсвеченная точка ---------- */
  $$('[data-steps]').forEach(function (box) {
    var steps = $$('.step', box), done = $('.steps-done', box), cur = -1, timer = null;
    var mq = window.matchMedia('(max-width: 640px)');
    function clearKids(node) { while (node.firstChild) node.removeChild(node.firstChild); }
    function confetti() {
      if (reduce) return;
      var c = $('.confetti', done); clearKids(c);
      var cols = ['var(--accent)', '#fff', 'var(--primary)', '#FFC83D', '#2DD4BF'];
      for (var i = 0; i < 28; i++) {
        var p = document.createElement('i'), ang = Math.random() * Math.PI * 2, dist = 60 + Math.random() * 110;
        p.style.background = cols[i % cols.length];
        p.style.setProperty('--x', Math.cos(ang) * dist * 1.4 + 'px');
        p.style.setProperty('--y', Math.sin(ang) * dist - 40 + 'px');
        p.style.setProperty('--r', (Math.random() * 720 - 360) + 'deg');
        p.style.animationDelay = Math.random() * 0.12 + 's';
        c.appendChild(p);
      }
      setTimeout(function () { clearKids(c); }, 1500);
    }
    function set(k, celebrate) {
      if (k === cur) return;
      var prev = cur; cur = k;
      steps.forEach(function (s, i) { s.classList.toggle('is-on', i === k); });
      var fin = k >= steps.length;
      if (done) {
        done.classList.toggle('is-on', fin);
        if (fin && celebrate && prev < steps.length) confetti();
      }
    }
    // ПК: точка идёт по кругу, наведение перехватывает её, второй подсветки нет
    function tick() { set((cur + 1) % (steps.length + 1), false); }
    function stop() { if (timer) clearInterval(timer); timer = null; }
    function start() { stop(); timer = setInterval(tick, 1800); }
    steps.forEach(function (s, i) {
      s.addEventListener('mouseenter', function () { if (!mq.matches) { stop(); set(i); } });
      s.addEventListener('mouseleave', function () { if (!mq.matches) start(); });
    });
    if (done) {
      done.addEventListener('mouseenter', function () { if (!mq.matches) { stop(); set(steps.length, true); } });
      done.addEventListener('mouseleave', function () { if (!mq.matches) start(); });
    }
    // телефон: светится шаг, до которого долистал пользователь, в конце конфетти
    function onScrollSteps() {
      if (!mq.matches) return;
      var line = window.innerHeight * 0.55, k = -1;
      steps.forEach(function (s, i) { if (s.getBoundingClientRect().top < line) k = i; });
      if (done && k === steps.length - 1 && done.getBoundingClientRect().top < line) k = steps.length;
      set(k, true);
    }
    function mode() {
      if (mq.matches) { stop(); cur = -2; onScrollSteps(); }
      else { set(0); start(); }
    }
    window.addEventListener('scroll', onScrollSteps, { passive: true });
    if (mq.addEventListener) mq.addEventListener('change', mode); else mq.addListener(mode);
    mode();
  });
})();
