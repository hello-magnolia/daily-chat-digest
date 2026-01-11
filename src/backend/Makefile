.PHONY: help build up down logs restart clean test

help:
	@echo "WhatsApp Digest Backend - Available Commands"
	@echo "=============================================="
	@echo ""
	@echo "  make build       - Build Docker images"
	@echo "  make up          - Start all services"
	@echo "  make down        - Stop all services"
	@echo "  make logs        - View service logs"
	@echo "  make restart     - Restart all services"
	@echo "  make clean       - Remove containers and volumes"
	@echo "  make test        - Run tests"
	@echo "  make shell       - Open shell in API container"
	@echo "  make worker-logs - View worker logs"
	@echo ""

build:
	docker-compose build

up:
	docker-compose up -d
	@echo ""
	@echo "Services started!"
	@echo "API: http://localhost:8000"
	@echo "Docs: http://localhost:8000/docs"

down:
	docker-compose down

logs:
	docker-compose logs -f

worker-logs:
	docker-compose logs -f worker

restart:
	docker-compose restart

clean:
	docker-compose down -v
	@echo "Cleaned up containers and volumes"

test:
	python test_basic.py

shell:
	docker-compose exec api /bin/bash

install-dev:
	pip install -r requirements.txt
	pip install pytest pytest-asyncio httpx

dev:
	python main.py
