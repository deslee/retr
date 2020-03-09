FROM node:13 AS builder
WORKDIR /app
ADD app/package.json .
ADD app/package-lock.json .
RUN npm ci
ADD app .
RUN npm run build

FROM nginx
COPY --from=builder /app/build /var/www
ADD nginx.conf /etc/nginx/nginx.conf