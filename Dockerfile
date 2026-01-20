# Étape 1 : Build
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape 2 : Production avec Nginx
FROM nginx:alpine as production-stage

# Copier les fichiers construits vers Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copier la config Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Le volume partagé pour l'APK sera monté ici
RUN mkdir -p /shared

EXPOSE 8081
CMD ["nginx", "-g", "daemon off;"]
