FROM node:16-alpine
WORKDIR /usr/src/ms-nanban
COPY package.json .
RUN npm install -g typescript
RUN npm install --legacy-peer-deps
COPY . .
RUN tsc
COPY ./src/shared/mail/templates dist/shared/mail/
CMD ["node", "./dist/main.js"]
EXPOSE 5000