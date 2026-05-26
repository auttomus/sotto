FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS dev-deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
# Koreksi di sini
RUN pnpm install --ignore-scripts

FROM base AS prod-deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
# Koreksi di sini
RUN pnpm install --prod --ignore-scripts

FROM base AS build
WORKDIR /app
COPY . .
COPY --from=dev-deps /app/node_modules ./node_modules
RUN pnpm run build

FROM base AS deploy
WORKDIR /app
RUN chown node:node /app
USER node
COPY --chown=node:node --from=prod-deps /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/build ./build
COPY --chown=node:node package.json ./

EXPOSE 3000
CMD ["npm", "run", "start"]