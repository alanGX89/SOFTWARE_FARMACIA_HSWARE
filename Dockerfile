# ---- Etapa 1: Build del frontend React ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar e instalar dependencias del servidor
COPY package.json package-lock.json ./
RUN npm ci --production=false

# Copiar e instalar dependencias del cliente
COPY client/package.json client/package-lock.json ./client/
RUN cd client && npm ci

# Copiar todo el codigo fuente
COPY . .

# Build del frontend
RUN cd client && npm run build

# ---- Etapa 2: Imagen de produccion ----
FROM node:20-alpine

WORKDIR /app

# Copiar dependencias del servidor
COPY package.json package-lock.json ./
RUN npm ci --production && npm cache clean --force

# Copiar codigo del servidor
COPY server/ ./server/

# Copiar el build del frontend desde la etapa anterior
COPY --from=builder /app/client/build ./client/build

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "server/index.js"]
