FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY .env ./

COPY package.json package-lock.json ./
RUN npm install --production

COPY --from=builder /app/dist ./dist

# CMD ["node", "dist/main.js"]
# print the current working directory and list the files in it
# CMD ["sh", "-c", "pwd && ls -l dist"]
CMD ["node", "dist/index.js"]
