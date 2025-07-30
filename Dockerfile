# --- Backend Build Stage ---
FROM node:20-alpine AS backend
WORKDIR /app
COPY backend/package*.json ./backend/
RUN cd backend && npm install
COPY backend ./backend

# Copy pre-built frontend to backend public (for production serving)
COPY ./dist ./backend/dist

# Copy startup script
COPY startup.sh ./backend/startup.sh
RUN chmod +x ./backend/startup.sh

# --- Production Stage ---
WORKDIR /app/backend
ENV NODE_ENV=${NODE_ENV:-production}
EXPOSE 5000
CMD ["./startup.sh"] 