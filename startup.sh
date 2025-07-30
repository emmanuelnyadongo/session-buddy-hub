#!/bin/sh

echo "=== Container Startup Debug ==="
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "DB_HOST: $DB_HOST"
echo "DB_NAME: $DB_NAME"
echo "Current directory: $(pwd)"
echo "Files in current directory:"
ls -la

echo "=== Starting application ==="
exec node src/server.js 