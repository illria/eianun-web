#!/bin/sh
set -eu

BASE_DIR="${EIANUN_WEB_DIR:-/opt/eianun-web}"
ARCHIVE_URL="${EIANUN_WEB_ARCHIVE_URL:-https://github.com/illria/eianun-web/archive/refs/heads/gh-pages.tar.gz}"
TMP_DIR="$(mktemp -d /tmp/eianun-web-update.XXXXXX)"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT INT TERM

if [ "$(id -u)" -ne 0 ]; then
  echo "请使用 root 执行此命令。" >&2
  exit 1
fi

if ! command -v wget >/dev/null 2>&1; then
  apk add --no-cache ca-certificates wget
fi

mkdir -p "$BASE_DIR"
wget -qO "$TMP_DIR/site.tar.gz" "$ARCHIVE_URL"
tar -xzf "$TMP_DIR/site.tar.gz" -C "$TMP_DIR"

SOURCE_DIR="$(find "$TMP_DIR" -mindepth 1 -maxdepth 1 -type d | head -n 1)"
if [ -z "$SOURCE_DIR" ] || [ ! -s "$SOURCE_DIR/index.html" ]; then
  echo "下载的静态包无效，未更新网站。" >&2
  exit 1
fi

NEXT_DIR="${BASE_DIR}.next"
OLD_DIR="${BASE_DIR}.old"
rm -rf "$NEXT_DIR" "$OLD_DIR"
mkdir -p "$NEXT_DIR"
cp -R "$SOURCE_DIR"/. "$NEXT_DIR"/

if [ -e "$BASE_DIR" ]; then
  mv "$BASE_DIR" "$OLD_DIR"
fi
mv "$NEXT_DIR" "$BASE_DIR"
rm -rf "$OLD_DIR"

if command -v rc-service >/dev/null 2>&1 && [ -x /etc/init.d/eianun-web ]; then
  rc-service eianun-web restart >/dev/null 2>&1 || true
fi

echo "EIANUN 网站更新完成：$(date -u '+%Y-%m-%d %H:%M:%S UTC')"
