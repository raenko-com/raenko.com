import siteIcon from "./assets/images/site.svg?url";
import botIcon from "./assets/images/bot.svg?url";
import gearIcon from "./assets/images/gear.svg?url";
import businessIcon from "./assets/images/business.svg?url";
import terminalIcon from "./assets/images/terminal.svg?url";
import shareIcon from "./assets/images/share.svg?url";
import background1 from "./assets/images/RaenkoBackground1.png?url";
import background2 from "./assets/images/RaenkoBackground2.png?url";
import background3 from "./assets/images/RaenkoBackground3.png?url";
import background4 from "./assets/images/RaenkoBackground4.png?url";
import background5 from "./assets/images/RaenkoBackground5.png?url";
import background6 from "./assets/images/RaenkoBackground6.png?url";
import alekseyPhoto from "./assets/images/aleksey.png?url";
import egorPhoto from "./assets/images/egor.png?url";
import daniilPhoto from "./assets/images/daniil.png?url";
import emailIcon from "./assets/images/email.svg";
import smallPhoneIcon from "./assets/images/small-phone.svg";
import telegramIcon from "./assets/images/telegram.svg";
import maxIcon from "./assets/images/max.svg";
import feedbackIcon from "./assets/images/feedback.svg";
import discussionIcon from "./assets/images/message.svg";
import prototypeIcon from "./assets/images/pen.svg";
import codingIcon from "./assets/images/code.svg";
import launchIcon from "./assets/images/cloud.svg";


export const data = {
    phoneLink: "+79281788808",
    phone: "+7 (928) 178-88-08",
    email: "info@raenko.com",
    max: "https://max.ru/u/f9LHodD0cOJVyfwOeC8XY_paJkoN12yPvZuUV8yiQBkmuO7Xb2Y3rlfm6Hg",
    maxUsername: "Алексей",
    telegram: "https://t.me/a_raenko",
    telegramUsername: "@a_raenko",
    title: "Сайты, ИИ, боты и автоматизация",
    description: "Решения, которые берут рутинные задачи бизнеса на себя",
    contacts: [
        {
            icon: smallPhoneIcon,
            link: "+79281788808",
            name: "Телефон",
            description: "С 9:00 до 20:00"
        },
        {
            icon: emailIcon,
            link: "mailto:info@raenko.com",
            name: "Email",
            description: "Ответим в течение дня"
        },
        {
            icon: telegramIcon,
            link: "https://t.me/a_raenko",
            name: "Telegram",
            description: "@a_raenko"
        },
        {
            icon: maxIcon,
            link: "https://max.ru/u/f9LHodD0cOJVyfwOeC8XY_paJkoN12yPvZuUV8yiQBkmuO7Xb2Y3rlfm6Hg",
            name: "MAX",
            description: "Алексей"
        },
        {
            icon: feedbackIcon,
            link: "#feedback",
            name: "Обратная связь",
            description: "Мы перезвоним"
        }
    ],
    services: [
        {
            title: "Сайт",
            icon: siteIcon,
            description: "Лендинги, визитки и сайты с каталогом",
            cost: "от 50 000 ₽",
            background: `url('${background1}')`,
            tags: ["Лендинг", "Каталог", "Аналитика"]
        },
        {
            title: "Боты в Telegram и MAX",
            icon: botIcon,
            description: "Принимают заявки, записи и оплату 24/7",
            cost: "от 40 000 ₽",
            background: `url('${background2}')`,
            tags: ["Telegram", "MAX", "Запись"]
        },
        {
            title: "Автоматизация и интеграции",
            icon: gearIcon,
            description: "Заявки сами попадают в Telegram, таблицу или CRM",
            cost: "от 35 000 ₽",
            background: `url('${background3}')`,
            tags: ["amoCRM", "Битрикс24", "1С"]
        },
        {
            title: "ИИ для бизнеса",
            icon: businessIcon,
            description: "Нейросети разбирают заявки и готовят ответы",
            cost: "от 40 000 ₽",
            background: `url('${background4}')`,
            tags: ["Заявки", "Звонки", "КП"]
        },
        {
            title: "Поддержка и безопасность",
            icon: terminalIcon,
            description: "Следим за сайтом и ботами, делаем бэкапы",
            cost: "от 25 000 ₽ / мес",
            background: `url('${background5}')`,
            tags: ["Мониторинг", "Бэкапы", "Доработки"]
        },
        {
            title: "Продвижение",
            icon: shareIcon,
            description: "Директ, Карты, 2ГИС и аналитика заявок",
            cost: "от 10 000 ₽",
            background: `url('${background6}')`,
            tags: ["Директ", "SEO", "Карты"]
        },
    ],
    stages: [
        {
            icon: discussionIcon,
            tag: "30 минут",
            title: "Обсуждаем задачу",
            description: "30-минутный созвон: разбираем задачу, фиксируем объём, цену и сроки."
        },
        {
            icon: prototypeIcon,
            tag: "3 раунда правок",
            title: "Проектируем прототип",
            description: "Разрабатываем смысловую структуру и визуальный макет."
        },
        {
            icon: codingIcon,
            tag: "Тестовый запуск",
            title: "Разрабатываем",
            description: "Вёрстка под все экраны, формы, бот и интеграции с CRM."
        },
        {
            icon: launchIcon,
            title: "Тестируем и запускаем",
            tag: "30 дней поддержки",
            description: "Переносим на ваш домен, подключаем аналитику, составляем документацию."
        }
    ],
    guarantees: ["Официальный договор", "Поэтапная оплата", "30 дней поддержки бесплатно", "Правки до утверждения", "Передача всех файлов", "Адаптивность и чистый код"],
    questions: [
        {
            question: "Сколько стоит разработка и от чего зависит цена?",
            answer: "Цена зависит от задачи (сайт, бот, автоматизация, продвижение, ИИ интеграция) и объёма работ. На сайте указаны цены «от». Точную стоимость называем после обсуждения задачи и фиксируем в договоре вместе с утверждённым объёмом. Пока объём не меняется, цена не меняется."
        },
        {
            question: "Какие сроки и как проходит оплата? ",
            answer: "Срок зависит от задачи и от того, как быстро мы получаем материалы и согласуем этапы. Называем его после обсуждения и прописываем в договоре: дату старта, этапы и что происходит со сроками, если согласование затягивается. Оплата проходит по этапам: 50% перед началом работ и 50% после проверки и согласования результата, до его публикации или окончательной передачи. Для крупных проектов график платежей согласовываем отдельно."
        },
        {
            question: "Что если мне не понравится дизайн или захочется что-то поменять?",
            answer: "Сначала мы показываем макет, и только потом начинаем разработку. В стоимость входят три раунда правок макета. Раунд — это один собранный список ваших замечаний. Разработку начинаем после письменного утверждения макета. Если после утверждения вы захотите изменить согласованное решение, стоимость и сроки оцениваем отдельно. Ошибки и несоответствия утверждённому макету исправляем в рамках согласованных работ."
        },
        {
            question: "Что нужно от меня для старта?",
            answer: "Около 30 минут на созвон: на нём вместе заполним бриф. Понадобятся материалы: логотип, тексты, фото, примеры сайтов, которые вам нравятся. Если чего-то нет, поможем подготовить материалы — состав и стоимость согласуем отдельно."
        },
        {
            question: "Смогу ли я сам менять тексты и картинки на сайте?",
            answer: "Да, если это нужно вам. Скажите об этом на старте: мы заранее согласуем подходящее решение, включим его в смету и покажем, как им пользоваться. Для небольших сайтов самостоятельное редактирование может не понадобиться, и тогда вы не платите за лишнее усложнение."
        },
        {
            question: "Что входит в поддержку после запуска и кто платит за хостинг?",
            answer: "30 дней после запуска мы бесплатно исправляем технические ошибки, возникшие по нашей вине. Новые функции и доработки делаем отдельно, по согласованной смете. Домен и хостинг по возможности оформляем на вас, и вы оплачиваете их напрямую провайдеру. Стоимость зависит от провайдера и тарифа, мы подскажем варианты. Настройку и дальнейшее обслуживание можем взять на себя за отдельную плату."
        },
        {
            question: "Кому принадлежат права на сайт и что будет, если понадобятся доработки через полгода?",
            answer: "После полной оплаты мы передаём вам предусмотренные договором исключительные права на дизайн и код, созданные специально для вашего проекта, а также согласованные исходные материалы и доступы. Сторонние шрифты, библиотеки, модули и изображения используются на условиях их лицензий; о необходимых платных лицензиях сообщаем заранее. Через полгода вы можете обратиться к нам за доработкой или к любому другому специалисту: код и доступы вы получаете."
        }
    ],
    team: [
        {
            name: "Егор Холкин",
            role: "Fullstack-разработчик",
            photo: egorPhoto,
            tags: ["Бэкенд", "ИИ", "Интеграция"]
        },
        {
            name: "Даниил Раенко",
            role: "Fullstack-разработчик",
            photo: daniilPhoto,
            tags: ["Фронтенд", "Дизайн", "Боты"]
        },
        {
            name: "Алексей Раенко",
            role: "Коммерческий руководитель",
            photo: alekseyPhoto,
            tags: ["Коммерция", "Руководство"]
        }
    ]
}