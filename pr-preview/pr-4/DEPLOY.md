# Как выложить сайт на сервер

Сайт статический: HTML, CSS, JS, картинки и шрифты. Ему нужен только nginx. Форма заявок
отправляет данные в [raenko-bot](https://github.com/raenko-com/raenko-bot), который крутится
на том же сервере, а nginx пробрасывает к нему `/api/lead`.

Ниже инструкция для Ubuntu 22.04/24.04 и домена `raenko.pro`. Если домен другой, замените его
в `deploy/nginx.conf` и в `DOMAIN` в `tools/build.py`.

## Что в репозитории

| Путь | Что это |
|---|---|
| `index.html`, `services/`, `policy/` | Готовые страницы (собираются `tools/build.py`) |
| `assets/` | CSS, JS, картинки, шрифты, PDF политики |
| `robots.txt` | Для поисковиков |
| `deploy/nginx.conf` | Конфиг nginx с HTTPS и заголовками безопасности |
| `deploy/deploy.sh` | Сборка и выкладка на сервер через rsync |
| `tools/` | Генератор страниц и исходники, **на сервер не выкладываются** |

На сервер попадают только `index.html`, `robots.txt`, `services/`, `policy/`, `assets/`.
Скрипт `deploy/deploy.sh` выкладывает ровно этот список, всё остальное (`.git`, `tools/`,
`CHANGELOG.md` и прочее) остаётся у вас. Дополнительно nginx отдаёт 404 на служебные пути,
если они всё же попадут на сервер.

## 1. Подготовить сервер (один раз)

```bash
# на сервере, под пользователем с sudo
sudo apt update && sudo apt install -y nginx certbot python3-certbot-nginx rsync ufw

# файрвол: только SSH и веб
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# отдельный пользователь для выкладки, без sudo
sudo adduser --disabled-password --gecos "" deploy
sudo mkdir -p /var/www/raenko.pro /var/www/certbot
sudo chown deploy:deploy /var/www/raenko.pro
```

Доступ для выкладки только по SSH-ключу. Положите публичный ключ в
`/home/deploy/.ssh/authorized_keys`, а в `/etc/ssh/sshd_config` выключите вход по паролю
(`PasswordAuthentication no`, `PermitRootLogin no`), затем `sudo systemctl reload ssh`.

DNS: A-запись `raenko.pro` и `www.raenko.pro` на IP сервера.

## 2. HTTPS-сертификат

Пока сертификата нет, nginx с полным конфигом не запустится. Поэтому сначала выпускаем
сертификат на временном конфиге:

```bash
sudo certbot certonly --nginx -d raenko.pro -d www.raenko.pro
```

Certbot сам продлевает сертификат (таймер `certbot.timer`). Проверка: `sudo certbot renew --dry-run`.

## 3. Конфиг nginx

```bash
# с вашего компьютера, из папки репозитория
scp deploy/nginx.conf deploy@raenko.pro:/tmp/raenko.pro.conf

# на сервере
sudo mv /tmp/raenko.pro.conf /etc/nginx/sites-available/raenko.pro
sudo ln -sf /etc/nginx/sites-available/raenko.pro /etc/nginx/sites-enabled/raenko.pro
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

Что включено в конфиге:
- редирект с http и www на `https://raenko.pro`;
- только TLS 1.2 и 1.3, HSTS;
- заголовки безопасности: CSP (скрипты, стили и шрифты только с нашего домена),
  запрет встраивания во фреймы, `nosniff`, `Referrer-Policy`, `Permissions-Policy`;
- версия nginx скрыта;
- `/api/lead` проксируется в бота: только POST, не больше 10 заявок в минуту с IP;
- 404 на скрытые файлы (`.git`, `.env`) и служебные папки;
- кэш для CSS/JS/шрифтов/картинок (в ссылках стоит `?v=N`, при выкладке новой версии кэш сбрасывается).

## 4. Выложить сайт

Нужны Python 3 и rsync на вашем компьютере.

```bash
DEPLOY_TARGET=deploy@raenko.pro:/var/www/raenko.pro ./deploy/deploy.sh
```

Скрипт пересоберёт страницы и синхронизирует папку на сервере (лишние старые файлы удалятся).
Проверка после выкладки:

```bash
curl -I https://raenko.pro/          # 200 и заголовки content-security-policy, strict-transport-security
curl -I https://raenko.pro/tools/build.py   # 404
```

Онлайн-проверки: [securityheaders.com](https://securityheaders.com) и
[SSL Labs](https://www.ssllabs.com/ssltest/).

## 5. Форма заявок (raenko-bot)

1. Запустите бота по его README. В `.env` бота:
   - `HTTP_ADDR=127.0.0.1:8080` — бот слушает только локально, наружу его отдаёт nginx;
   - `TRUST_PROXY=1` — бот берёт IP клиента из заголовка nginx (для ограничения частоты заявок);
   - `ALLOWED_ORIGINS=https://raenko.pro`.
2. В `tools/build.py` поставьте `LEAD_API = "/api/lead"` и выложите сайт заново (шаг 4).
3. Отправьте тестовую заявку с сайта, она должна прийти в Telegram и на почту.

Пока `LEAD_API` пустой, форма не отправляется и показывает телефон и Telegram.

Если бот будет на другом домене (например `https://api.raenko.pro/api/lead`), впишите этот
адрес в `LEAD_API` и добавьте домен в `connect-src` строки `Content-Security-Policy`
в `deploy/nginx.conf`, иначе браузер заблокирует запрос.

## 6. Обновление сайта

```bash
git pull
python3 tools/build.py        # если меняли тексты в tools/
node tools/policy-pdf.js      # только если меняли политику ПД (нужен Playwright)
DEPLOY_TARGET=deploy@raenko.pro:/var/www/raenko.pro ./deploy/deploy.sh
```

При заметных изменениях CSS/JS увеличьте `V` в `tools/build.py`, чтобы у посетителей сбросился кэш.

## Что проверено по безопасности

- Внешних скриптов, стилей и шрифтов нет: шрифт Manrope лежит в `assets/fonts/`
  (раньше грузился с Google Fonts, то есть IP посетителей уходил в Google). Это же нужно для CSP.
- Инлайн-скриптов и обработчиков `onclick` нет, поэтому CSP запрещает любые чужие скрипты.
- Всё, что вводит пользователь в демо, экранируется перед выводом.
- Ссылки `target="_blank"` с `rel="noopener"`.
- Форма: ограничения длины полей, скрытое поле-ловушка для спам-ботов, согласие на обработку ПД
  ставится вручную (по 152-ФЗ галочка не может стоять заранее).
- Бот: лимит 5 заявок за 10 минут с IP, лимит размера запроса 16 КБ, CORS только для своего домена,
  данные в сообщениях Telegram экранируются. IP клиента берётся из `X-Real-IP` только при
  `TRUST_PROXY=1`, иначе подставным заголовком можно было обойти лимит.
- Политика ПД: страница `/policy/` и PDF `assets/docs/policy-pd.pdf`. Текст в `tools/policy-pd.md`,
  реквизиты оператора в `tools/build.py` (`OPERATOR`, `POLICY_EMAIL`, `POLICY_DATE`).
