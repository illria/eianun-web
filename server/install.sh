  "https://raw.githubusercontent.com/illria/eianun-web/main/server/eianun-web-update.sh?cache=$(date +%s)"
tr -d '\r' < "$UPDATE_TMP" > /usr/local/sbin/eianun-web-update
rm -f "$UPDATE_TMP"
chmod 0755 /usr/local/sbin/eianun-web-update
test -s /usr/local/sbin/eianun-web-update

cat > /etc/conf.d/eianun-web <<'CONF'
EIANUN_WEB_DIR="/opt/eianun-web"
EIANUN_WEB_PORT="9191"
CONF

cat > /etc/init.d/eianun-web <<'SERVICE'
#!/sbin/openrc-run

: "${EIANUN_WEB_DIR:=/opt/eianun-web}"
: "${EIANUN_WEB_PORT:=9191}"

command="/bin/busybox-extras"
command_args="httpd -f -p ${EIANUN_WEB_PORT} -h ${EIANUN_WEB_DIR}"
command_background="yes"
pidfile="/run/eianun-web.pid"

depend() {
  need net
}
SERVICE
chmod 0755 /etc/init.d/eianun-web

/usr/local/sbin/eianun-web-update
rc-update add eianun-web default >/dev/null 2>&1 || true
rc-service eianun-web restart || rc-service eianun-web start

echo "EIANUN 网站已安装并启动：http://$(hostname -i | awk '{print $1}'):${EIANUN_WEB_PORT}"
