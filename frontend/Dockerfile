FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
RUN mkdir -p /app
WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm install --production

FROM deps AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

COPY ./src ./src
COPY ./public ./public
COPY next.config.js .
COPY tsconfig.json .
COPY package.json . 
COPY package-lock.json .

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

FROM deps AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules


USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["npm", "start"]
