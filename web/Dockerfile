FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

RUN rm -rf node_modules

COPY . .

RUN npm install --legacy-peer-deps

EXPOSE 8080

CMD ["npm", "run", "dev"]
