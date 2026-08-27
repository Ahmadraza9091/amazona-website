# Build stage
FROM node:18 AS build

WORKDIR /app

# Fix old React/Webpack OpenSSL issue
ENV NODE_OPTIONS=--openssl-legacy-provider

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


# Production stage
FROM nginx:alpine

# Update Alpine security packages
RUN apk update && apk upgrade && rm -rf /var/cache/apk/*

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]