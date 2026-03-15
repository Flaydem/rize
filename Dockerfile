FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --include=dev

# Build
FROM deps AS build
COPY . .
RUN node ace build --ignore-ts-errors

# Production
FROM base AS production
ENV NODE_ENV=production
COPY --from=build /app/build /app
RUN npm ci --omit=dev
EXPOSE 3333
CMD ["node", "bin/server.js"]
