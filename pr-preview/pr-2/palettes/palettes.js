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
    id: 'azure-peach', name: 'Лазурь + персик', tag: 'Воздушно и светло',
    why: 'Светлый лазурный вместо тёмно-синего и мягкий персиковый вместо резкого оранжевого. Самая «воздушная» палитра: много света, ничего не давит. Хорошо для сайта, где главное спокойствие и доверие.',
    c: { bg: '#F5FAFF', surface: '#FFFFFF', ink: '#0B1B2B', muted: '#536273', primary: '#0A7BC9', accent: '#FFB38A', deep: '#0B3A66' },
  },
  {
    id: 'raspberry-mint', name: 'Малина + мята', tag: 'Ярко и запоминается',
    why: 'Малиновый основным и мятный акцентом. Нестандартно для IT, поэтому сайт легко запомнить среди синих конкурентов. Энергично, но без кислотности.',
    c: { bg: '#FFF8FA', surface: '#FFFFFF', ink: '#1F1020', muted: '#6B5A66', primary: '#D61F5E', accent: '#2DD4BF', deep: '#4A0E2A' },
  },
  {
    id: 'blue-mint', name: 'Синий + мятный', tag: 'Финтех-стиль',
    why: 'Яркий синий и свежий мятно-зелёный, как у банков и сервисов оплаты. Зелёный хорошо подсвечивает результат: «заявка пришла», «оплата прошла», «бот ответил».',
    c: { bg: '#F5F8FF', surface: '#FFFFFF', ink: '#0B1430', muted: '#525C78', primary: '#1F5BFF', accent: '#34D399', deep: '#0F2A6B' },
  },
  {
    id: 'orange-violet', name: 'Оранжевый + фиолет', tag: 'Наш оранжевый главный',
    why: 'Оставляем фирменный #FF5A1F основным цветом, а тёмно-синий меняем на яркий фиолетовый. Логотип остаётся почти прежним, а сайт становится заметно живее и современнее.',
    c: { bg: '#FFFFFF', surface: '#FFF7F2', ink: '#1B1530', muted: '#625B72', primary: '#FF5A1F', accent: '#6D5DFC', deep: '#2B1F5C' },
  },
  {
    id: 'ocean-coral', name: 'Океан + коралл', tag: 'Сбалансированно',
    why: 'Насыщенный морской синий и тёплый коралловый. Похоже на нашу текущую пару, но оба цвета светлее и чище, поэтому без тяжести. Безопасный вариант, если не хочется рисковать.',
    c: { bg: '#F4F9FC', surface: '#FFFFFF', ink: '#0A2233', muted: '#4E6372', primary: '#0077B6', accent: '#FF7F6B', deep: '#023E5C' },
  },
  {
    id: 'lavender-orange', name: 'Лаванда + апельсин', tag: 'Мягко и современно',
    why: 'Мягкий сине-фиолетовый (как у Notion, Linear, Stripe) и апельсиновый акцент. Современно и дружелюбно, при этом оранжевый связывает с текущим логотипом.',
    c: { bg: '#F8F8FF', surface: '#FFFFFF', ink: '#17183B', muted: '#5A5C7A', primary: '#5457E8', accent: '#FF8A3D', deep: '#262A6E' },
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
const jump = document.getElementById('jump');
jump.innerHTML = PALETTES.map((p, i) =>
  `<a href="#${p.id}" data-id="${p.id}"><span class="n">${p.current ? '—' : i}</span><span class="dots"><span style="background:${p.c.primary}"></span><span style="background:${p.c.accent}"></span></span>${p.current ? 'Сейчас' : p.name}</a>`).join('');

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

// ссылка на Google-форму голосования (вставить после создания формы)
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
