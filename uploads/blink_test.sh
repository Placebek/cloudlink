#!/bin/bash

# reboot_once.sh — безопасная перезагрузка Raspberry Pi один раз
# Работает даже если скрипт отправлять много раз

MARKER_FILE="/tmp/.reboot_once_marker"

# Проверяем, перезагружались ли мы уже по этому маркеру
if [ -f "$MARKER_FILE" ]; then
    echo "Перезагрузка уже была выполнена ранее. Пропускаем."
    echo "Если хочешь перезагрузить снова — удали файл: $MARKER_FILE"
    exit 0
fi

echo "Помечаем, что перезагрузка запланирована..."
date > "$MARKER_FILE"

echo "Перезагружаю Raspberry Pi через 5 секунд..."
sleep 5

echo "Перезагружаю систему..."
sudo reboot now