# --- Backend Build Stage ---
FROM node:20-alpine AS backend
WORKDIR /app
COPY backend/package*.json ./backend/
RUN cd backend && npm install
COPY backend ./backend

# Copy pre-built frontend to backend public (for production serving)
COPY ./dist ./backend/dist

# --- Production Stage ---
WORKDIR /app/backend
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "src/server.js"] 