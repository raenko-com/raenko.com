// Палитры для редизайна raenko.com (RAE-29).
// Роли: bg, surface, ink, muted, primary, accent, deep. Текст на кнопках подбирается по контрасту.
const PALETTES = [
  {
    id: 'current', name: 'Сейчас на сайте', tag: 'Для сравнения',
    why: 'Тёмно-синий занимает большие площади (карточки, текст), из-за этого сайт выглядит тяжёлым и тусклым. Оранжевый хороший, но ему не с чем контрастировать, кроме тёмного.',
    c: { bg: '#FFFFFF', surface: '#F2F4F7', ink: '#1E3A5F', muted: '#5B6B7F', primary: '#FF5A1F', accent: '#FF5A1F', deep: '#1E3A5F' },
    current: true,
  },
  {
    id: 'blue', name: 'Чистый синий', tag: 'Эволюция бренда',
    why: 'Самый мягкий переход: тот же дуэт «синий + оранжевый», но синий яркий и живой, а не чернильный. Тёмный оставляем только тексту. Логотип узнаётся сразу.',
    c: { bg: '#F7F9FC', surface: '#FFFFFF', ink: '#0F172A', muted: '#5B6474', primary: '#2563EB', accent: '#FF6B2C', deep: '#0F1E3D' },
  },
  {
    id: 'graphite', name: 'Графит + оранжевый', tag: 'Минимализм, оставляем свой оранжевый',
    why: 'Почти чёрно-белый сайт, в котором наш #FF5A1F становится единственным ярким цветом, а персиковый идёт на мягкие подложки и бейджи. Выглядит дорого и современно, как сайты студий и SaaS. Синий уходит совсем.',
    c: { bg: '#FFFFFF', surface: '#F4F4F5', ink: '#18181B', muted: '#63636B', primary: '#FF5A1F', accent: '#FFD2BF', deep: '#18181B' },
  },
  {
    id: 'indigo-lime', name: 'Индиго + лайм', tag: 'Смело, «технологично»',
    why: 'Яркий индиго и кислотный лайм. Сразу считывается как IT и автоматизация, хорошо работает на бейджах «24/7», цифрах и ценах. Лайм только как акцент, иначе режет глаз.',
    c: { bg: '#FAFAFF', surface: '#FFFFFF', ink: '#15123A', muted: '#5E5B7A', primary: '#5B4CFF', accent: '#C6F432', deep: '#221C5C' },
  },
  {
    id: 'violet-pink', name: 'Фиолет + розовый', tag: 'Акцент на ИИ',
    why: 'Фиолетовый сейчас прочно ассоциируется с нейросетями и ИИ-продуктами. Розовый добавляет энергии и тепла. Подойдёт, если ИИ-интеграция станет главным направлением.',
    c: { bg: '#FCFAFF', surface: '#FFFFFF', ink: '#1C1236', muted: '#645A7A', primary: '#7C3AED', accent: '#FF4D8D', deep: '#2A1458' },
  },
  {
    id: 'ultra-sun', name: 'Ультрамарин + солнце', tag: 'Ярко и дружелюбно',
    why: 'Насыщенный ультрамарин с тёплым жёлтым. Очень контрастно и позитивно, хорошо для малого бизнеса: «просто, понятно, быстро». Жёлтый на кнопках с тёмным текстом.',
    c: { bg: '#FFFFFF', surface: '#F3F5FF', ink: '#0D1333', muted: '#545B7A', primary: '#2340FF', accent: '#FFC83D', deep: '#0D1A80' },
  },
  {
    id: 'teal-tangerine', name: 'Бирюза + мандарин', tag: 'Свежо, оранжевый остаётся',
    why: 'Бирюзовый вместо тёмно-синего: лёгкий, «чистый», про сервис и поддержку. Мандариновый близок к нашему оранжевому, так что логотип почти не меняется.',
    c: { bg: '#F5FBFB', surface: '#FFFFFF', ink: '#0B2530', muted: '#4F6870', primary: '#0B8F8A', accent: '#FF7A2F', deep: '#0B3B40' },
  },
  {
    id: 'coral-sky', name: 'Коралл + небо', tag: 'Тепло и легко',
    why: 'Коралловый основным, голубой акцентом. Самая «лёгкая» и человечная палитра из десяти, без корпоративной строгости. Хорошо смотрится с плоскими иллюстрациями.',
    c: { bg: '#FFFBF8', surface: '#FFFFFF', ink: '#1F1A2E', muted: '#6A6273', primary: '#F0484E', accent: '#3BA4FF', deep: '#2B2140' },
  },
  {
    id: 'cobalt-cyan', name: 'Кобальт + циан', tag: 'Градиент, «умные системы»',
    why: 'Кобальт, переходящий в циан. Градиент на кнопках и в hero даёт ощущение технологичности и скорости, но без «вырвиглаза». Классика для автоматизации и интеграций.',
    c: { bg: '#F6F9FF', surface: '#FFFFFF', ink: '#0A1630', muted: '#52607A', primary: '#3B5BFF', accent: '#00B8F0', deep: '#0A1A4A' },
    gradient: true,
  },
  {
    id: 'emerald-lilac', name: 'Изумруд + сирень', tag: 'Спокойно и надёжно',
    why: 'Зелёный читается как «работает, всё в порядке», сиреневый добавляет современности. Хорошо подходит под поддержку, хостинг и автоматизацию: про стабильность.',
    c: { bg: '#F7FBF9', surface: '#FFFFFF', ink: '#10211B', muted: '#55665F', primary: '#0E9F73', accent: '#8B5CF6', deep: '#0E3B2E' },
  },
  {
    id: 'night', name: 'Ночной неон', tag: 'Тёмная тема',
    why: 'Тёмный фон, светлый текст, яркий синий и наш оранжевый. Самый «вау» вариант для hero и примеров, но тяжелее в поддержке. Можно использовать как тёмную тему к варианту «Чистый синий».',
    c: { bg: '#0B1020', surface: '#151B2E', ink: '#EEF2FF', muted: '#9AA4BF', primary: '#5B8CFF', accent: '#FF6B3D', deep: '#070B16' },
    dark: true,
  },
];

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
};
const icon = (k) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[k]}</svg>`;

function preview(p) {
  const c = p.c;
  const onPrimary = onColor(c.primary, p.dark ? '#0B1020' : c.ink);
  const onAccent = onColor(c.accent, p.dark ? '#0B1020' : c.ink);
  const btnBg = p.gradient ? `linear-gradient(100deg, ${c.primary}, ${c.accent})` : c.primary;
  // логотип: буква основным цветом (или текстом, если основной слишком светлый), тумблер акцентом
  const letter = p.current ? c.ink : (p.id === 'graphite' ? c.ink : c.primary);
  const track = p.current ? c.primary : (p.id === 'graphite' ? c.primary : c.accent);
  const knob = p.dark ? c.bg : '#FFFFFF';
  const cardsDark = p.current;
  const style = Object.entries(c).map(([k, v]) => `--${k}:${v}`).join(';')
    + `;--on-primary:${onPrimary};--on-accent:${onAccent};--btn:${btnBg}`;
  const services = [
    ['site', 'Сайт', 'Лендинги и сайты с каталогом'],
    ['bot', 'Боты', 'Telegram и MAX, заявки 24/7'],
    ['auto', 'Автоматизация', 'Заявки сразу в CRM'],
  ];
  return `<div class="pv ${cardsDark ? 'pv-dark-cards' : ''}" style="${style}">
    <div class="pv-head">
      <span class="pv-logo">${logo(letter, track, knob)}<b>RAENKO</b></span>
      <span class="pv-nav"><i>Услуги</i><i>Примеры</i><i>Вопросы</i></span>
      <span class="pv-phone">+7 928 128-88-08</span>
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
    <div class="pv-cards">
      ${services.map(([k, t, d], i) => `<div class="pv-card ${i === 1 ? 'hl' : ''}">
        <span class="pv-ic">${icon(k)}</span><b>${t}</b><small>${d}</small>
        <span class="pv-price">от ${[50, 40, 35][i]} 000 ₽</span></div>`).join('')}
    </div>
    <div class="pv-cta"><span>Обсудим задачу за 15 минут</span><span class="pv-btn acc">Рассчитать</span></div>
  </div>`;
}

function card(p, i) {
  const c = p.c;
  const onPrimary = onColor(c.primary, p.dark ? '#0B1020' : c.ink);
  const onAccent = onColor(c.accent, p.dark ? '#0B1020' : c.ink);
  const sw = ROLES.map(([k, label]) => `<button class="sw" data-hex="${c[k]}" title="Скопировать ${c[k]}">
      <span class="chip" style="background:${c[k]}"></span><span class="sw-t"><b>${label}</b><code>${c[k]}</code></span></button>`).join('');
  const checks = [
    badge('Текст / фон', ratio(c.ink, c.bg)),
    badge('Вторичный / фон', ratio(c.muted, c.bg)),
    badge('Кнопка', ratio(onPrimary, c.primary), true),
    badge('Акцент-кнопка', ratio(onAccent, c.accent), true),
    badge('Основной / фон', ratio(c.primary, c.bg), true),
  ].join('');
  return `<article class="pal ${p.current ? 'is-current' : ''}" id="${p.id}">
    <div class="pal-info">
      <p class="num">${p.current ? 'Сейчас' : String(i).padStart(2, '0')}</p>
      <h2>${p.name}</h2>
      <p class="tag">${p.tag}</p>
      <p class="why">${p.why}</p>
      <div class="sws">${sw}</div>
      <ul class="checks">${checks}</ul>
    </div>
    <div class="pal-pv">${preview(p)}</div>
  </article>`;
}

document.getElementById('list').innerHTML = PALETTES.map(card).join('');
document.getElementById('jump').innerHTML = PALETTES.map((p, i) =>
  `<a href="#${p.id}"><span style="background:${p.c.primary}"></span><span style="background:${p.c.accent}"></span>${p.current ? 'Сейчас' : i + '. ' + p.name}</a>`).join('');

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
