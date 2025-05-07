# Étape 1: Construire l'application NestJS
FROM node:18 AS backend-builder

WORKDIR /app

COPY backend/package*.json ./

RUN npm install

COPY backend/ .

RUN npm run build

# Étape 2: Construire l'application React/Vite
FROM node:18 AS frontend-builder

WORKDIR /app

COPY frontend/package*.json ./frontend/

WORKDIR /app/frontend

RUN npm install

COPY frontend/ .

RUN npm run build

# Étape 3: Créer l'image finale avec Nginx pour servir le frontend et le backend
FROM nginx:alpine

# Copier les fichiers construits du frontend
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# Copier les fichiers construits du backend
COPY --from=backend-builder /app/dist /usr/share/nginx/backend
COPY --from=backend-builder /app/node_modules /usr/share/nginx/backend/node_modules
COPY --from=backend-builder /app/package*.json /usr/share/nginx/backend/

# Configurer Nginx pour servir le frontend et proxy le backend
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
