#!/bin/sh

# Démarrer le backend
cd /usr/share/nginx/backend
node main.js &

# Démarrer Nginx
nginx -g "daemon off;"
