FROM node:20-alpine

WORKDIR /app

# Install security updates
RUN apk update && \
    apk upgrade && \
    rm -rf /var/cache/apk/*

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV=production

EXPOSE 5000

CMD ["npm", "start"]
