#!/bin/sh

cat <<EOF > /usr/share/nginx/html/env.js
window.RUNTIME_ENV = {
  VITE_API_URL: "${VITE_API_URL}",
  VITE_OTP_FORMAT: "${VITE_OTP_FORMAT}"
};
EOF

cd /usr/share/nginx/backend
node main.js &

nginx -g "daemon off;"
