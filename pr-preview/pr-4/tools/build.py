#!/usr/bin/env python3
"""Сборка статических страниц сайта RAENKO (RAE-25).

Общие блоки (шапка, футер, форма, кнопка контактов) живут здесь, страницы
генерируются в корень репозитория: index.html и services/*.html.
Запуск: python3 tools/build.py
"""
import html
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
V = "1"  # версия статики для сброса кэша

PHONE = "+7 928 128-88-08"
PHONE_HREF = "tel:+79281288808"
EMAIL = "info@raenko.com"
TG_HREF = "#"   # TODO: ссылка на Telegram
MAX_HREF = "#"  # TODO: ссылка на MAX

# ---------------------------------------------------------------- иконки
I = {
    "site": '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 9h18M9 9v11"/>',
    "bot": '<path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v7a2.5 2.5 0 0 1-2.5 2.5H11l-4 4v-4A2 2 0 0 1 5 14z"/><path d="M9.5 10h.01M14.5 10h.01"/>',
    "gear": '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    "ai": '<path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M18.5 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
    "shield": '<path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
    "promo": '<path d="M3 11l15-6v14L3 13z"/><path d="M7 13v4a2 2 0 0 0 2 2h1"/><path d="M21 9v6"/>',
    "arrow": '<path d="M5 12h14M13 6l6 6-6 6"/>',
    "chev": '<path d="M6 9l6 6 6-6"/>',
    "plus": '<path d="M12 5v14M5 12h14"/>',
    "check": '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    "phone": '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
    "msg": '<path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.2A8.5 8.5 0 1 1 21 12z"/><path d="M8.5 12h.01M12 12h.01M15.5 12h.01"/>',
    "tg": '<path d="M21.5 4.5L2.8 11.7c-.9.4-.9 1.6.1 1.9l4.6 1.4 1.8 5.5c.3.8 1.3 1 1.9.4l2.6-2.5 4.7 3.5c.7.5 1.7.1 1.9-.7L22.9 5.8c.2-.9-.6-1.6-1.4-1.3z"/><path d="M7.5 15l9.5-7"/>',
    "max": '<path d="M12 3a9 9 0 0 0-7.7 13.7L3 21l4.4-1.2A9 9 0 1 0 12 3z"/><path d="M8.5 15V9.5l3.5 3 3.5-3V15"/>',
    "mail": '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/>',
    "menu": '<path d="M4 7h16M4 12h16M4 17h16"/>',
    "x": '<path d="M6 6l12 12M18 6L6 18"/>',
    "doc": '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 14l2 2 4-4"/>',
    "wallet": '<path d="M4 7a2 2 0 0 1 2-2h12v4"/><path d="M4 7v11a2 2 0 0 0 2 2h14V9H6a2 2 0 0 1-2-2z"/><path d="M16 14.5h.01"/>',
    "life": '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M5.6 5.6l3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6"/>',
    "pen": '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
    "key": '<circle cx="8" cy="15" r="4"/><path d="M10.8 12.2L20 3M16 7l3 3M14 9l2 2"/>',
    "devices": '<rect x="2" y="5" width="14" height="10" rx="2"/><rect x="17" y="9" width="5" height="10" rx="1.5"/><path d="M6 19h6"/>',
    "clock": '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    "ruble": '<path d="M8 20V4h6a4 4 0 0 1 0 8H6M6 16h8"/>',
    "search": '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    "chart": '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    "cart": '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L22 7H6"/>',
    "calendar": '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4M8.5 15l2 2 4-4"/>',
    "card": '<rect x="2" y="5" width="20" height="14" rx="2.5"/><path d="M2 10h20M6 15h4"/>',
    "link": '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    "table": '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 10h18M3 15h18M9 4v16"/>',
    "inbox": '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5h13l3.5 7v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6z"/>',
    "mic": '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    "book": '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>',
    "server": '<rect x="3" y="3" width="18" height="8" rx="2"/><rect x="3" y="13" width="18" height="8" rx="2"/><path d="M7 7h.01M7 17h.01"/>',
    "refresh": '<path d="M20 11a8 8 0 0 0-14.9-3.9L3 9.5M4 13a8 8 0 0 0 14.9 3.9L21 14.5"/><path d="M3 4v5.5h5.5M21 20v-5.5h-5.5"/>',
    "lock": '<rect x="4" y="10" width="16" height="11" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    "map": '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    "target": '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    "users": '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 4 6"/>',
    "zap": '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
}


def ico(name, cls=""):
    return f'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"{f" class={cls!r}" if cls else ""}>{I[name]}</svg>'


def logo_svg():
    # буква R с «тумблером»: буква основным цветом, тумблер акцентом
    return ('<svg viewBox="120 140 840 800" aria-hidden="true">'
            '<path fill="var(--primary)" fill-rule="evenodd" d="M131 155H640C820 155 920 250 920 390C920 490 870 560 782 602L948 924H778L634 642H290V924H131Z M290 284H634C700 284 750 335 750 399C750 463 700 514 634 514H290Z"/>'
            '<path fill="var(--accent)" d="M290 312H630A86.5 86.5 0 0 1 630 485H290Z"/>'
            '<circle cx="630" cy="399" r="58" fill="#fff"/></svg>')


def logo_svg_white():
    return ('<svg viewBox="120 140 840 800" aria-hidden="true">'
            '<path fill="#fff" fill-rule="evenodd" d="M131 155H640C820 155 920 250 920 390C920 490 870 560 782 602L948 924H778L634 642H290V924H131Z M290 284H634C700 284 750 335 750 399C750 463 700 514 634 514H290Z"/>'
            '<path fill="var(--accent)" d="M290 312H630A86.5 86.5 0 0 1 630 485H290Z"/>'
            '<circle cx="630" cy="399" r="58" fill="var(--deep)"/></svg>')


# ---------------------------------------------------------------- данные
SERVICES = [
    dict(slug="site", icon="site", title="Сайты", full="Сайт", short="Лендинги, визитки и сайты с каталогом", price="от 50 000 ₽", days="от 7 рабочих дней",
         tags=["Лендинг", "Каталог", "SEO", "Аналитика"]),
    dict(slug="bots", icon="bot", title="Боты в Telegram и MAX", full="Боты в Telegram и MAX", short="Принимают заявки, записи и оплату 24/7", price="от 40 000 ₽", days="от 7 рабочих дней",
         tags=["Запись", "Оплата", "Напоминания"]),
    dict(slug="automation", icon="gear", title="Автоматизация", full="Автоматизация и интеграции", short="Заявки сами попадают в Telegram, таблицу или CRM", price="от 35 000 ₽", days="от 7 рабочих дней",
         tags=["amoCRM", "Битрикс24", "1С"]),
    dict(slug="ai", icon="ai", title="ИИ для бизнеса", full="ИИ для бизнеса", short="Нейросети разбирают заявки и готовят ответы", price="от 40 000 ₽", days="от 14 рабочих дней",
         tags=["Заявки", "КП", "Звонки"]),
    dict(slug="support", icon="shield", title="Поддержка", full="Поддержка и безопасность", short="Следим за сайтом и ботами, делаем бэкапы", price="от 25 000 ₽", price_note="/мес", days="ежемесячно",
         tags=["Мониторинг", "Бэкапы", "Доработки"]),
    dict(slug="promo", icon="promo", title="Продвижение", full="Продвижение", short="Директ, Карты, 2ГИС и аналитика заявок", price="от 10 000 ₽", days="от 2 рабочих дней",
         tags=["Директ", "Карты", "2ГИС"]),
]
SVC = {s["slug"]: s for s in SERVICES}

FAQ = [
    ("Сколько стоит разработка и от чего зависит цена?",
     ["Цена зависит от задачи (сайт, бот, автоматизация, продвижение, ИИ-интеграция) и объёма работ. На сайте указаны цены «от».",
      "Точную стоимость называем после обсуждения задачи и фиксируем в договоре вместе с утверждённым объёмом. Пока объём не меняется, цена не меняется."]),
    ("Какие сроки и как проходит оплата?",
     ["Срок зависит от задачи и от того, как быстро мы получаем материалы и согласуем этапы. Называем его после обсуждения и прописываем в договоре: дату старта, этапы и что происходит со сроками, если согласование затягивается.",
      "Оплата по этапам: 50% перед началом работ и 50% после проверки и согласования результата, до публикации или окончательной передачи. Для крупных проектов график платежей согласовываем отдельно."]),
    ("Что нужно от меня для старта?",
     ["Около 30 минут на созвон: на нём вместе заполним бриф. Понадобятся материалы: логотип, тексты, фото, примеры сайтов, которые вам нравятся.",
      "Если чего-то нет, поможем подготовить материалы. Состав и стоимость согласуем отдельно."]),
    ("Что если мне не понравится дизайн или захочется что-то поменять?",
     ["Сначала мы показываем макет, и только потом начинаем разработку. В стоимость входят три раунда правок макета. Раунд — это один собранный список ваших замечаний.",
      "Разработку начинаем после письменного утверждения макета. Если после утверждения вы захотите изменить согласованное решение, стоимость и сроки оцениваем отдельно. Ошибки и несоответствия утверждённому макету исправляем в рамках согласованных работ."]),
    ("Смогу ли я сам менять тексты и картинки на сайте?",
     ["Да, если это нужно вам. Скажите об этом на старте: мы заранее согласуем подходящее решение, включим его в смету и покажем, как им пользоваться.",
      "Для небольших сайтов самостоятельное редактирование может не понадобиться, и тогда вы не платите за лишнее усложнение."]),
    ("Что входит в поддержку после запуска и кто платит за хостинг?",
     ["30 дней после запуска мы бесплатно исправляем технические ошибки, возникшие по нашей вине. Новые функции и доработки делаем отдельно, по согласованной смете.",
      "Домен и хостинг по возможности оформляем на вас, и вы оплачиваете их напрямую провайдеру. Стоимость зависит от провайдера и тарифа, мы подскажем варианты. Настройку и дальнейшее обслуживание можем взять на себя за отдельную плату."]),
    ("Кому принадлежат права на сайт и что будет, если понадобятся доработки через полгода?",
     ["После полной оплаты мы передаём вам предусмотренные договором исключительные права на дизайн и код, созданные специально для вашего проекта, а также согласованные исходные материалы и доступы.",
      "Сторонние шрифты, библиотеки, модули и изображения используются на условиях их лицензий, о необходимых платных лицензиях сообщаем заранее. Через полгода вы можете обратиться к нам или к любому другому специалисту: код и доступы у вас."]),
]

STEPS = [
    ("Обсуждаем задачу", "30-минутный созвон: разбираем задачу, фиксируем объём, цену и сроки в договоре.", "30 минут"),
    ("Проектируем и показываем макет", "Структура и дизайн до утверждения. Три раунда правок включены.", "3 раунда правок"),
    ("Разрабатываем", "Вёрстка под все экраны, формы, бот и интеграции с CRM.", "Тестовый адрес"),
    ("Запускаем и обучаем", "Переносим на ваш домен, подключаем аналитику, записываем видеоинструкцию.", "30 дней поддержки"),
]

# ---------------------------------------------------------------- общие блоки
def rel(depth):
    return "../" * depth


def head(title, desc, depth, extra_css=()):
    r = rel(depth)
    css = "".join(f'\n<link rel="stylesheet" href="{r}assets/css/{c}?v={V}">' for c in extra_css)
    return f'''<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(desc)}">
<meta name="theme-color" content="#5B4CFF">
<link rel="icon" href="{r}assets/img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{r}assets/css/site.css?v={V}">{css}
</head>
<body data-theme="indigo">
<a class="sr-only" href="#main">К содержанию</a>
'''


def header(depth, current=None):
    r = rel(depth)
    home = f"{r}index.html"
    drop = "".join(
        f'<a href="{r}services/{s["slug"]}.html"{" aria-current=page" if current == s["slug"] else ""}><span class="ico">{ico(s["icon"])}</span><span><b>{s["full"]}</b><small>{s["price"]}{s.get("price_note", "")}</small></span></a>'
        for s in SERVICES)
    mlist = "".join(f'<a href="{r}services/{s["slug"]}.html"><span class="ico">{ico(s["icon"])}</span>{s["full"]}</a>' for s in SERVICES)
    themes = "".join(f'<button type="button" data-set-theme="{t}" aria-pressed="false"><i style="background:linear-gradient(135deg,{a} 50%,{b} 50%)"></i>{n}</button>'
                     for t, a, b, n in THEMES)
    return f'''<header class="header">
  <div class="container header-in">
    <a class="logo" href="{home}" aria-label="RAENKO, на главную">{logo_svg()}RAENKO</a>
    <nav class="nav" aria-label="Основное меню">
      <div class="nav-drop">
        <button type="button" aria-expanded="false" aria-haspopup="true">Услуги {ico("chev")}</button>
        <div class="drop">{drop}</div>
      </div>
      <a href="{home}#examples">Примеры</a>
      <a href="{home}#team">Команда</a>
      <a href="{home}#process">Процесс</a>
      <a href="{home}#faq">Вопросы</a>
      <a href="{home}#contact">Контакты</a>
    </nav>
    <div class="header-act">
      <a class="icon-btn hide-m" href="{TG_HREF}" aria-label="Telegram">{ico("tg")}</a>
      <a class="icon-btn hide-m" href="{MAX_HREF}" aria-label="MAX">{ico("max")}</a>
      <a class="phone" href="{PHONE_HREF}">{PHONE}</a>
      <a class="btn btn-primary btn-sm" href="{home}#calculator">Рассчитать</a>
      <button class="icon-btn burger" type="button" data-menu-open aria-controls="mnav" aria-expanded="false" aria-label="Открыть меню">{ico("menu")}</button>
    </div>
  </div>
</header>
<div class="mnav" id="mnav" aria-hidden="true">
  <div class="mnav-top">
    <a class="logo" href="{home}">{logo_svg()}RAENKO</a>
    <button class="icon-btn" type="button" data-menu-close aria-label="Закрыть меню">{ico("x")}</button>
  </div>
  <p class="mnav-h">Услуги</p>
  <nav class="mnav-list">{mlist}</nav>
  <p class="mnav-h">Разделы</p>
  <nav class="mnav-list">
    <a href="{home}#examples">Примеры решений</a><a href="{home}#team">Команда</a><a href="{home}#process">Как мы работаем</a><a href="{home}#faq">Частые вопросы</a><a href="{home}#calculator">Калькулятор</a>
  </nav>
  <div class="mnav-themes"><span>Схема:</span>{themes}</div>
  <div class="mnav-foot">
    <a class="btn btn-primary" href="{PHONE_HREF}">{ico("phone")}{PHONE}</a>
    <a class="btn btn-ghost" href="{TG_HREF}">{ico("tg")}Написать в Telegram</a>
  </div>
</div>
'''


THEMES = [("indigo", "#5B4CFF", "#C6F432", "Индиго"), ("ultra", "#2340FF", "#FFC83D", "Ультрамарин"), ("raspberry", "#D61F5E", "#2DD4BF", "Малина")]


def lead_form(title="Обсудим вашу задачу", sub="Оставьте контакты, ответим в течение часа с 9:00 до 20:00.", msg_placeholder="Расскажите о задаче: что нужно сделать и к какому сроку"):
    return f'''<form class="form" id="lead-form" data-lead novalidate>
  <h3>{title}</h3>
  <p class="muted">{sub}</p>
  <div class="f-row">
    <label class="field"><span>Имя</span><input name="name" autocomplete="name" placeholder="Как к вам обращаться" required></label>
    <label class="field"><span>Телефон</span><input name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="+7 900 000-00-00" required></label>
  </div>
  <label class="field"><span>Telegram или MAX <small>(необязательно)</small></span><input name="tg" placeholder="@username"></label>
  <label class="field"><span>Задача</span><textarea name="msg" placeholder="{msg_placeholder}"></textarea></label>
  <label class="check"><input type="checkbox" required checked> <span>Согласен на <a href="#">обработку персональных данных</a></span></label>
  <button class="btn btn-primary btn-block" type="submit">Отправить заявку {ico("arrow")}</button>
  <div class="f-ok" role="status">{ico("check")} Спасибо! Это превью, заявка никуда не ушла. На сайте здесь будет отправка в Telegram и CRM.</div>
  <p class="f-fine">Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности</p>
</form>'''


def contact_section(depth, with_calc=False, title="Связаться с нами", lead="Расскажите о задаче, подскажем подходящее решение и назовём цену.", form_title="Обсудим вашу задачу"):
    calc = ""
    if with_calc:
        calc = f'''
    <div class="calc-wrap reveal" id="calculator">
      <div class="section-head section-head--left"><span class="eyebrow">{ico("ruble")} Калькулятор</span><h2 class="h2">Сколько стоит ваш проект</h2><p class="lead">Отметьте, что нужно, и сразу увидите ориентир по цене и срокам. Расчёт подставится в заявку.</p></div>
      {CALC_HTML}
    </div>'''
    return f'''<section class="section section--soft" id="contact">
  <div class="container">
    <div class="section-head reveal"><span class="eyebrow">{ico("msg")} Контакты</span><h2 class="h2">{title}</h2><p class="lead">{lead}</p></div>{calc}
    <div class="contact reveal" style="{'margin-top:56px' if with_calc else ''}">
      <div class="c-info">
        <h2>Ответим в течение часа</h2>
        <p class="lead">Пишите, как вам удобнее. Обсудим задачу и предложим решение без лишних обязательств.</p>
        <div class="c-links">
          <a class="c-link" href="{PHONE_HREF}"><span class="ico">{ico("phone")}</span><span>{PHONE}<small>Позвонить</small></span></a>
          <a class="c-link" href="{TG_HREF}"><span class="ico">{ico("tg")}</span><span>Telegram<small>Быстрее всего</small></span></a>
          <a class="c-link" href="{MAX_HREF}"><span class="ico">{ico("max")}</span><span>MAX<small>Мессенджер</small></span></a>
          <a class="c-link" href="mailto:{EMAIL}"><span class="ico">{ico("mail")}</span><span>{EMAIL}<small>Почта</small></span></a>
        </div>
        <p class="c-hours">На связи с 9:00 до 20:00 каждый день</p>
      </div>
      {lead_form(form_title)}
    </div>
  </div>
</section>'''


def footer(depth):
    r = rel(depth)
    home = f"{r}index.html"
    svc = "".join(f'<li><a href="{r}services/{s["slug"]}.html">{s["full"]}</a></li>' for s in SERVICES)
    return f'''<footer class="footer">
  <div class="container">
    <div class="footer-in">
      <div>
        <a class="logo" href="{home}">{logo_svg_white()}RAENKO</a>
        <p>Сайты, боты, автоматизация и ИИ для бизнеса. Работаем по договору с фиксированной ценой.</p>
        <div class="f-soc"><a href="{TG_HREF}" aria-label="Telegram">{ico("tg")}</a><a href="{MAX_HREF}" aria-label="MAX">{ico("max")}</a><a href="mailto:{EMAIL}" aria-label="Почта">{ico("mail")}</a></div>
      </div>
      <div><h4>Услуги</h4><ul>{svc}</ul></div>
      <div><h4>Компания</h4><ul><li><a href="{home}#examples">Примеры решений</a></li><li><a href="{home}#team">Команда</a></li><li><a href="{home}#process">Как мы работаем</a></li><li><a href="{home}#faq">Вопросы</a></li><li><a href="{home}#calculator">Калькулятор</a></li></ul></div>
      <div><h4>Контакты</h4><ul><li><a href="{PHONE_HREF}">{PHONE}</a></li><li><a href="mailto:{EMAIL}">{EMAIL}</a></li><li><a href="#">Политика обработки персональных данных</a></li><li><a href="#">Политика конфиденциальности</a></li></ul></div>
    </div>
    <div class="footer-bot"><span>© 2026 RAENKO. ИП Раенко А.</span><span>raenko.com</span></div>
  </div>
</footer>
<div class="fab">
  <div class="fab-menu" id="fab-menu">
    <a href="{PHONE_HREF}"><span class="ico">{ico("phone")}</span><span>Позвонить<small>{PHONE}</small></span></a>
    <a href="{TG_HREF}"><span class="ico">{ico("tg")}</span><span>Telegram<small>Ответим быстрее всего</small></span></a>
    <a href="{MAX_HREF}"><span class="ico">{ico("max")}</span><span>MAX<small>Мессенджер</small></span></a>
    <a href="#lead-form"><span class="ico">{ico("mail")}</span><span>Оставить заявку<small>Перезвоним сами</small></span></a>
  </div>
  <span class="fab-tip">Есть вопрос? Напишите нам</span>
  <button class="fab-main" type="button" aria-expanded="false" aria-controls="fab-menu" aria-label="Связаться с нами">{ico("phone", "f-i1")}{ico("msg", "f-i2")}{ico("x", "f-x")}<span class="fab-dot"></span></button>
</div>
<div class="themes" role="group" aria-label="Цветовая схема (превью)"><span>Схема</span>{"".join(f'<button type="button" data-set-theme="{t}" aria-pressed="false" title="{n}"><i style="background:linear-gradient(135deg,{a} 50%,{b} 50%)"></i></button>' for t, a, b, n in THEMES)}</div>
'''


def scripts(depth, extra=()):
    r = rel(depth)
    return "".join(f'\n<script src="{r}assets/js/{s}?v={V}"></script>' for s in list(extra) + ["site.js"]) + "\n</body>\n</html>\n"


def steps_section(dark=True):
    items = "".join(f'''<div class="step reveal"><div class="step-n">{i + 1:02d}</div><h3>{t}</h3><p>{d}</p><span class="step-chip">{c}</span></div>'''
                    for i, (t, d, c) in enumerate(STEPS))
    return f'''<section class="section section--deep" id="process">
  <div class="container">
    <div class="section-head reveal"><span class="eyebrow">{ico("clock")} Процесс</span><h2 class="h2">Как мы работаем</h2><p class="lead">От брифа до запуска, строго по договору</p></div>
    <div class="steps">{items}</div>
  </div>
</section>'''


def rx_examples(tabs):
    """Блок интерактивных примеров RAE-21 (вкладки фильтруются через data-tabs)."""
    return RX_HTML.replace('<section class="rx" id="examples"', f'<section class="rx" data-tabs="{tabs}"', 1)


# ---------------------------------------------------------------- исходники компонентов
SRC = (ROOT / "tools" / "examples-src.html").read_text(encoding="utf-8")
RX_HTML = re.search(r'(<section class="rx".*?</section>)', SRC, re.S).group(1)
CALC_SRC = (ROOT / "tools" / "calculator-src.html").read_text(encoding="utf-8")
CALC_HTML = re.search(r'(<section class="rc".*?</section>)', CALC_SRC, re.S).group(1).replace('id="calculator"', 'id="calc"', 1)


# ---------------------------------------------------------------- главная
def page_index():
    d = 0
    cards = []
    for i, s in enumerate(SERVICES):
        hl = " svc--hl" if s["slug"] == "bots" else ""
        tags = "".join(f"<span>{t}</span>" for t in s["tags"])
        cards.append(f'''<a class="svc{hl} reveal" href="services/{s["slug"]}.html">
  <span class="ico">{ico(s["icon"])}</span>
  <h3>{s["full"]}</h3>
  <p>{s["short"]}</p>
  <div class="svc-tags">{tags}</div>
  <div class="svc-foot"><span class="price">{s["price"]}<small>{s.get("price_note", "")}</small></span><span class="arrow">{ico("arrow")}</span></div>
</a>''')
    faq = "".join(f'''<details class="reveal"><summary>{q}<span class="pm">{ico("plus")}</span></summary><div class="ans">{"".join(f"<p>{p}</p>" for p in a)}</div></details>''' for q, a in FAQ)

    body = f'''{head("RAENKO — сайты, боты, автоматизация и ИИ для бизнеса", "Разрабатываем сайты, ботов в Telegram и MAX, автоматизацию и ИИ для бизнеса. Фиксированная цена и сроки по договору.", d, ["calc.css", "examples.css"])}{header(d)}
<main id="main">
<section class="hero">
  <div class="container hero-in">
    <div>
      <span class="eyebrow reveal">{ico("zap")} Сайты · Боты · ИИ</span>
      <h1 class="reveal">Сайты, ИИ, боты и <span class="grad">автоматизация</span></h1>
      <p class="lead reveal">Решения, которые берут рутинные задачи бизнеса на себя: заявки, запись, ответы клиентам и отчёты.</p>
      <div class="hero-cta reveal">
        <a class="btn btn-primary" href="#calculator">Рассчитать стоимость {ico("arrow")}</a>
        <a class="btn btn-ghost" href="#examples">Смотреть примеры</a>
      </div>
      <ul class="trust reveal">
        <li>{ico("check")}Фиксированная цена в договоре</li>
        <li>{ico("check")}Оплата 50/50</li>
        <li>{ico("check")}30 дней поддержки</li>
      </ul>
    </div>
    <div class="scene" aria-hidden="true">
      <div class="scene-orbit"></div>
      <div class="scard s-site">
        <div class="s-bar"><i></i><i></i><i></i></div>
        <div class="s-line w60"></div><div class="s-hero"></div><div class="s-line w80"></div><div class="s-line w40"></div>
        <span class="s-btn">Записаться</span>
      </div>
      <div class="scard s-tg">
        <div class="s-tg-h"><span class="s-ava">{ico("bot")}</span><div><b>Бот заявок</b><small>только что</small></div></div>
        <div class="s-msg"><span class="s-new">Новая заявка</span><br>Анна · стрижка, суббота 13:30</div>
        <div class="s-btns"><span>Принять</span><span>Позвонить</span></div>
      </div>
      <div class="scard s-crm">
        <b style="margin-bottom:6px">CRM · Заявки</b>
        <div class="s-row"><span>Анна, стрижка</span><span class="st st-new">Новая</span></div>
        <div class="s-row"><span>ООО «Вектор», сайт</span><span class="st st-work">В работе</span></div>
        <div class="s-row"><span>Игорь, доставка</span><span class="st st-done">Оплачено</span></div>
      </div>
      <div class="scard s-ai"><span class="ico">{ico("ai")}</span><b>ИИ ответил клиенту</b></div>
    </div>
  </div>
</section>

<section class="section" id="services">
  <div class="container">
    <div class="section-head reveal"><span class="eyebrow">{ico("ruble")} Услуги</span><h2 class="h2">Услуги и стоимость</h2><p class="lead">Фиксированная цена и сроки по договору. Нажмите на услугу, чтобы посмотреть подробности и живые примеры.</p></div>
    <div class="svc-grid">{"".join(cards)}</div>
    <p class="svc-note reveal">Не знаете, что выбрать? <a href="#calculator">Посчитайте в калькуляторе</a> или <a href="#contact">напишите нам</a></p>
  </div>
</section>

<section class="section section--soft" id="examples">
  <div class="container">
    <div class="section-head reveal"><span class="eyebrow">{ico("zap")} Живые демо</span><h2 class="h2">Примеры решений</h2><p class="lead">Нажимайте и пробуйте. Клиенты и данные придуманы, ничего никуда не отправляется.</p></div>
    <div class="demo-wrap reveal">{rx_examples("flow,book,calc,ba")}</div>
  </div>
</section>

<section class="section" id="team">
  <div class="container">
    <div class="section-head reveal"><span class="eyebrow">{ico("users")} Команда</span><h2 class="h2">Наша команда</h2><p class="lead">Разработка, дизайн и управление проектом в одних руках</p></div>
    <div class="team">
      <article class="person reveal"><div class="person-ph"><img src="assets/img/team-alexey.jpg" alt="Алексей Раенко" loading="lazy" width="600" height="600"></div><div class="person-body"><h3>Алексей Раенко</h3><p>Коммерческий руководитель</p><div class="person-tags"><span>Договор</span><span>Смета</span><span>Сроки</span></div></div></article>
      <article class="person reveal"><div class="person-ph"><img src="assets/img/team-egor.jpg" alt="Егор Холкин" loading="lazy" width="600" height="600"></div><div class="person-body"><h3>Егор Холкин</h3><p>Fullstack-разработчик</p><div class="person-tags"><span>Бэкенд</span><span>ИИ</span><span>Интеграции</span></div></div></article>
      <article class="person reveal"><div class="person-ph person-ph--empty"><span>ДР</span><small>фото скоро</small></div><div class="person-body"><h3>Даниил Раенко</h3><p>Fullstack-разработчик</p><div class="person-tags"><span>Фронтенд</span><span>Дизайн</span><span>Боты</span></div></div></article>
    </div>
  </div>
</section>

{steps_section()}

<section class="section" id="guarantees">
  <div class="container">
    <div class="section-head reveal"><span class="eyebrow">{ico("shield")} Гарантии</span><h2 class="h2">Гарантии, которые мы даём</h2><p class="lead">Прозрачные условия на каждом этапе</p></div>
    <div class="gar">
      <div class="g g--a reveal"><span class="ico">{ico("doc")}</span><h3>Официальный договор</h3><p>Работаем с физлицами и компаниями. Объём, цена и сроки фиксируются в договоре, без скрытых платежей.</p><div class="g-doc"><span>{ico("check")} Физлица</span><span>{ico("check")} Юрлица и ИП</span></div></div>
      <div class="g g--b reveal"><span class="ico">{ico("wallet")}</span><h3>Поэтапная оплата</h3><p>Вы не рискуете всей суммой на старте.</p><div class="g-pay"><div><b>50%</b><small>перед началом работ</small></div><div><b>50%</b><small>после согласования результата</small></div></div></div>
      <div class="g g--c reveal"><div class="g-big">30 <small>дней</small></div><h3>Поддержки бесплатно</h3><p>Исправляем технические ошибки по нашей вине и помогаем освоиться.</p></div>
      <div class="g g--d reveal"><span class="ico">{ico("pen")}</span><h3>3 раунда правок макета</h3><p>Код пишем только после того, как вы утвердите дизайн.</p></div>
      <div class="g g--e reveal"><span class="ico">{ico("key")}</span><h3>Всё остаётся у вас</h3><p>Код, домен, доступы и исходники передаём после оплаты.</p></div>
      <div class="g g--f reveal"><div class="g-txt"><span class="ico" style="margin-bottom:12px">{ico("devices")}</span><h3>Работает на любых устройствах</h3><p>Проверяем в актуальных браузерах, на телефонах и планшетах. Быстрая загрузка и чистый код.</p></div><div class="g-dev" aria-hidden="true"><i></i><i></i><i></i></div></div>
    </div>
  </div>
</section>

<section class="section section--soft" id="faq">
  <div class="container">
    <div class="section-head reveal"><span class="eyebrow">{ico("msg")} Вопросы</span><h2 class="h2">Частые вопросы</h2><p class="lead">Ответы на вопросы о работе над проектом</p></div>
    <div class="faq">{faq}</div>
  </div>
</section>

{contact_section(d, with_calc=True).replace('section--soft" id="contact"', '" id="contact"')}
</main>
{footer(d)}{scripts(d, ["examples.js", "prices.js", "calc.js"])}'''
    (ROOT / "index.html").write_text(body, encoding="utf-8")


# ---------------------------------------------------------------- страницы услуг
PAGES = {
    "site": dict(
        h1="Сайт, который <span class=\"mark\">приводит клиентов</span>",
        lead="Лендинги, сайты-визитки и сайты с каталогом. Адаптивная вёрстка, базовое SEO и аналитика уже в цене, заявки сразу приходят вам в Telegram.",
        facts=[("ruble", "Стоимость", "от 50 000 ₽"), ("clock", "Срок", "от 7 рабочих дней"), ("devices", "Под любые экраны", "ПК, планшет, телефон")],
        feat=[("devices", "Адаптивная вёрстка", "Сайт одинаково удобен на телефоне, планшете и компьютере."),
              ("search", "Базовое SEO", "Структура, мета-теги и скорость, чтобы сайт находили в Яндексе и Google."),
              ("chart", "Аналитика", "Подключаем Яндекс Метрику и цели: видно, откуда приходят заявки."),
              ("tg", "Заявки в Telegram", "Каждая заявка с сайта сразу приходит вам в мессенджер."),
              ("pen", "Панель управления", "По желанию: сами меняете тексты и фото без программиста."),
              ("lock", "Скорость и защита", "HTTPS, защита форм от спама и быстрая загрузка.")],
        demos=[("rx", "ba,calc", "Как меняется сайт и что умеет калькулятор", "Сравните устаревший и современный сайт, а потом посчитайте смету, как это сделает ваш клиент.")],
        cases=["Лендинг для услуги", "Сайт-визитка", "Каталог товаров", "Корпоративный сайт", "Онлайн-запись", "Калькулятор на сайте", "Квиз для заявок"],
        plans=[("Лендинг или визитка", "Одна-две страницы под услугу или компанию. SEO и аналитика включены.", "50 000 – 80 000 ₽", "7–14 рабочих дней", True),
               ("Сайт с каталогом", "Каталог услуг или товаров с фильтрами и карточками.", "80 000 – 160 000 ₽", "14–25 рабочих дней", False),
               ("Панель управления", "Дополнительно к сайту: сами меняете тексты и фото.", "+20 000 – 40 000 ₽", "+5–10 рабочих дней", False)],
        related=["bots", "automation", "promo"]),
    "bots": dict(
        h1="Бот, который <span class=\"mark\">работает 24/7</span>",
        lead="Боты в Telegram и MAX принимают заявки и записи, отвечают на частые вопросы, принимают оплату и сами напоминают клиентам о визите.",
        facts=[("ruble", "Стоимость", "от 40 000 ₽"), ("clock", "Срок", "от 7 рабочих дней"), ("bot", "Платформы", "Telegram и MAX")],
        feat=[("msg", "Ответы на вопросы", "Цены, адрес, график: бот отвечает мгновенно и в любое время."),
              ("calendar", "Запись и заказы", "Клиент сам выбирает услугу и свободное время, без звонков."),
              ("card", "Приём оплаты", "Оплата картой или по СБП прямо в чате."),
              ("clock", "Напоминания", "Бот напоминает о записи и снижает число неявок."),
              ("users", "Передача человеку", "Сложный вопрос бот передаёт администратору с историей диалога."),
              ("table", "Заявки в CRM", "Все обращения сохраняются в таблице или CRM.")],
        demos=[("bot-faq", "", "Поговорите с ботом", "Задайте вопрос кнопками или запишитесь на свободное время."),
               ("rx", "book", "Онлайн-запись с напоминанием", "Выберите услугу, день и время. Бот пришлёт подтверждение и напоминание.")],
        cases=["Салон красоты", "Клиника", "Автосервис", "Доставка", "Курсы и школы", "Аренда", "Служба поддержки"],
        plans=[("Бот для вопросов и заявок", "Отвечает на частые вопросы и собирает заявки.", "40 000 – 80 000 ₽", "7–12 рабочих дней", True),
               ("Запись или заказ через бота", "Выбор услуги и времени, напоминания клиенту.", "55 000 – 100 000 ₽", "10–15 рабочих дней", False),
               ("Приём оплаты", "Дополнительно: оплата прямо в боте.", "+15 000 – 30 000 ₽", "+3–7 рабочих дней", False)],
        related=["site", "automation", "ai"]),
    "automation": dict(
        h1="Заявки, которые <span class=\"mark\">не теряются</span>",
        lead="Связываем сайт, мессенджеры, таблицы и CRM. Заявки приходят сами, без дублей и ручного переписывания, а отчёты собираются автоматически.",
        facts=[("ruble", "Стоимость", "от 35 000 ₽"), ("clock", "Срок", "от 7 рабочих дней"), ("link", "Интеграции", "amoCRM, Битрикс24, 1С")],
        feat=[("inbox", "Заявки в одном месте", "Сайт, бот, почта и мессенджеры сводятся в одну ленту."),
              ("tg", "Уведомления в Telegram", "Новая заявка сразу у ответственного с кнопками действий."),
              ("link", "CRM и учёт", "Интеграция с amoCRM, Битрикс24 и 1С без ручного ввода."),
              ("table", "Таблицы и отчёты", "Отчёты по заявкам и продажам приходят сами по расписанию."),
              ("refresh", "Без дублей", "Повторные обращения склеиваются, ничего не пропадает."),
              ("zap", "Сценарии", "Статусы, задачи и напоминания меняются автоматически.")],
        demos=[("rx", "flow,calc", "Посмотрите, как заявка доходит до владельца", "Оставьте заявку на сайте, примите её в Telegram и поменяйте статус в CRM. Во второй вкладке посчитайте экономию времени.")],
        cases=["Заявки с сайта в Telegram", "Сайт → CRM", "Отчёты руководителю", "Склад и 1С", "Счета и документы", "Рассылки клиентам"],
        plans=[("Заявки в Telegram или таблицу", "Передача заявок с сайта и уведомления ответственным.", "35 000 – 60 000 ₽", "7–10 рабочих дней", True),
               ("Интеграция с CRM", "amoCRM, Битрикс24 или 1С.", "+15 000 – 40 000 ₽", "+3–7 рабочих дней", False),
               ("Обработка и отчёты", "Автоматическая обработка заявок и отчётность.", "+20 000 – 50 000 ₽", "+5–10 рабочих дней", False)],
        related=["bots", "ai", "site"]),
    "ai": dict(
        h1="ИИ, который <span class=\"mark\">снимает рутину</span>",
        lead="Подключаем нейросети к рабочим процессам: ИИ разбирает входящие заявки и письма, готовит черновики ответов и КП, расшифровывает звонки. Решение всегда за человеком.",
        facts=[("ruble", "Стоимость", "от 40 000 ₽"), ("clock", "Срок", "от 14 рабочих дней"), ("users", "Контроль", "Финальное решение за человеком")],
        feat=[("inbox", "Разбор входящих", "ИИ определяет тип обращения, срочность и ответственного."),
              ("pen", "Черновики ответов", "Готовит ответ и КП по вашей базе знаний, вы только проверяете."),
              ("mic", "Расшифровка звонков", "Текст разговора и краткое резюме сразу в CRM."),
              ("book", "База знаний", "Сотрудники получают ответы по регламентам компании за секунды."),
              ("lock", "Данные под контролем", "Настраиваем доступы и не передаём лишнего."),
              ("chart", "Измеримый эффект", "Считаем, сколько часов в месяц экономит автоматизация.")],
        demos=[("ai", "", "ИИ разбирает входящие", "Выберите письмо: ИИ определит тип и срочность, вытащит данные и подготовит ответ.")],
        cases=["Разбор заявок", "Ответы клиентам", "Коммерческие предложения", "Расшифровка звонков", "Поиск по документам", "Контроль качества"],
        plans=[("Разбор заявок и писем", "Классификация, срочность и маршрутизация обращений.", "40 000 – 80 000 ₽", "14–20 рабочих дней", True),
               ("Черновики ответов и КП", "Дополнительно: по вашей базе знаний.", "+10 000 – 30 000 ₽", "+3–7 рабочих дней", False),
               ("Расшифровка звонков", "Дополнительно: текст и резюме разговора.", "+15 000 – 35 000 ₽", "+3–7 рабочих дней", False)],
        related=["automation", "bots", "support"]),
    "support": dict(
        h1="Сайт и боты <span class=\"mark\">под присмотром</span>",
        lead="Следим за работой сайта и ботов, делаем резервные копии и обновления. Исправляем ошибки, в том числе после других разработчиков, и дорабатываем функционал.",
        facts=[("ruble", "Стоимость", "от 25 000 ₽/мес"), ("shield", "Мониторинг", "Круглосуточно"), ("refresh", "Бэкапы", "Ежедневно")],
        feat=[("server", "Мониторинг 24/7", "Узнаём о сбое раньше вас и сразу начинаем чинить."),
              ("refresh", "Резервные копии", "Ежедневные бэкапы: всё можно восстановить за минуты."),
              ("lock", "Безопасность", "Обновления, защита от взлома и спама."),
              ("zap", "Исправление ошибок", "Чиним баги, в том числе в проектах других разработчиков."),
              ("pen", "Доработки", "Новые функции по согласованной смете."),
              ("chart", "Отчёт каждый месяц", "Что сделали, сколько был доступен сайт, что улучшить.")],
        demos=[("support", "", "Что происходит при сбое", "Нажмите «Смоделировать сбой» и посмотрите, как мы реагируем и сообщаем о нём.")],
        cases=["Сайт после другой студии", "Интернет-магазин", "Боты и интеграции", "Перенос на новый хостинг", "Обновление CMS"],
        plans=[("Поддержка", "Мониторинг, резервные копии, обновления и исправление ошибок.", "25 000 ₽ в месяц", "Ежемесячно", True),
               ("Доработка функционала", "Новые функции и изменения по смете.", "по договорённости", "Оценим после обсуждения", False)],
        related=["site", "automation", "promo"]),
    "promo": dict(
        h1="Заявки из <span class=\"mark\">Яндекса и карт</span>",
        lead="Настраиваем рекламу в Яндекс Директе, карточки на Яндекс Картах и 2ГИС, базовое SEO и аналитику, чтобы было видно, откуда приходят заявки.",
        facts=[("ruble", "Стоимость", "от 10 000 ₽"), ("clock", "Срок", "от 2 рабочих дней"), ("wallet", "Бюджет на рекламу", "Оплачивается отдельно")],
        feat=[("target", "Яндекс Директ", "Поиск и РСЯ: настраиваем кампании под ваших клиентов."),
              ("map", "Яндекс Карты и 2ГИС", "Заполненные карточки с фото, ценами и отзывами."),
              ("search", "Базовое SEO", "Чтобы сайт находили по важным запросам."),
              ("chart", "Аналитика заявок", "Видно, какой канал приносит заявки и сколько стоит каждая."),
              ("refresh", "Оптимизация", "Отключаем то, что не работает, и усиливаем то, что работает."),
              ("doc", "Понятные отчёты", "Без лишних терминов: заявки, цена заявки, что дальше.")],
        demos=[("promo", "", "Откуда приходят заявки", "Включайте и выключайте каналы: увидите, сколько заявок даёт каждый и сколько стоит одна заявка.")],
        cases=["Запуск рекламы с нуля", "Аудит текущей рекламы", "Карточки на картах", "Локальный бизнес", "Сайт без заявок"],
        plans=[("Яндекс Директ", "Настройка кампаний. Рекламный бюджет отдельно.", "10 000 – 25 000 ₽", "2–4 рабочих дня", True),
               ("Яндекс Карты и 2ГИС", "Оформление и наполнение карточек.", "5 000 – 15 000 ₽", "2–5 рабочих дней", False),
               ("Базовое SEO и аналитика", "Если сайт делали не мы. Для наших сайтов уже включено.", "10 000 – 25 000 ₽", "3–7 рабочих дней", False)],
        related=["site", "bots", "support"]),
}


def page_service(slug):
    d = 1
    s = SVC[slug]
    p = PAGES[slug]
    facts = "".join(f'<div class="p-fact"><span class="ico">{ico(i)}</span><span><small>{a}</small><b>{b}</b></span></div>' for i, a, b in p["facts"])
    feat = "".join(f'<div class="f reveal"><span class="ico">{ico(i)}</span><h3>{t}</h3><p>{x}</p></div>' for i, t, x in p["feat"])
    demos = []
    need_rx = False
    for kind, tabs, t, x in p["demos"]:
        inner = rx_examples(tabs) if kind == "rx" else f'<div data-demo="{kind}"></div>'
        need_rx = need_rx or kind == "rx"
        demos.append(f'<div class="demo-wrap reveal"><div class="section-head section-head--left" style="margin-bottom:24px"><h3 style="font-size:24px;font-weight:800">{t}</h3><p class="lead" style="margin-top:8px;font-size:16px">{x}</p></div>{inner}</div>')
    cases = "".join(f"<span>{c}</span>" for c in p["cases"])
    plans = "".join(f'''<div class="plan{" plan--main" if main else ""} reveal"><span class="plan-tag">{"Основа" if main else "Вариант"}</span><h3>{t}</h3><p>{x}</p><div class="plan-price">{pr}<small>{dd}</small></div><a class="btn {"btn-primary" if main else "btn-ghost"} btn-sm" href="#lead-form" data-topic="{html.escape(s["full"] + ": " + t)}">Обсудить</a></div>'''
                    for t, x, pr, dd, main in p["plans"])
    related = "".join(f'<a class="rel reveal" href="{r}.html"><span class="ico">{ico(SVC[r]["icon"])}</span>{SVC[r]["full"]}<span class="arrow">{ico("arrow")}</span></a>' for r in p["related"])
    css = ["demos.css"] + (["examples.css"] if need_rx else [])
    js = (["examples.js"] if need_rx else []) + ["demos.js"]
    title_plain = re.sub("<[^>]+>", "", p["h1"])
    body = f'''{head(f"{s['full']} — RAENKO", re.sub("<[^>]+>", "", p["lead"]), d, css)}{header(d, slug)}
<main id="main">
<section class="p-hero">
  <div class="container p-hero-in">
    <div>
      <nav class="crumbs reveal" aria-label="Навигация"><a href="../index.html">Главная</a><span>/</span><a href="../index.html#services">Услуги</a><span>/</span><span>{s["full"]}</span></nav>
      <span class="eyebrow reveal">{ico(s["icon"])} {s["full"]}</span>
      <h1 class="reveal">{p["h1"]}</h1>
      <p class="lead reveal">{p["lead"]}</p>
      <div class="hero-cta reveal"><a class="btn btn-primary" href="#lead-form" data-topic="{html.escape(s["full"])}">Обсудить проект {ico("arrow")}</a><a class="btn btn-ghost" href="#demo">Попробовать демо</a></div>
    </div>
    <div class="p-facts reveal">{facts}</div>
  </div>
</section>

<section class="section section--soft">
  <div class="container">
    <div class="section-head reveal"><span class="eyebrow">{ico("check")} Что входит</span><h2 class="h2">Что вы получаете</h2></div>
    <div class="feat">{feat}</div>
  </div>
</section>

<section class="section" id="demo">
  <div class="container">
    <div class="section-head reveal"><span class="eyebrow">{ico("zap")} Живое демо</span><h2 class="h2">Попробуйте сами</h2><p class="lead">Это рабочие примеры: нажимайте и смотрите, как это будет у вас. Данные придуманы.</p></div>
    {"".join(demos)}
  </div>
</section>

<section class="section section--soft">
  <div class="container">
    <div class="section-head reveal"><span class="eyebrow">{ico("target")} Для каких задач</span><h2 class="h2">Кому подходит</h2></div>
    <div class="usecases reveal">{cases}</div>
  </div>
</section>

<section class="section" id="prices">
  <div class="container">
    <div class="section-head reveal"><span class="eyebrow">{ico("ruble")} Цены</span><h2 class="h2">Варианты и стоимость</h2><p class="lead">Ориентиры по цене и срокам. Точную сумму фиксируем в договоре после обсуждения.</p></div>
    <div class="plans">{plans}</div>
    <p class="svc-note reveal">Нужно несколько услуг сразу? <a href="../index.html#calculator">Посчитайте в калькуляторе</a></p>
  </div>
</section>

{steps_section()}

<section class="section">
  <div class="container">
    <div class="section-head reveal"><h2 class="h2" style="font-size:clamp(26px,3vw,34px)">Часто берут вместе</h2></div>
    <div class="related">{related}</div>
  </div>
</section>

{contact_section(d, title="Обсудим ваш проект", lead="Оставьте заявку: ответим в течение часа, уточним детали и назовём точную цену.", form_title=f"Заявка: {s['full'].lower()}")}
</main>
{footer(d)}{scripts(d, js)}'''
    (ROOT / "services" / f"{slug}.html").write_text(body, encoding="utf-8")


def favicon():
    svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="120 140 840 800">'
           '<path fill="#5B4CFF" fill-rule="evenodd" d="M131 155H640C820 155 920 250 920 390C920 490 870 560 782 602L948 924H778L634 642H290V924H131Z M290 284H634C700 284 750 335 750 399C750 463 700 514 634 514H290Z"/>'
           '<path fill="#C6F432" d="M290 312H630A86.5 86.5 0 0 1 630 485H290Z"/><circle cx="630" cy="399" r="58" fill="#fff"/></svg>')
    (ROOT / "assets" / "img" / "favicon.svg").write_text(svg, encoding="utf-8")


if __name__ == "__main__":
    (ROOT / "services").mkdir(exist_ok=True)
    favicon()
    page_index()
    for slug in PAGES:
        page_service(slug)
    print("ok:", "index.html +", ", ".join(f"services/{s}.html" for s in PAGES))
