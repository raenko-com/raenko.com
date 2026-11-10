// Палитры RAENKO, раунд 2 (RAE-29): 7 вариаций «Индиго + лайм» и 7 вариаций «Малина + мята».
// Роли: bg, surface, ink, muted, primary, accent, deep. Текст на кнопках подбирается по контрасту.
const GROUPS = [
  { id: 'il', name: 'Индиго + лайм', note: 'Победитель первого голосования. Ищем лучший оттенок.' },
  { id: 'rm', name: 'Малина + мята', note: 'Третье место первого голосования, самый запоминающийся вариант.' },
];
const PALETTES = [
  { group: 'il', id: 'il-classic', name: 'Классика', tag: 'Как в первом голосовании',
    why: 'Исходный вариант: яркий индиго и кислотный лайм. С ним сейчас собран сайт, поэтому это точка отсчёта.',
    c: { bg: '#FAFAFF', surface: '#FFFFFF', ink: '#15123A', muted: '#5E5B7A', primary: '#5B4CFF', accent: '#C6F432', deep: '#221C5C' } },
  { group: 'il', id: 'il-deep', name: 'Глубокий индиго', tag: 'Солиднее и спокойнее',
    why: 'Индиго темнее и насыщеннее, лайм чуть мягче. Меньше «неона», больше солидности. Хорошо, если сайт смотрят владельцы бизнеса постарше.',
    c: { bg: '#F8F8FF', surface: '#FFFFFF', ink: '#14123A', muted: '#5A5878', primary: '#4338CA', accent: '#B8F02A', deep: '#1E1A4D' } },
  { group: 'il', id: 'il-electric', name: 'Электрик', tag: 'Ярче и смелее',
    why: 'Индиго светлее и электричнее, лайм кислотнее. Максимум энергии, сайт выглядит как свежий IT-продукт.',
    c: { bg: '#FBFAFF', surface: '#FFFFFF', ink: '#16113F', muted: '#615C80', primary: '#6D5BFF', accent: '#D4FF3A', deep: '#2A1F7A' } },
  { group: 'il', id: 'il-soft', name: 'Пастельный лайм', tag: 'Мягкий акцент',
    why: 'Индиго тот же, а лайм заменён на светлый пастельный. Акценты не режут глаз, сайт выглядит легче и дороже.',
    c: { bg: '#FAFAFF', surface: '#FFFFFF', ink: '#15123A', muted: '#5E5B7A', primary: '#5B4CFF', accent: '#DDF7A1', deep: '#221C5C' } },
  { group: 'il', id: 'il-blue', name: 'Синий индиго', tag: 'Ближе к синему',
    why: 'Индиго с уклоном в синий и более зелёный лайм. Привычнее для IT-услуг, но пара по-прежнему узнаваемая.',
    c: { bg: '#F7F8FF', surface: '#FFFFFF', ink: '#111133', muted: '#565A7A', primary: '#4F46E5', accent: '#A3E635', deep: '#1E1B4B' } },
  { group: 'il', id: 'il-violet', name: 'Фиолетовый индиго', tag: 'Ближе к ИИ',
    why: 'Индиго уходит в фиолетовый: сильнее ассоциация с нейросетями и ИИ-продуктами. Лайм остаётся классическим.',
    c: { bg: '#FBF9FF', surface: '#FFFFFF', ink: '#1A1238', muted: '#625A7C', primary: '#7048E8', accent: '#C6F432', deep: '#2E1A66' } },
  { group: 'il', id: 'il-night', name: 'Ночной индиго', tag: 'Контрастные тёмные блоки',
    why: 'Фон чисто белый, а тёмные блоки (процесс, футер, CTA) почти чёрные с индиго. Сильный контраст, лайм на тёмном светится.',
    c: { bg: '#FFFFFF', surface: '#F4F4FF', ink: '#100E2A', muted: '#5A5876', primary: '#5B4CFF', accent: '#BEF264', deep: '#0F0C29' } },

  { group: 'rm', id: 'rm-classic', name: 'Классика', tag: 'Как в первом голосовании',
    why: 'Исходный вариант: малиновый основным и мятный акцентом. Точка отсчёта для сравнения.',
    c: { bg: '#FFF8FA', surface: '#FFFFFF', ink: '#1F1020', muted: '#6B5A66', primary: '#D61F5E', accent: '#2DD4BF', deep: '#4A0E2A' } },
  { group: 'rm', id: 'rm-deep', name: 'Тёмная малина', tag: 'Глубже и солиднее',
    why: 'Малина темнее, ближе к ягодному. Меньше «кричит», больше доверия, мята чуть зеленее.',
    c: { bg: '#FFF8FA', surface: '#FFFFFF', ink: '#1E0E18', muted: '#6A5662', primary: '#B0124A', accent: '#34D3B4', deep: '#3A0820' } },
  { group: 'rm', id: 'rm-fuchsia', name: 'Фуксия', tag: 'Ярче и моднее',
    why: 'Малина уходит в фуксию, мята светлее. Самый яркий и «инстаграмный» вариант группы.',
    c: { bg: '#FFF7FB', surface: '#FFFFFF', ink: '#220C1E', muted: '#6E5869', primary: '#E11D74', accent: '#3EE6C9', deep: '#4C0B33' } },
  { group: 'rm', id: 'rm-soft', name: 'Пастельная мята', tag: 'Мягкий акцент',
    why: 'Малина та же, мята пастельная. Акценты нежные, малиновый становится единственным ярким цветом.',
    c: { bg: '#FFF8FA', surface: '#FFFFFF', ink: '#1F1020', muted: '#6B5A66', primary: '#D61F5E', accent: '#A7F3D0', deep: '#4A0E2A' } },
  { group: 'rm', id: 'rm-teal', name: 'Малина + бирюза', tag: 'Глубокий акцент',
    why: 'Мята заменена на более тёмную бирюзу. Пара строже и лучше читается на светлом фоне.',
    c: { bg: '#FFF9FA', surface: '#FFFFFF', ink: '#1D0F1A', muted: '#675863', primary: '#CF2A5B', accent: '#14B8A6', deep: '#3B0D25' } },
  { group: 'rm', id: 'rm-berry', name: 'Ягода', tag: 'Винные тёмные блоки',
    why: 'Малина ближе к ягодной, тёмные блоки почти винные. Тёплый и «дорогой» вариант, мята светлая.',
    c: { bg: '#FFFAFB', surface: '#FFFFFF', ink: '#1C0B15', muted: '#66545F', primary: '#C2185B', accent: '#5EEAD4', deep: '#2B0A1C' } },
  { group: 'rm', id: 'rm-pink-green', name: 'Розовая + зелёная', tag: 'Свежо и позитивно',
    why: 'Малина розовее, мята зеленее. Самая лёгкая и весёлая пара: «заявка пришла», «всё работает».',
    c: { bg: '#FFF7FB', surface: '#FFFFFF', ink: '#210B19', muted: '#6C5766', primary: '#DB2777', accent: '#4ADE80', deep: '#500724' } },
];

const CROWN = '<svg class="crown" viewBox="0 0 24 24" aria-hidden="true"><path fill="#F5B301" d="M3 7l4.5 4L12 4l4.5 7L21 7l-2 11H5z"/><rect x="5" y="19" width="14" height="2" rx="1" fill="#F5B301"/></svg>';

const ROLES = [
  ['bg', 'Фон'], ['surface', 'Поверхность'], ['ink', 'Текст'], ['muted', 'Вторичный'],
  ['primary', 'Основной'], ['accent', 'Акцент'], ['deep', 'Глубокий'],
];

// --- контраст (WCAG 2.1)
function lum(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [n >> 16, (n >> 8) & 255, n & 255]
    .map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); })
    .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
}
function ratio(a, b) {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
const onColor = (bg, ink) => (ratio(bg, '#FFFFFF') >= ratio(bg, ink) * 0.62 ? '#FFFFFF' : ink);

function badge(label, r, large) {
  const pass = r >= (large ? 3 : 4.5);
  return `<li class="${pass ? 'ok' : 'bad'}"><span>${label}</span><b>${r.toFixed(1)}</b></li>`;
}

// --- логотип: буква R с «тумблером»
function logo(letter, track, knob) {
  return `<svg viewBox="120 140 840 800" aria-hidden="true">
    <path fill="${letter}" fill-rule="evenodd" d="M131 155H640C820 155 920 250 920 390C920 490 870 560 782 602L948 924H778L634 642H290V924H131Z M290 284H634C700 284 750 335 750 399C750 463 700 514 634 514H290Z"/>
    <path fill="${track}" d="M290 312H630A86.5 86.5 0 0 1 630 485H290Z"/>
    <circle cx="630" cy="399" r="58" fill="${knob}"/>
  </svg>`;
}

const ICONS = {
  site: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 9h18M8 9v11"/>',
  bot: '<path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v7a2.5 2.5 0 0 1-2.5 2.5H11l-4 4v-4h0A2 2 0 0 1 5 14z"/><path d="M9.5 10.5h.01M14.5 10.5h.01"/>',
  auto: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
  ai: '<path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M18.5 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
  shield: '<path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
  promo: '<path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
};
const icon = (k) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[k]}</svg>`;

const SERVICES = [
  ['site', 'Сайт', 'Лендинги и сайты с каталогом', 'от 50 000 ₽'],
  ['bot', 'Боты', 'Telegram и MAX, заявки 24/7', 'от 40 000 ₽'],
  ['auto', 'Автоматизация', 'Заявки сразу в CRM и таблицы', 'от 35 000 ₽'],
  ['ai', 'ИИ для бизнеса', 'Разбор заявок, черновики ответов', 'по запросу'],
  ['shield', 'Поддержка', 'Хостинг, бэкапы, обновления', 'от 25 000 ₽/мес'],
  ['promo', 'Продвижение', 'Директ, Карты, 2ГИС, SEO', 'от 10 000 ₽'],
];

function preview(p) {
  const c = p.c;
  const onPrimary = onColor(c.primary, c.ink);
  const onAccent = onColor(c.accent, c.ink);
  const btnBg = p.gradient ? `linear-gradient(100deg, ${c.primary}, ${c.accent})` : c.primary;
  // логотип: буква основным цветом, тумблер акцентом; у «Графита» и текущего буква тёмная, тумблер оранжевый
  const special = p.current || p.id === 'graphite';
  const letter = special ? c.ink : c.primary;
  const track = special ? c.primary : c.accent;
  const style = Object.entries(c).map(([k, v]) => `--${k}:${v}`).join(';')
    + `;--on-primary:${onPrimary};--on-accent:${onAccent};--btn:${btnBg}`;
  return `<div class="pv ${p.current ? 'pv-dark-cards' : ''}" style="${style}">
    <div class="pv-head">
      <span class="pv-logo">${logo(letter, track, '#FFFFFF')}<b>RAENKO</b></span>
      <span class="pv-nav"><i>Услуги</i><i>Примеры</i><i>Вопросы</i></span>
      <span class="pv-phone">+7 928 178-88-08</span>
    </div>

    <div class="pv-hero">
      <div>
        <span class="pv-chip">ИИ · боты · автоматизация</span>
        <h3>Сайты, ИИ, боты и&nbsp;автоматизация</h3>
        <p>Решения, которые берут рутинные задачи бизнеса на себя</p>
        <div class="pv-btns"><span class="pv-btn">Написать</span><span class="pv-btn2">Смотреть примеры</span></div>
      </div>
      <div class="pv-art" aria-hidden="true">
        <span class="pv-node n1">${icon('site')}</span>
        <span class="pv-node n2">${icon('bot')}</span>
        <span class="pv-node n3">${icon('ai')}</span>
        <svg class="pv-ring" viewBox="0 0 100 100"><circle cx="50" cy="50" r="34" fill="none" stroke-width="2.4" stroke-dasharray="7 6"/></svg>
      </div>
    </div>

    <div class="pv-sec">
      <h4>Услуги и стоимость</h4>
      <div class="pv-cards">
        ${SERVICES.map(([k, t, d, price], i) => `<div class="pv-card ${i === 1 ? 'hl' : ''}">
          <span class="pv-ic">${icon(k)}</span><b>${t}</b><small>${d}</small>
          <span class="pv-price">${price}</span></div>`).join('')}
      </div>
    </div>

    <div class="pv-sec pv-alt">
      <h4>Примеры работ</h4>
      <div class="pv-ex">
        <div class="pv-chat">
          <div class="pv-chat-h"><span class="pv-av">${icon('bot')}</span><b>Бот салона «Лето»</b><small>онлайн</small></div>
          <p class="msg in">Здравствуйте! Хочу записаться на стрижку в субботу</p>
          <p class="msg out">Свободно в субботу:</p>
          <div class="pv-slots"><span>11:00</span><span class="on">13:30</span><span>16:00</span></div>
          <p class="msg out">Готово ✓ Записал на 13:30, напомню за 2 часа</p>
        </div>
        <div class="pv-crm">
          <div class="pv-crm-h"><b>Заявки</b><span class="pv-new">+3 новых</span></div>
          <div class="row"><span>Анна, стрижка</span><i class="st s-new">Новая</i></div>
          <div class="row"><span>ООО «Вектор», сайт</span><i class="st s-work">В работе</i></div>
          <div class="row"><span>Игорь, доставка</span><i class="st s-done">Оплачено</i></div>
          <div class="pv-bar"><span>Конверсия из заявки</span><b>68%</b><em><s style="width:68%"></s></em></div>
        </div>
      </div>
    </div>

    <div class="pv-sec">
      <h4>Частые вопросы</h4>
      <div class="pv-faq">
        <div class="q open"><b>Сколько стоит сайт с ботом?</b><span class="pm">${icon('plus')}</span>
          <p>Считаем по задаче, цену и сроки фиксируем в договоре. Сайт от 50 000 ₽, бот от 40 000 ₽.</p></div>
        <div class="q"><b>Можно ли подключить нашу CRM?</b><span class="pm">${icon('plus')}</span></div>
      </div>
    </div>

    <div class="pv-sec pv-alt pv-form-sec">
      <div>
        <h4>Обсудим задачу за 15 минут</h4>
        <p class="pv-muted">Ответим в течение часа в рабочее время</p>
      </div>
      <div class="pv-form">
        <span class="pv-input">Имя</span>
        <span class="pv-input focus">+7 (928) 000-00-00</span>
        <span class="pv-check"><i>${icon('check')}</i>Согласен на обработку персональных данных</span>
        <span class="pv-btn">Отправить заявку</span>
      </div>
    </div>

    <div class="pv-cta"><span>Не знаете, с чего начать?</span><span class="pv-btn acc">Рассчитать стоимость</span></div>
    <div class="pv-foot"><span class="pv-logo">${logo('#FFFFFF', c.accent === c.deep ? c.primary : (special ? c.primary : c.accent), c.deep)}<b>RAENKO</b></span><small>Сайты · Боты · Автоматизация · ИИ · Поддержка · Продвижение</small></div>
  </div>`;
}

function card(p, i) {
  const c = p.c;
  const onPrimary = onColor(c.primary, c.ink);
  const onAccent = onColor(c.accent, c.ink);
  const sw = ROLES.map(([k, label]) => `<button class="sw" data-hex="${c[k]}" title="Скопировать ${c[k]}">
      <span class="chip" style="background:${c[k]}"></span><span class="sw-t"><b>${label}</b><code>${c[k]}</code></span></button>`).join('');
  const checks = [
    badge('Текст / фон', ratio(c.ink, c.bg)),
    badge('Вторичный / фон', ratio(c.muted, c.bg)),
    badge('Кнопка', ratio(onPrimary, c.primary), true),
    badge('Акцент-кнопка', ratio(onAccent, c.accent), true),
    badge('Основной / фон', ratio(c.primary, c.bg), true),
  ].join('');
  return `<article class="pal ${p.current ? 'is-current' : ''} ${p.top ? 'is-top' : ''}" id="${p.id}">
    <div class="pal-info">
      <p class="num">${p.current ? 'Сейчас' : String(p.num).padStart(2, '0')}${p.top ? `<span class="crown-badge">${CROWN} Топ-${p.rank} по голосам</span>` : ''}</p>
      <h2>${p.name}</h2>
      ${p.votes ? `<p class="votes"><span title="Понравился">👍 ${p.votes.l}</span><span title="Самый лучший">⭐ ${p.votes.b}</span><span title="Не понравился">👎 ${p.votes.d}</span><b>${p.votes.score > 0 ? '+' : ''}${p.votes.score} балл.</b></p>` : ''}
      <p class="tag">${p.tag}</p>
      <p class="why">${p.why}</p>
      <div class="sws">${sw}</div>
      <ul class="checks">${checks}</ul>
    </div>
    <div class="pal-pv">${preview(p)}</div>
  </article>`;
}


// номера для голосования: 1–14 подряд
PALETTES.forEach((p, i) => { p.num = i + 1; });

const list = document.getElementById('list');
list.innerHTML = GROUPS.map((g) => `<section class="grp" id="grp-${g.id}">
    <div class="grp-h"><h2>${g.name}</h2><p>${g.note}</p></div>
    ${PALETTES.filter((p) => p.group === g.id).map(card).join('')}
  </section>`).join('');

const jump = document.getElementById('jump');
jump.innerHTML = GROUPS.map((g) => `<p class="jump-g">${g.name}</p>` + PALETTES.filter((p) => p.group === g.id).map((p) =>
  `<a href="#${p.id}" data-id="${p.id}"><span class="n">${p.num}</span><span class="dots"><span style="background:${p.c.primary}"></span><span style="background:${p.c.accent}"></span></span>${p.name}</a>`).join('')).join('');

// подсветка текущего варианта в навигации
const links = Object.fromEntries([...jump.querySelectorAll('a')].map(a => [a.dataset.id, a]));
let activeId = null;
function setActive(id) {
  if (id === activeId || !links[id]) return;
  if (activeId) links[activeId].classList.remove('active');
  links[id].classList.add('active');
  activeId = id;
  const a = links[id];
  if (jump.scrollWidth > jump.clientWidth) {
    jump.scrollTo({ left: a.offsetLeft - jump.clientWidth / 2 + a.offsetWidth / 2, behavior: 'smooth' });
  } else if (jump.parentElement.scrollHeight > jump.parentElement.clientHeight) {
    a.scrollIntoView({ block: 'nearest' });
  }
}
const cards = [...document.querySelectorAll('.pal')];
function onScroll() {
  const line = window.innerHeight * 0.35;
  let cur = cards[0];
  for (const c of cards) { if (c.getBoundingClientRect().top <= line) cur = c; else break; }
  setActive(cur.id);
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
onScroll();

// ссылка на Google-форму голосования (вставить после создания формы скриптом google-form.gs)
const VOTE_URL = '';
if (VOTE_URL) { const v = document.getElementById('vote'); v.href = VOTE_URL; v.hidden = false; }

const toast = document.getElementById('toast');
document.addEventListener('click', (e) => {
  const b = e.target.closest('.sw');
  if (!b) return;
  const hex = b.dataset.hex;
  (navigator.clipboard ? navigator.clipboard.writeText(hex) : Promise.reject()).catch(() => {}).finally(() => {
    toast.textContent = `Скопировано ${hex}`;
    toast.classList.add('on');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('on'), 1400);
  });
});
