# ---- Stage 1: Build & Test ----
FROM node:20-alpine AS build

WORKDIR /usr/src/app

# Copy manifests first to leverage layer caching
COPY package*.json ./

# Install ALL dependencies (including devDependencies for lint + test)
RUN npm ci

# Copy source
COPY . .

# Lint and test — build fails here if either step fails
RUN npm run build

# ---- Stage 2: Production ----
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Only production dependencies in the final image
COPY package*.json ./
RUN npm ci --only=production

# Copy application source from build stage
COPY --from=build /usr/src/app/server.js ./

# Expose the port the app listens on
EXPOSE 3000

# Start the server
CMD ["npm", "start"]