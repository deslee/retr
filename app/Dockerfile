FROM node:13 AS builder
WORKDIR /app
ADD package.json .
ADD package-lock.json .
RUN npm ci
COPY . /app
RUN npm run build

FROM nginx
COPY --from=builder /app/build /var/www
ADD nginx.conf /etc/nginx/nginx.conf