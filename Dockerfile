# Root Dockerfile for Frontend (Next.js)
FROM node:20-alpine

WORKDIR /app

# Copy only dependency definitions first
COPY package.json package-lock.json* ./
RUN npm install

# Copy frontend source and configuration
COPY pages/ ./pages/
COPY public/ ./public/
COPY styles/ ./styles/
COPY components/ ./components/
COPY lib/ ./lib/
COPY next.config.js tsconfig.json tailwind.config.js postcss.config.js ./

EXPOSE 3000

CMD ["npm", "run", "dev"]
