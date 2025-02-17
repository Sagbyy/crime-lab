FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++

COPY package*.json ./

RUN rm -rf node_modules
RUN npm cache clean --force
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 8080

CMD ["npm", "run", "dev"]