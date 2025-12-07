# Use official Bun image
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies into a temp directory for caching
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Install production dependencies only
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Copy node_modules from temp directory and all source files
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Generate Prisma client
RUN bunx prisma generate

# Final production image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /app/src ./src
COPY --from=prerelease /app/prisma ./prisma
COPY --from=prerelease /app/package.json .
COPY --from=prerelease /app/tsconfig.json .
COPY --from=prerelease /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=prerelease /app/node_modules/@prisma ./node_modules/@prisma

# Create syllabi directory for file uploads
RUN mkdir -p /app/syllabi

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4000

# Expose port
EXPOSE 4000

# Run database migrations and start the application
CMD ["sh", "-c", "bunx prisma migrate deploy && bun run src/index.ts"]
