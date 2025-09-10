# 1. Base Image
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm

# Copy package manifests for workspace setup
COPY package.json pnpm-lock.yaml ./
COPY packages/api/package.json ./packages/api/
COPY packages/web/package.json ./packages/web/

# Install dependencies for the 'web' package only
# This leverages pnpm's workspace protocol to link local packages
RUN pnpm install --filter web

# Copy the source code for the frontend
# This comes after install to leverage build cache
COPY packages/web/ ./packages/web/

# Expose the port Vite runs on
EXPOSE 5173

# Use --filter to target the 'web' package's dev script
CMD ["pnpm", "--filter", "web", "run", "dev"]

