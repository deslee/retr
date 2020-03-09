FROM node:13

WORKDIR /app

ADD package.json .
ADD package-lock.json .

RUN npm install

ENTRYPOINT npm start