# Étape 1 : Build de l'application React
FROM node:18-alpine as build
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# Étape 2 : Serveur Web (Nginx) pour afficher le site
FROM nginx:alpine
# On copie les fichiers construits (dist) vers le dossier de Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# On ouvre le port 80 (standard web)
EXPOSE 80
# Lancement de Nginx
CMD ["nginx", "-g", "daemon off;"]