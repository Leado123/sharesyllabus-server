# Use official Bun image
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS install
COPY package.json bun.lockb* ./
RUN bun install

# Copy source files and generate Prisma client
FROM base AS build
COPY --from=install /app/node_modules ./node_modules
COPY . .
RUN bunx prisma generate

# Final production image
FROM base AS release
WORKDIR /app

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

# Run database migrations and start the application
CMD ["sh", "-c", "bunx prisma migrate deploy && bun run src/index.ts"]
