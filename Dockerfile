# --- Frontend Build Stage ---
FROM node:18-alpine AS frontend
WORKDIR /app/frontend
COPY ./src ./src
COPY ./public ./public
COPY package*.json ./
RUN npm install && npm run build

# --- Backend Build Stage ---
FROM node:18-alpine AS backend
WORKDIR /app
COPY backend/package*.json ./backend/
RUN cd backend && npm install
COPY backend ./backend

# Copy frontend build to backend public (for production serving)
COPY --from=frontend /app/frontend/dist ./backend/dist

# --- Production Stage ---
WORKDIR /app/backend
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "src/server.js"] 