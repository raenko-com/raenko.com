# raenko.com

Сайт [raenko.com](https://raenko.com): сайты, боты, автоматизация, ИИ-интеграция, хостинг и продвижение для бизнеса.

## Работа с репозиторием

- Ветки по задачам YouGile: `RAE-N-краткое-описание`.
- Изменения в `main` через pull request.
- Для каждого PR автоматически публикуется превью на GitHub Pages, ссылка появляется в комментарии к PR.

## Сайт (RAE-25)

Многостраничный статический сайт без сборщиков: `index.html`, страницы услуг в `services/`, политика ПД в `policy/`.

**Как выложить на сервер: [DEPLOY.md](DEPLOY.md).**

- Страницы генерируются скриптом `python3 tools/build.py` (общие шапка, футер, форма, кнопка контактов). Править тексты и услуги там, затем перезапустить скрипт.
- `assets/css/site.css` — стили сайта, цвета только через переменные схемы. Три схемы из голосования RAE-29: `indigo`, `ultra`, `raspberry` (атрибут `data-theme` на `body`). Сейчас всегда `indigo`, другие схемы для сравнения: `?theme=ultra`, `?theme=raspberry`.
- `assets/js/prices.js`, `calc.js`, `calc.css` — калькулятор из RAE-18 (цены в `prices.js`).
- `assets/js/examples.js`, `examples.css` — живые примеры из RAE-21.
- `assets/js/demos.js`, `demos.css` — демо на страницах услуг (бот, ИИ, мониторинг, аналитика заявок).
- `tools/policy-pd.md` — текст политики обработки ПД, `node tools/policy-pdf.js` пересобирает PDF.
- Форма шлёт заявки в raenko-bot, когда в `tools/build.py` задан `LEAD_API`.
