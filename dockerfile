# ==========================================
# ETAPA 1: Construcción (Build Stage)
# ==========================================
FROM node:22-alpine AS build

WORKDIR /app

# Copiamos archivos de dependencias primero para aprovechar caché de Docker
COPY package*.json ./

# Instalamos dependencias
RUN npm ci

# Copiamos el resto del código fuente
COPY . .

# IMPORTANTE: Definimos argumentos de construcción para las variables de entorno
# Esto permite inyectar la URL del backend al momento de construir la imagen
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Construimos la aplicación para producción (genera carpeta /dist)
RUN npm run build

# ==========================================
# ETAPA 2: Servidor Web (Production Stage)
# ==========================================
FROM nginx:alpine

# Copiamos los archivos construidos desde la etapa anterior a la carpeta de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiamos una configuración básica de Nginx para manejar el enrutamiento de React (SPA)
# (Si no tienes este archivo, crea uno o usa el comando echo de abajo)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Exponemos el puerto 80 (El estándar para servidores web)
EXPOSE 80

# Arrancamos Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]