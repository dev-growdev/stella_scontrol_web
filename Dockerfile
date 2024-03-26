FROM node:18.19.1-alpine as build

WORKDIR /app

COPY ./package.json ./package.json
COPY ./.npmrc ./.npmrc
COPY ./package-lock.json ./package-lock.json

RUN ls

COPY . .

RUN npm ci --legacy-peer-deps

RUN npm run build

# Production

FROM node:18.19.1-alpine as production

WORKDIR /app

ENV NODE_ENV production

RUN npm install -g serve

COPY --chown=node:node --from=build /app/package.json ./
COPY --chown=node:node --from=build /app/package-lock.json ./
COPY --chown=node:node --from=build /app/.npmrc ./

COPY --chown=node:node --from=build /app/build ./build

RUN npm ci --omit=dev

USER node

CMD ["serve", "-s", "build", "-l", "3000"]
