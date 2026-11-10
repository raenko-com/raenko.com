#!/usr/bin/env bash
# Собирает сайт и выкладывает на сервер только публичные файлы.
# Использование:  DEPLOY_TARGET=deploy@raenko.pro:/var/www/raenko.pro ./deploy/deploy.sh
set -euo pipefail
cd "$(dirname "$0")/.."

: "${DEPLOY_TARGET:?Укажите DEPLOY_TARGET, например deploy@raenko.pro:/var/www/raenko.pro}"

python3 tools/build.py

# Белый список: всё остальное (tools/, deploy/, .git, CHANGELOG и т.д.) на сервер не попадает.
rsync -az --delete --delete-excluded \
  --include='/index.html' \
  --include='/robots.txt' \
  --include='/services/***' \
  --include='/policy/***' \
  --include='/assets/***' \
  --exclude='*' \
  ./ "$DEPLOY_TARGET/"

echo "Готово: $DEPLOY_TARGET"
