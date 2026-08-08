# --- build ------------------------------------------------------------------
FROM node:22-alpine AS build
WORKDIR /app

# Playwright es sólo para el QA local; no se instala en la imagen.
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json vite.config.ts index.html ./
COPY src ./src
COPY public ./public
RUN npm run build

# --- serve ------------------------------------------------------------------
FROM nginx:1.27-alpine AS runtime

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/nacar.conf
# Fuera de conf.d a propósito: ahí nginx lo cargaría a nivel http y las
# directivas add_header quedarían fuera de contexto.
COPY security-headers.conf /etc/nginx/security-headers.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=4s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
