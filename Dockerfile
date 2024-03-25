FROM node:lts-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:lts-alpine AS run
WORKDIR /app

COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./
COPY --from=build /app/next.config.js ./
RUN npm ci --only=production

EXPOSE 3000
ENTRYPOINT [ "npm", "start" ]