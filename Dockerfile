# Build stage
FROM node:14 AS build

ARG BUILD_CONFIGURATION

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . /app
RUN yarn build:$BUILD_CONFIGURATION

# Production stage
FROM nginxinc/nginx-unprivileged:1.23-alpine

COPY nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
