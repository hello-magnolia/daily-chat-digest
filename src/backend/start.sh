#!/bin/bash

echo "=========================================="
echo "WhatsApp Digest Backend Startup"
echo "=========================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "ERROR: .env file not found!"
    echo "Please copy .env.example to .env and configure it."
    exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

echo "Environment: $ENVIRONMENT"
echo "MCP Server: $MCP_SERVER_URL"
echo ""

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker not found. Please install Docker."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "ERROR: docker-compose not found. Please install docker-compose."
    exit 1
fi

echo "Starting services with Docker Compose..."
echo ""

# Build and start
docker-compose up -d --build

echo ""
echo "=========================================="
echo "Services started!"
echo "=========================================="
echo ""
echo "API:          http://localhost:8000"
echo "API Docs:     http://localhost:8000/docs"
echo "Health Check: http://localhost:8000/health"
echo ""
echo "View logs:"
echo "  docker-compose logs -f"
echo ""
echo "Stop services:"
echo "  docker-compose down"
echo ""
