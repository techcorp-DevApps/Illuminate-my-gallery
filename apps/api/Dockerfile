FROM node:20-alpine AS base
WORKDIR /app

COPY package.json package-lock.json* ./
COPY apps/api/package.json ./apps/api/package.json
RUN npm install --workspace apps/api --omit=dev

COPY apps/api ./apps/api
WORKDIR /app/apps/api

ENV NODE_ENV=production
EXPOSE 8080
CMD ["npm", "run", "start:prod"]
