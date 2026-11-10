/**
 * Голосование за оттенок палитры сайта RAENKO, раунд 2 (RAE-29).
 * 7 вариаций «Индиго + лайм» и 7 вариаций «Малина + мята».
 *
 * Как запустить:
 * 1. Откройте https://script.google.com → «Новый проект».
 * 2. Вставьте этот код вместо содержимого Code.gs и сохраните (Ctrl+S).
 * 3. Обновите страницу, вверху выберите функцию createPaletteVote2 и нажмите «Выполнить».
 *    Google попросит доступ к Формам, Таблицам и внешним URL (для картинок) — разрешите.
 * 4. Ссылки на форму и таблицу появятся в «Журнале выполнения».
 *
 * Итоги считаются скриптом (без формул), лист «Итоги» обновляется сам после каждого ответа.
 * Если нужно пересчитать вручную: выберите функцию updateSummary и нажмите «Выполнить».
 */

const PAGE_URL = 'https://raenko-com.github.io/raenko.com/pr-preview/pr-2/palettes/round2/';
const IMG_BASE = PAGE_URL + 'img/';
const ADD_IMAGES = true; // false — форма без картинок, только названия
const MAX_PICK = 4;

const VARIANTS = [
  ['01-il-classic', 'Индиго + лайм: Классика'],
  ['02-il-deep', 'Индиго + лайм: Глубокий индиго'],
  ['03-il-electric', 'Индиго + лайм: Электрик'],
  ['04-il-soft', 'Индиго + лайм: Пастельный лайм'],
  ['05-il-blue', 'Индиго + лайм: Синий индиго'],
  ['06-il-violet', 'Индиго + лайм: Фиолетовый индиго'],
  ['07-il-night', 'Индиго + лайм: Ночной индиго'],
  ['08-rm-classic', 'Малина + мята: Классика'],
  ['09-rm-deep', 'Малина + мята: Тёмная малина'],
  ['10-rm-fuchsia', 'Малина + мята: Фуксия'],
  ['11-rm-soft', 'Малина + мята: Пастельная мята'],
  ['12-rm-teal', 'Малина + мята: Малина + бирюза'],
  ['13-rm-berry', 'Малина + мята: Ягода'],
  ['14-rm-pink-green', 'Малина + мята: Розовая + зелёная'],
];

const LABELS = VARIANTS.map(([, name], i) => `${i + 1}. ${name}`);

const Q_PICK = `Какие варианты понравились? Выберите от 1 до ${MAX_PICK}`;
const Q_BEST = 'Какой из них самый лучший?';
const Q_BAD = 'Какие точно не понравились? (необязательно)';

function createPaletteVote2() {
  const form = FormApp.create('RAENKO: выбираем оттенок для сайта');
  form
    .setDescription(
      'Мы обновляем сайт raenko.com (сайты, боты, автоматизация и ИИ для бизнеса). ' +
      'В прошлый раз вы выбрали цвета, спасибо! Победили «Индиго + лайм» и «Малина + мята». ' +
      'Теперь выбираем оттенок: по 7 вариаций каждой пары.\n\n' +
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

  const ss = SpreadsheetApp.create('RAENKO: голосование за оттенок, раунд 2');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  PropertiesService.getScriptProperties().setProperty('SS_ID', ss.getId());

  // итоги пересчитываются после каждого ответа
  ScriptApp.newTrigger('updateSummary').forForm(form).onFormSubmit().create();
  SpreadsheetApp.flush();
  Utilities.sleep(2000);
  updateSummary();

  Logger.log('Форма для ответов: ' + form.getPublishedUrl());
  Logger.log('Короткая ссылка: ' + form.shortenFormUrl(form.getPublishedUrl()));
  Logger.log('Редактирование формы: ' + form.getEditUrl());
  Logger.log('Таблица: ' + ss.getUrl());
}

/** Лист «Итоги»: считает голоса скриптом и пишет готовые числа. */
function updateSummary() {
  const id = PropertiesService.getScriptProperties().getProperty('SS_ID');
  const ss = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet();
  const responses = ss.getSheets().find((s) => s.getFormUrl());
  if (!responses) throw new Error('Не найден лист с ответами формы');

  const values = responses.getDataRange().getValues();
  const header = values[0] || [];
  const iPick = header.indexOf(Q_PICK), iBest = header.indexOf(Q_BEST), iBad = header.indexOf(Q_BAD);
  const stats = LABELS.map(() => [0, 0, 0]);
  const split = (v) => String(v || '').split(/,\s*(?=\d+\.\s)/).map((s) => s.trim()).filter(String);
  let total = 0;
  values.slice(1).forEach((row) => {
    if (iBest < 0 || !row[iBest]) return;
    total++;
    if (iPick >= 0) split(row[iPick]).forEach((v) => { const k = LABELS.indexOf(v); if (k >= 0) stats[k][0]++; });
    const kb = LABELS.indexOf(String(row[iBest]).trim()); if (kb >= 0) stats[kb][1]++;
    if (iBad >= 0) split(row[iBad]).forEach((v) => { const k = LABELS.indexOf(v); if (k >= 0) stats[k][2]++; });
  });

  let sum = ss.getSheetByName('Итоги');
  if (!sum) sum = ss.insertSheet('Итоги');
  sum.clear();
  const rows = LABELS.map((label, i) => {
    const [l, b, d] = stats[i];
    return [label, l, b, d, l + 2 * b - d];
  });
  sum.getRange(1, 1, 1, 5).setValues([['Вариант', 'Понравился', 'Лучший', 'Не понравился', 'Баллы']]).setFontWeight('bold');
  sum.getRange(2, 1, rows.length, 5).setValues(rows);
  sum.getRange('G1').setValue('Баллы = понравился + 2 × лучший − не понравился').setFontStyle('italic');
  sum.getRange('G2').setValue('Всего ответов:');
  sum.getRange('H2').setValue(total);
  sum.getRange('G3').setValue('Обновлено:');
  sum.getRange('H3').setValue(new Date());
  sum.setFrozenRows(1);
  sum.autoResizeColumns(1, 5);

  sum.getCharts().forEach((c) => sum.removeChart(c));
  sum.insertChart(sum.newChart()
    .setChartType(Charts.ChartType.BAR)
    .addRange(sum.getRange(`A1:C${rows.length + 1}`))
    .setOption('title', 'Голоса по вариантам')
    .setOption('isStacked', true)
    .setOption('legend', { position: 'top' })
    .setOption('colors', ['#5B4CFF', '#D61F5E'])
    .setOption('height', 520)
    .setOption('width', 720)
    .setPosition(5, 7, 0, 0)
    .build());
}
