FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --ignore-scripts

FROM base AS build
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
COPY node_modules/@prisma ./node_modules/@prisma
COPY node_modules/.pnpm ./node_modules/.pnpm
RUN ./node_modules/.bin/nest build

FROM base AS prod-dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --ignore-scripts
COPY node_modules/@prisma ./node_modules/@prisma
COPY node_modules/.pnpm ./node_modules/.pnpm

FROM base AS deploy
WORKDIR /app
RUN chown node:node /app
USER node
ENV NODE_ENV=production
COPY --chown=node:node --from=prod-dependencies /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node package.json ./

EXPOSE 3000
CMD ["node", "dist/main"]