# WhatsApp Digest Backend

Scalable Python backend for WhatsApp chat digest and summarization application with MCP server integration.

## FEATURES
================================================================================

- **WhatsApp Integration**: Connects to WhatsApp via MCP (Model Context Protocol) server
- **AI Summarization**: Uses OpenAI/Anthropic to generate chat summaries and daily digests
- **Supabase Storage**: Stores summaries and messages in Supabase
- **Background Tasks**: Celery workers for async summary generation
- **Docker Ready**: Fully containerized with docker-compose
- **Scalable**: Redis-backed task queue and caching
- **API Documentation**: Auto-generated OpenAPI docs

## ARCHITECTURE
================================================================================

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Frontend  │─────▶│  FastAPI API │─────▶│  Supabase   │
│  (React)    │      │   (Python)   │      │  (Storage)  │
└─────────────┘      └──────────────┘      └─────────────┘
                            │
                            ├──────▶ MCP Server (WhatsApp)
                            │
                            ├──────▶ OpenAI/Anthropic (AI)
                            │
                            └──────▶ Redis + Celery (Tasks)
```

## SETUP
================================================================================

### Prerequisites

- Docker & Docker Compose
- Python 3.11+ (for local development)
- Supabase account
- OpenAI or Anthropic API key
- Running WhatsApp MCP server

### Environment Variables

Copy `.env.example` to `.env` and fill in:

```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
MCP_SERVER_URL=http://localhost:3000
```

### Supabase Schema

Run these SQL commands in your Supabase SQL editor:

```sql
-- Messages table
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  chat_id TEXT NOT NULL,
  sender TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_messages_timestamp ON messages(timestamp);

-- Chat summaries table
CREATE TABLE chat_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id TEXT NOT NULL,
  date DATE NOT NULL,
  summary TEXT NOT NULL,
  key_points JSONB NOT NULL,
  notable_messages JSONB NOT NULL,
  message_count INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(chat_id, date)
);

CREATE INDEX idx_chat_summaries_date ON chat_summaries(date);
CREATE INDEX idx_chat_summaries_chat_id ON chat_summaries(chat_id);

-- Daily digests table
CREATE TABLE daily_digests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  overall_summary TEXT NOT NULL,
  chat_summaries JSONB NOT NULL,
  highlights JSONB NOT NULL,
  total_messages INTEGER NOT NULL,
  total_chats INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_daily_digests_date ON daily_digests(date);
```

## RUNNING
================================================================================

### With Docker (Recommended)

```bash
cd backend

# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services will be available at:
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Redis: localhost:6379

### Local Development

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start Redis (required)
docker run -d -p 6379:6379 redis:7-alpine

# Start Celery worker
celery -A celery_tasks worker --loglevel=info

# Start API server (in another terminal)
python main.py
```

## API ENDPOINTS
================================================================================

### POST /api/v1/update_summaries

Update chat summaries for a date.

Request:
```json
{
  "date": "2025-01-15T00:00:00Z",
  "chat_ids": ["chat1", "chat2"],
  "force": false
}
```

Response:
```json
{
  "success": true,
  "message": "Summary update task started",
  "summaries_updated": 5,
  "task_id": "abc-123"
}
```

### GET /api/v1/get_summaries

Get summaries for a date.

Query params:
- `date`: ISO date string (optional, defaults to today)
- `chat_id`: Filter by chat ID (optional)

Response:
```json
{
  "date": "2025-01-15",
  "daily_digest": {...},
  "chat_summaries": [...],
  "total_chats": 5
}
```

### POST /api/v1/handle_user_query

Ask questions about your chats.

Request:
```json
{
  "query": "What did we discuss about the party?",
  "date": "2025-01-15T00:00:00Z",
  "chat_ids": ["chat1"]
}
```

Response:
```json
{
  "answer": "The party is scheduled for Saturday...",
  "sources": [...],
  "confidence": 0.9
}
```

### GET /api/v1/chats

Get all WhatsApp chats from MCP server.

### GET /api/v1/messages

Get messages with optional filters.

### GET /health

Health check endpoint.

## SCALING
================================================================================

### Horizontal Scaling

Scale API workers:
```bash
docker-compose up -d --scale api=3
```

Scale Celery workers:
```bash
docker-compose up -d --scale worker=5
```

### Production Considerations

1. **Database Connection Pooling**: Configure Supabase connection pooling
2. **Redis Clustering**: Use Redis Cluster for high availability
3. **Load Balancer**: Put nginx or cloud load balancer in front
4. **Monitoring**: Add Prometheus + Grafana
5. **Logging**: Centralized logging with ELK stack
6. **Rate Limiting**: Configure nginx rate limits
7. **Caching**: Add Redis caching for frequent queries

## MCP SERVER INTEGRATION
================================================================================

The backend expects a WhatsApp MCP server running that implements:

- `get_messages`: Fetch messages with filters
- `get_chats`: List all chats
- `send_message`: Send messages (optional)

Example MCP server endpoint format:
```
POST http://mcp-server:3000/mcp
Content-Type: application/json

{
  "method": "tools/call",
  "params": {
    "name": "get_messages",
    "arguments": {
      "chat_id": "...",
      "start_date": "2025-01-15",
      "limit": 1000
    }
  }
}
```

## TROUBLESHOOTING
================================================================================

### MCP Server Connection Issues

- Check MCP_SERVER_URL is correct
- Verify MCP server is running: `curl http://localhost:3000/health`
- Check Docker network connectivity

### Celery Tasks Not Running

- Verify Redis is running: `docker-compose ps redis`
- Check worker logs: `docker-compose logs worker`
- Restart worker: `docker-compose restart worker`

### Supabase Connection Errors

- Verify credentials in .env
- Check Supabase project is active
- Verify tables exist (run schema SQL)

## DEVELOPMENT
================================================================================

### Adding New Endpoints

1. Add route in `main.py`
2. Add models in `models.py` if needed
3. Implement service logic in appropriate service file
4. Add tests

### Running Tests

```bash
pytest tests/ -v
```

## LICENSE
================================================================================

MIT
