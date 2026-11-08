/*
 * Прайс калькулятора (RAE-18). Править цены и сроки здесь, код трогать не нужно.
 *
 * Направление (group) = карточка услуги на сайте.
 * Опция:
 *   type: "base"  — основа направления, выбирается одна (радиокнопка);
 *   type: "extra" — дополнительно, можно несколько (галочка).
 *   price: [от, до] в рублях; days: [от, до] в рабочих днях.
 *   needsBase: true — опция доступна, только когда выбрана основа направления.
 *   on: true — отмечена по умолчанию.
 *   monthly: true — ежемесячный платёж, в стоимость проекта не входит.
 *   includedWith: "site" — уже входит, если выбран сайт.
 *   quote: true — цена после обсуждения.
 */
window.RC_PRICES = {
  groups: [
    {
      id: "site",
      icon: "site",
      title: "Сайт",
      hint: "Лендинг, визитка или сайт с каталогом",
      card: { from: 50000, days: 7 },
      options: [
        { id: "landing", type: "base", on: true, title: "Сайт-визитка или лендинг", note: "Адаптивная вёрстка, базовое SEO, аналитика", price: [50000, 80000], days: [7, 14] },
        { id: "catalog", type: "base", title: "Сайт с каталогом", note: "Услуги или товары с фильтрами", price: [80000, 160000], days: [14, 25] },
        { id: "cms", type: "extra", needsBase: true, title: "Панель управления контентом", note: "Сами меняете тексты и фото", price: [20000, 40000], days: [5, 10] }
      ]
    },
    {
      id: "bots",
      icon: "bot",
      title: "Боты в Telegram и MAX",
      hint: "Заявки, запись и оплата 24/7",
      card: { from: 40000, days: 7 },
      options: [
        { id: "faq", type: "base", on: true, title: "Бот для ответов на частые вопросы и сбора заявок", price: [40000, 80000], days: [7, 12] },
        { id: "booking", type: "base", title: "Запись или заказ через бота", note: "С напоминаниями клиенту", price: [55000, 100000], days: [10, 15] },
        { id: "pay", type: "extra", needsBase: true, title: "Приём оплаты через бота", price: [15000, 30000], days: [3, 7] }
      ]
    },
    {
      id: "auto",
      icon: "gear",
      title: "Автоматизация и интеграции",
      hint: "Заявки сами попадают в Telegram, таблицу или CRM",
      card: { from: 35000, days: 7 },
      options: [
        { id: "leads", type: "extra", on: true, title: "Передача заявок с сайта в Telegram или таблицу", price: [35000, 60000], days: [7, 10] },
        { id: "crm", type: "extra", title: "Интеграция с amoCRM, Битрикс24 или 1С", price: [15000, 40000], days: [3, 7] },
        { id: "reports", type: "extra", title: "Автоматизация обработки заявок и отчётности", note: "Без дублей и ручного переписывания", price: [20000, 50000], days: [5, 10] }
      ]
    },
    {
      id: "ai",
      icon: "case",
      title: "ИИ для бизнеса",
      hint: "Нейросети в рабочих процессах",
      card: { from: 40000, days: 14 },
      options: [
        { id: "classify", type: "extra", on: true, title: "Разбор входящих заявок и писем", price: [40000, 80000], days: [14, 20] },
        { id: "drafts", type: "extra", title: "Черновики ответов и КП по базе знаний", price: [10000, 30000], days: [3, 7] },
        { id: "calls", type: "extra", title: "Расшифровка звонков", price: [15000, 35000], days: [3, 7] }
      ]
    },
    {
      id: "support",
      icon: "term",
      title: "Поддержка и безопасность",
      hint: "Мониторинг, бэкапы, обновления",
      card: { from: 25000, monthly: true },
      options: [
        { id: "care", type: "extra", on: true, monthly: true, title: "Мониторинг, резервные копии, обновления и исправление ошибок", price: [25000, 25000] },
        { id: "dev", type: "extra", quote: true, title: "Доработка функционала", note: "Оценим после обсуждения" }
      ]
    },
    {
      id: "promo",
      icon: "promo",
      title: "Продвижение",
      hint: "Реклама, карты и аналитика",
      card: { from: 10000, days: 2 },
      options: [
        { id: "direct", type: "extra", on: true, title: "Настройка рекламы в Яндекс Директе", note: "Рекламный бюджет оплачивается отдельно", price: [10000, 25000], days: [2, 4] },
        { id: "maps", type: "extra", title: "Карточки в Яндекс Картах и 2ГИС", price: [5000, 15000], days: [2, 5] },
        { id: "seo", type: "extra", includedWith: "site", title: "Базовое SEO и аналитика", price: [10000, 25000], days: [3, 7] }
      ]
    }
  ]
};
