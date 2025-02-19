FROM node:lts-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY . .
RUN rm -rf node_modules
RUN rm -rf package-lock.json
RUN npm install

RUN npm run build

CMD ["npm", "run", "preview"]