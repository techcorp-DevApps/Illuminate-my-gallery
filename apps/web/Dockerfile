FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json* ./
COPY apps/web/package.json ./apps/web/package.json
RUN npm install --workspace apps/web --omit=dev

COPY apps/web ./apps/web
WORKDIR /app/apps/web

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
