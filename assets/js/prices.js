/*
 * Прайс калькулятора (RAE-18, расширен в RAE-25). Править цены и сроки здесь, код трогать не нужно.
 *
 * Направление (group) = карточка услуги на сайте.
 * Опция:
 *   type: "base"  — основа направления, выбирается одна (радиокнопка);
 *   type: "extra" — дополнительно, можно несколько (галочка).
 *   section: "Платформа" — свой подзаголовок над опцией (вместо «Дополнительно»).
 *   price: [от, до] в рублях; [0, 0] — входит в стоимость; days: [от, до] в рабочих днях.
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
      hint: "Лендинг, визитка, каталог или магазин",
      card: { from: 50000, days: 7 },
      options: [
        { id: "landing", type: "base", on: true, title: "Сайт-визитка или лендинг", note: "Адаптивная вёрстка, базовое SEO, аналитика", price: [50000, 80000], days: [7, 14] },
        { id: "catalog", type: "base", title: "Сайт с каталогом", note: "Услуги или товары с фильтрами", price: [80000, 160000], days: [14, 25] },
        { id: "shop", type: "base", title: "Интернет-магазин", note: "Корзина, оплата, личный кабинет", price: [150000, 300000], days: [25, 40] },
        { id: "cms", type: "extra", needsBase: true, title: "Панель управления контентом", note: "Сами меняете тексты и фото", price: [20000, 40000], days: [5, 10] },
        { id: "quiz", type: "extra", needsBase: true, title: "Квиз или калькулятор для заявок", price: [15000, 35000], days: [3, 7] },
        { id: "booking", type: "extra", needsBase: true, title: "Онлайн-запись на сайте", note: "Выбор услуги, даты и времени", price: [20000, 40000], days: [4, 8] },
        { id: "payment", type: "extra", needsBase: true, title: "Онлайн-оплата", note: "Карты и СБП", price: [15000, 30000], days: [3, 5] },
        { id: "lang", type: "extra", needsBase: true, title: "Вторая языковая версия", price: [15000, 30000], days: [3, 6] },
        { id: "content", type: "extra", needsBase: true, title: "Тексты и подбор изображений", note: "Если нет готовых материалов", price: [10000, 25000], days: [3, 5] }
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
        { id: "shop", type: "base", title: "Магазин в боте", note: "Каталог, корзина и статус заказа", price: [70000, 130000], days: [12, 20] },
        { id: "tg", type: "extra", section: "Где будет работать бот", needsBase: true, on: true, title: "Telegram", note: "Входит в стоимость основы", price: [0, 0] },
        { id: "max", type: "extra", section: "Где будет работать бот", needsBase: true, title: "MAX", note: "Дороже из-за регистрации и проверки бота в MAX", price: [15000, 30000], days: [3, 7] },
        { id: "pay", type: "extra", section: "Дополнительно", needsBase: true, title: "Приём оплаты через бота", price: [15000, 30000], days: [3, 7] },
        { id: "crm", type: "extra", section: "Дополнительно", needsBase: true, title: "Заявки из бота в CRM или таблицу", price: [10000, 25000], days: [2, 5] },
        { id: "admin", type: "extra", section: "Дополнительно", needsBase: true, title: "Панель для сотрудников", note: "Просмотр заявок и ответы клиентам", price: [15000, 30000], days: [3, 7] },
        { id: "mail", type: "extra", section: "Дополнительно", needsBase: true, title: "Рассылки и напоминания клиентам", price: [10000, 20000], days: [2, 4] },
        { id: "ai", type: "extra", section: "Дополнительно", needsBase: true, title: "ИИ-ответы по вашей базе знаний", price: [20000, 40000], days: [5, 10] }
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
        { id: "reports", type: "extra", title: "Автоматизация обработки заявок и отчётности", note: "Без дублей и ручного переписывания", price: [20000, 50000], days: [5, 10] },
        { id: "docs", type: "extra", title: "Счета, акты и договоры по шаблону", price: [20000, 40000], days: [4, 8] },
        { id: "phone", type: "extra", title: "Интеграция с телефонией", note: "Звонки и записи в карточке клиента", price: [15000, 35000], days: [3, 7] },
        { id: "notify", type: "extra", title: "Рассылки и напоминания клиентам", note: "Telegram, MAX, почта или SMS", price: [15000, 30000], days: [3, 6] }
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
        { id: "calls", type: "extra", title: "Расшифровка и разбор звонков", price: [15000, 35000], days: [3, 7] },
        { id: "consult", type: "extra", title: "ИИ-консультант на сайте или в боте", price: [40000, 90000], days: [10, 18] },
        { id: "search", type: "extra", title: "Поиск по документам компании", note: "Регламенты, договоры, инструкции", price: [30000, 70000], days: [7, 14] },
        { id: "texts", type: "extra", title: "Генерация описаний и текстов", note: "Товары, посты, рассылки", price: [20000, 40000], days: [5, 10] }
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
        { id: "audit", type: "extra", title: "Аудит и защита сайта", note: "Разовая проверка и исправление уязвимостей", price: [15000, 30000], days: [3, 5] },
        { id: "move", type: "extra", title: "Перенос на новый хостинг", note: "Без простоя и потери данных", price: [10000, 25000], days: [2, 5] },
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
        { id: "seo", type: "extra", includedWith: "site", title: "Базовое SEO и аналитика", price: [10000, 25000], days: [3, 7] },
        { id: "goals", type: "extra", title: "Сквозная аналитика заявок", note: "Видно, с какого канала пришёл клиент", price: [15000, 30000], days: [3, 6] },
        { id: "manage", type: "extra", monthly: true, title: "Ведение и оптимизация рекламы", price: [15000, 15000] }
      ]
    }
  ]
};
