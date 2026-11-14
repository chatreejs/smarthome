# Keep the tag in sync with .tool-versions and the Test stage of ci/Jenkinsfile
FROM oven/bun:1.4.3-alpine AS builder

WORKDIR /app
COPY package.json bun.lock ./

RUN bun install --frozen-lockfile
COPY ./ /app/
RUN bun run build

FROM nginxinc/nginx-unprivileged:1.23-alpine

COPY config/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build/ /usr/share/nginx/html

EXPOSE 80
STOPSIGNAL SIGTERM
CMD ["nginx", "-g", "daemon off;"]
