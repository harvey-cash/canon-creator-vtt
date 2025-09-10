# 1. Base Image
FROM node:20 AS base

# Set working directory
WORKDIR /usr/src/app

# 2. Install Dependencies
# Use a separated dependency stage to leverage build cache
FROM base AS deps
# Install pnpm
RUN npm install -g pnpm
# Copy only the necessary package manifests to leverage cache
COPY package.json pnpm-lock.yaml ./
COPY packages/api/package.json ./packages/api/
COPY packages/web/package.json ./packages/web/
# Install dependencies for the 'api' package only
RUN pnpm install --filter api

# 3. Build the Application
# Use a separated build stage for a smaller final image
FROM base AS builder
# Install pnpm in this stage as well
RUN npm install -g pnpm
# Copy dependencies from the 'deps' stage
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/packages ./packages
COPY --from=deps /usr/src/app/package.json ./package.json
# Copy the source code for the backend
COPY packages/api/ ./packages/api/
# Build the application
RUN pnpm --filter api run build

# 4. Production Image
# Use a slim image for the final production stage
FROM base AS production

WORKDIR /usr/src/app
ENV NODE_ENV production

# Install pnpm in this stage
RUN npm install -g pnpm

# Copy only the package manifests needed for installation
COPY package.json pnpm-lock.yaml ./
COPY packages/api/package.json ./packages/api/

# Install ONLY production dependencies for the 'api' package
RUN pnpm install --filter api --prod

# Copy the built application code from the builder stage
COPY --from=builder /usr/src/app/packages/api/dist ./packages/api/dist

# Start the application
CMD ["node", "packages/api/dist/main.js"]
