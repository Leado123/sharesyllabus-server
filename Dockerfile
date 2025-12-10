# Use official Bun image with Debian for native module support
FROM oven/bun:1.1.38-debian AS base
WORKDIR /app

# Install dependencies stage with build tools for native modules
FROM base AS install
WORKDIR /app

# Install build dependencies for native modules (argon2, libpq, etc.)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json bun.lockb* ./

# Install all dependencies including native ones
RUN bun install

# Generate Prisma client (needs the schema)
COPY prisma ./prisma
RUN bunx prisma generate

# Build stage - copy source files
FROM base AS build
WORKDIR /app
COPY --from=install /app/node_modules ./node_modules
COPY . .

# Final production image
FROM oven/bun:1.1.38-debian AS release
WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Copy necessary files from build stage
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/src ./src
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package.json ./
COPY --from=build /app/tsconfig.json ./

# Create syllabi directory for file uploads
RUN mkdir -p /app/syllabi

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4000

# Expose port
EXPOSE 4000

# Push schema to database and start the application
CMD ["sh", "-c", "bunx prisma db push --accept-data-loss && bun run src/index.ts"]
