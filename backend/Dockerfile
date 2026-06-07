FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN pnpm config set fetch-retries 10 && \
    pnpm config set fetch-retry-maxtimeout 120000 && \
    pnpm install --ignore-scripts && \
    pnpm prisma generate

FROM base AS build
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN ./node_modules/.bin/nest build

FROM dependencies AS prod-dependencies
WORKDIR /app
RUN pnpm prune --prod

FROM base AS deploy
WORKDIR /app
RUN chown node:node /app
USER node
ENV NODE_ENV=production
COPY --chown=node:node --from=prod-dependencies /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node package.json ./
COPY --chown=node:node --from=build /app/prisma ./prisma

EXPOSE 3000
CMD ["node", "dist/main"]