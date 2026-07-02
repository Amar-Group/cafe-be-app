# Use the official Bun image
FROM oven/bun:1.1-alpine AS base
WORKDIR /usr/src/app

# Install dependencies into temp directory to cache them
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Copy node_modules and all source files
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Final release image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/src src
COPY --from=prerelease /usr/src/app/package.json package.json
COPY --from=prerelease /usr/src/app/tsconfig.json tsconfig.json
COPY --from=prerelease /usr/src/app/drizzle drizzle
COPY --from=prerelease /usr/src/app/drizzle.config.ts drizzle.config.ts

# Set correct permissions for the bun user
RUN chown -R bun:bun /usr/src/app

# Expose the default Hono port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Run the app
USER bun
ENTRYPOINT [ "sh", "-c", "bun run db:migrate && bun run start" ]
