FROM node:16-alpine
WORKDIR /usr/src/ms-nanban
COPY package.json .
RUN npm install -g typescript cpx
RUN npm install --legacy-peer-deps
COPY . .
RUN tsc
RUN npm run copy:assets
CMD ["node", "./dist/main.js"]
EXPOSE 5000