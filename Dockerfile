FROM node:20.18.0-alpine3.20 AS build
WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY ./ ./
RUN yarn run build
RUN yarn install --frozen-lockfile --production

FROM node:20.18.0-alpine3.20 AS run
WORKDIR /app
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/package.json ./package.json

USER node
EXPOSE 3000
CMD ["node"]