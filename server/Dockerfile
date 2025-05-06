FROM oven/bun:slim AS base

WORKDIR /app

COPY package*.json ./
COPY bun.lock ./

RUN bun install

FROM oven/bun:slim AS builder

WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY . .

RUN bun run build

FROM oven/bun:slim AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public

EXPOSE 2567

CMD ["bun", "build/index.js"]
