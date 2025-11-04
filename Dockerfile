# -------- Stage 1: Build the app --------
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ARG NEXT_PUBLIC_API_BASE
ENV NEXT_PUBLIC_API_BASE=${NEXT_PUBLIC_API_BASE}

COPY . .
RUN npm run build

# -------- Stage 2: Run the app --------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HUSKY=0

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

# ✅ Skip Husky and other lifecycle scripts during install
# RUN npm ci --omit=dev --ignore-scripts
RUN npm ci --ignore-scripts

EXPOSE 3000
CMD ["npm", "start"]
