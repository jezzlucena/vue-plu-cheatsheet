FROM node:lts-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json .
RUN rm -rf node_modules
RUN rm -rf package-lock.json
RUN npm install

CMD ["npm", "run", "dev"]