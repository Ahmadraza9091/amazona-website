# ============================================================
# Build Stage
# ============================================================
FROM node:18 AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./

RUN npm install

# Copy source code
COPY . .

# Build old React/Webpack application
RUN NODE_OPTIONS=--openssl-legacy-provider npm run build


# ============================================================
# Production Stage
# ============================================================
FROM nginx:alpine

# Update Alpine security packages
RUN apk update && \
    apk upgrade && \
    rm -rf /var/cache/apk/*

# Copy React production build
COPY --from=build /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]