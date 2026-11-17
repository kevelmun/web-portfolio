FROM node:22.23.4-alpine3.24
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
EXPOSE 5173
CMD ["pnpm", "dev", "--host", "0.0.0.0"]
