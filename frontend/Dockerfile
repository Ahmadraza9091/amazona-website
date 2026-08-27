# ============================================================
# Build Stage
# ============================================================
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Old React/Webpack compatibility
RUN NODE_OPTIONS=--openssl-legacy-provider npm run build


# ============================================================
# Production Stage
# ============================================================
FROM nginx:alpine

# Update Alpine security packages
RUN apk update && \
    apk upgrade && \
    rm -rf /var/cache/apk/*

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]