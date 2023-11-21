FROM node:18-slim AS build

WORKDIR /app

# COPY dist/ ./dist/
# COPY package.json pnpm-lock.yaml ./
# only for local testing COPY moleculer.dev.config.ts ./moleculer.config.ts

# RUN corepack enable
# RUN corepack prepare pnpm@latest-8 --activate
# RUN pnpm config set store-dir .pnpm-store
# RUN CI=true pnpm install --frozen-lockfile --prod

COPY . .

RUN yarn install 

FROM gcr.io/distroless/nodejs18-debian11:nonroot

WORKDIR /usr/src/app

COPY --from=build /app/src ./
COPY --from=build /app/node_modules ./node_modules

ENV PORT ${PORT}
ENV NODE_ENV production

EXPOSE ${PORT}

CMD ["./node_modules/moleculer/bin/moleculer-runner.js", "--env", "--config", "moleculer.config.js", "service.js"]