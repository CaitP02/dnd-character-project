# Build from the repository root: docker build -f backend/Dockerfile .
FROM node:22-alpine
WORKDIR /app

COPY package.json package-lock.json ./
COPY shared/package.json shared/
COPY backend/package.json backend/
COPY frontend/package.json frontend/
RUN npm ci --omit=dev --workspace backend --workspace @dnd/shared

COPY shared/src shared/src
COPY backend/src backend/src
COPY backend/scripts backend/scripts

ENV NODE_ENV=production PORT=5555
EXPOSE 5555
USER node
CMD ["node", "backend/src/server.js"]
