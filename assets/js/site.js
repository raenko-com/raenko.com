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

  // выпадающее меню услуг: открытие по клику (для тача и клавиатуры)
  $$('.nav-drop > button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var d = btn.parentElement, open = !d.classList.contains('is-open');
      d.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open);
    });
  });
  document.addEventListener('click', function (e) {
    $$('.nav-drop.is-open').forEach(function (d) { if (!d.contains(e.target)) { d.classList.remove('is-open'); $('button', d).setAttribute('aria-expanded', 'false'); } });
  });

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

  /* ---------- шаги «Как мы работаем»: подсветка по очереди ---------- */
  var steps = $$('.step');
  if (steps.length) {
    var k = 0;
    setInterval(function () {
      steps.forEach(function (s, i) { s.classList.toggle('is-on', i === k); });
      k = (k + 1) % steps.length;
    }, 1800);
  }
})();
