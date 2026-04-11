FROM node:24-alpine3.23 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:24-alpine3.23

WORKDIR /app
ENV NODE_ENV=production

COPY --chown=node:node --from=builder /app/package*.json ./

RUN npm ci --omit=dev
RUN chown -R node:node /app/node_modules

COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/doc ./doc

USER node

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/ || exit 1

CMD ["node", "dist/main.js"]