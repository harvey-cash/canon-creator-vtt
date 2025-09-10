# Stage 1: A 'development' stage that includes ALL dependencies
FROM node:20 AS development
WORKDIR /usr/src/app
RUN npm install -g pnpm

# Copy manifests and install ALL dependencies (including devDependencies)
COPY package.json pnpm-lock.yaml ./
COPY packages/api/package.json ./packages/api/
COPY packages/web/package.json ./packages/web/
RUN pnpm install --filter api

# Copy the rest of the source code (will be overwritten by volume mount in dev)
COPY . .

# Default command for development, which docker-compose will use
CMD ["pnpm", "--filter", "api", "run", "start:dev"]


# --- Production Build Stages ---

# Stage 2: A 'builder' stage for creating the production build
FROM development AS builder
# Build the NestJS application
RUN pnpm --filter api run build


# Stage 3: The final 'production' image, lean and optimized
FROM node:20 AS production
WORKDIR /usr/src/app
ENV NODE_ENV production
RUN npm install -g pnpm

# Copy only production package manifests
COPY package.json pnpm-lock.yaml ./
COPY packages/api/package.json ./packages/api/

# Install ONLY production dependencies
RUN pnpm install --filter api --prod

# Copy the built application from the builder stage
COPY --from=builder /usr/src/app/packages/api/dist ./packages/api/dist

# The command to start the production application
CMD ["node", "packages/api/dist/main.js"]

