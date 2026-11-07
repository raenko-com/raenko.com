/**
 * Голосование за палитру сайта RAENKO (RAE-29).
 *
 * Как запустить:
 * 1. Откройте https://script.google.com → «Новый проект».
 * 2. Вставьте этот код вместо содержимого Code.gs и сохраните.
 * 3. Вверху выберите функцию createPaletteVote и нажмите «Выполнить».
 *    Google попросит доступ к Формам, Таблицам и внешним URL (для картинок) — разрешите.
 * 4. Ссылки на форму и таблицу появятся в «Журнале выполнения».
 *
 * Что создаётся:
 * - Google Форма: до 5 понравившихся вариантов, один лучший, что не понравилось, комментарий.
 *   В форме есть картинка-превью каждого варианта, чтобы выбирать можно было прямо с телефона.
 * - Google Таблица: лист с ответами формы и лист «Итоги» с подсчётом голосов и диаграммой.
 */

const PAGE_URL = 'https://raenko-com.github.io/raenko.com/pr-preview/pr-2/palettes/';
const IMG_BASE = PAGE_URL + 'img/';
const ADD_IMAGES = true; // false — форма без картинок, только названия
const MAX_PICK = 5;

const VARIANTS = [
  ['01-blue', 'Чистый синий'],
  ['02-graphite', 'Графит + оранжевый'],
  ['03-indigo-lime', 'Индиго + лайм'],
  ['04-violet-pink', 'Фиолет + розовый'],
  ['05-ultra-sun', 'Ультрамарин + солнце'],
  ['06-teal-tangerine', 'Бирюза + мандарин'],
  ['07-coral-sky', 'Коралл + небо'],
  ['08-cobalt-cyan', 'Кобальт + циан'],
  ['09-emerald-lilac', 'Изумруд + сирень'],
  ['10-azure-peach', 'Лазурь + персик'],
  ['11-raspberry-mint', 'Малина + мята'],
  ['12-blue-mint', 'Синий + мятный'],
  ['13-orange-violet', 'Оранжевый + фиолет'],
  ['14-ocean-coral', 'Океан + коралл'],
  ['15-lavender-orange', 'Лаванда + апельсин'],
];

// «1. Чистый синий», «2. Графит + оранжевый», …
const LABELS = VARIANTS.map(([, name], i) => `${i + 1}. ${name}`);

const Q_PICK = `Какие варианты понравились? Выберите от 1 до ${MAX_PICK}`;
const Q_BEST = 'Какой из них самый лучший?';
const Q_BAD = 'Какие точно не понравились? (необязательно)';

function createPaletteVote() {
  const form = FormApp.create('RAENKO: выбираем цвета для сайта');
  form
    .setDescription(
      'Мы обновляем сайт raenko.pro (сайты, боты, автоматизация и ИИ для бизнеса) и выбираем новые цвета.\n\n' +
      'Все варианты вживую, с примерами страниц: ' + PAGE_URL + '\n' +
      'Ниже есть картинка каждого варианта, можно смотреть прямо тут.\n\n' +
      'Займёт 2 минуты. Спасибо!'
    )
    .setCollectEmail(false)
    .setProgressBar(false)
    .setShowLinkToRespondAgain(false)
    .setConfirmationMessage('Спасибо! Ваш голос учтён 🙌');

  form.addTextItem().setTitle('Как вас зовут? (необязательно)');

  if (ADD_IMAGES) {
    form.addSectionHeaderItem()
      .setTitle('Варианты')
      .setHelpText('Пролистайте картинки, номера совпадают с вариантами ответов ниже. Крупнее и с примерами: ' + PAGE_URL);
    VARIANTS.forEach(([file], i) => {
      try {
        const blob = UrlFetchApp.fetch(IMG_BASE + file + '.png').getBlob();
        form.addImageItem().setTitle(LABELS[i]).setImage(blob);
      } catch (e) {
        Logger.log('Не загрузилась картинка ' + file + ': ' + e);
      }
    });
    form.addPageBreakItem().setTitle('Ваш выбор');
  }

  const pick = form.addCheckboxItem()
    .setTitle(Q_PICK)
    .setChoiceValues(LABELS)
    .setRequired(true);
  pick.setValidation(
    FormApp.createCheckboxValidation()
      .setHelpText(`Можно выбрать не больше ${MAX_PICK} вариантов`)
      .requireSelectAtMost(MAX_PICK)
      .build()
  );

  form.addListItem()
    .setTitle(Q_BEST)
    .setChoiceValues(LABELS)
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle(Q_BAD)
    .setChoiceValues(LABELS);

  form.addParagraphTextItem()
    .setTitle('Комментарий: что понравилось, что смутило? (необязательно)');

  // Таблица для ответов
  const ss = SpreadsheetApp.create('RAENKO: голосование за цвета сайта');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  SpreadsheetApp.flush();
  Utilities.sleep(3000);

  buildSummary(ss);

  Logger.log('Форма для ответов: ' + form.getPublishedUrl());
  Logger.log('Короткая ссылка: ' + form.shortenFormUrl(form.getPublishedUrl()));
  Logger.log('Редактирование формы: ' + form.getEditUrl());
  Logger.log('Таблица: ' + ss.getUrl());
}

/** Лист «Итоги»: голоса по каждому варианту и диаграмма. Можно запустить повторно. */
function buildSummary(ss) {
  ss = ss || SpreadsheetApp.getActiveSpreadsheet();
  const responses = ss.getSheets().find((s) => s.getFormUrl());
  if (!responses) throw new Error('Не найден лист с ответами формы');

  const header = responses.getRange(1, 1, 1, responses.getLastColumn()).getValues()[0];
  const col = (title) => {
    const idx = header.indexOf(title);
    if (idx < 0) throw new Error('Нет столбца: ' + title);
    return colLetter(idx + 1);
  };
  const ref = (title) => `'${responses.getName()}'!${col(title)}2:${col(title)}`;

  let sum = ss.getSheetByName('Итоги');
  if (!sum) sum = ss.insertSheet('Итоги');
  sum.clear();
  sum.getRange('A1:E1')
    .setValues([['Вариант', 'Понравился', 'Лучший', 'Не понравился', 'Баллы']])
    .setFontWeight('bold');

  LABELS.forEach((label, i) => {
    const r = i + 2;
    // точное совпадение варианта внутри списка «1. …, 5. …» (ответы чекбоксов идут через запятую)
    const inList = (rng) => `SUMPRODUCT(--ISNUMBER(SEARCH(", "&$A${r}&",", ", "&${rng}&",")))`;
    sum.getRange(r, 1, 1, 5).setFormulas([[
      '', // A заполним значением ниже
      `=${inList(ref(Q_PICK))}`,
      `=COUNTIF(${ref(Q_BEST)}, $A${r})`,
      `=${inList(ref(Q_BAD))}`,
      `=B${r}+2*C${r}-D${r}`,
    ]]);
    sum.getRange(r, 1).setValue(label);
  });

  const last = LABELS.length + 1;
  sum.getRange(`G1`).setValue('Баллы = понравился + 2 × лучший − не понравился').setFontStyle('italic');
  sum.getRange(`G2`).setValue('Всего ответов:');
  sum.getRange(`H2`).setFormula(`=COUNTA(${ref(Q_BEST)})`);
  sum.setFrozenRows(1);
  sum.autoResizeColumns(1, 5);

  sum.getCharts().forEach((c) => sum.removeChart(c));
  const chart = sum.newChart()
    .setChartType(Charts.ChartType.BAR)
    .addRange(sum.getRange(`A1:C${last}`))
    .setOption('title', 'Голоса по вариантам')
    .setOption('isStacked', true)
    .setOption('legend', { position: 'top' })
    .setOption('colors', ['#2563EB', '#FF5A1F'])
    .setOption('height', 520)
    .setOption('width', 720)
    .setPosition(4, 7, 0, 0)
    .build();
  sum.insertChart(chart);
  ss.setActiveSheet(sum);
}

function colLetter(n) {
  let s = '';
  while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); }
  return s;
}
