from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from datetime import datetime
from typing import Optional
import logging

from config import get_settings
from models import (
    UpdateSummariesRequest, 
    UpdateSummariesResponse,
    UserQuery,
    QueryResponse
)
from mcp_client import MCPClient
from supabase_service import SupabaseService
from ai_service import AIService
from celery_tasks import update_summaries_task

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()

# Initialize FastAPI
app = FastAPI(
    title=settings.api_title,
    version=settings.api_version,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency injection
def get_supabase_service():
    return SupabaseService()


def get_ai_service():
    return AIService()


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": settings.api_title,
        "version": settings.api_version,
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    health_status = {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "services": {}
    }
    
    # Check MCP server
    async with MCPClient() as mcp:
        mcp_healthy = await mcp.health_check()
        health_status["services"]["mcp_server"] = "healthy" if mcp_healthy else "unhealthy"
    
    # Check Supabase
    try:
        supabase = get_supabase_service()
        # Simple query to check connection
        supabase.client.table("chat_summaries").select("id").limit(1).execute()
        health_status["services"]["supabase"] = "healthy"
    except Exception as e:
        health_status["services"]["supabase"] = f"unhealthy: {str(e)}"
        health_status["status"] = "degraded"
    
    return health_status


@app.post(f"{settings.api_prefix}/update_summaries", response_model=UpdateSummariesResponse)
async def update_summaries(
    request: UpdateSummariesRequest,
    supabase: SupabaseService = Depends(get_supabase_service),
    ai: AIService = Depends(get_ai_service)
):
    """
    Update chat summaries for a given date
    
    This endpoint:
    1. Fetches messages from MCP server
    2. Groups messages by chat
    3. Generates AI summaries for each chat
    4. Stores summaries in Supabase
    5. Generates and stores daily digest
    
    Args:
        request: UpdateSummariesRequest with optional date and chat_ids
        
    Returns:
        UpdateSummariesResponse with status and count
    """
    try:
        date = request.date or datetime.utcnow()
        
        # Check if summaries already exist and force is not set
        if not request.force:
            existing = await supabase.get_daily_digest(date)
            if existing:
                return UpdateSummariesResponse(
                    success=True,
                    message="Summaries already exist for this date. Use force=true to regenerate.",
                    summaries_updated=0
                )
        
        # Trigger background task
        task = update_summaries_task.delay(
            date_str=date.isoformat(),
            chat_ids=request.chat_ids
        )
        
        return UpdateSummariesResponse(
            success=True,
            message="Summary update task started",
            summaries_updated=0,
            task_id=task.id
        )
        
    except Exception as e:
        logger.error(f"Error updating summaries: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get(f"{settings.api_prefix}/get_summaries")
async def get_summaries(
    date: Optional[str] = None,
    chat_id: Optional[str] = None,
    supabase: SupabaseService = Depends(get_supabase_service)
):
    """
    Get chat summaries and daily digest
    
    Args:
        date: Optional date in ISO format (YYYY-MM-DD)
        chat_id: Optional chat ID to filter by
        
    Returns:
        Dictionary with daily digest and chat summaries
    """
    try:
        target_date = datetime.fromisoformat(date) if date else datetime.utcnow()
        
        # Get daily digest
        digest = await supabase.get_daily_digest(target_date)
        
        # Get chat summaries
        chat_ids = [chat_id] if chat_id else None
        summaries = await supabase.get_chat_summaries(
            date=target_date,
            chat_ids=chat_ids
        )
        
        return {
            "date": target_date.date().isoformat(),
            "daily_digest": digest,
            "chat_summaries": summaries,
            "total_chats": len(summaries)
        }
        
    except Exception as e:
        logger.error(f"Error getting summaries: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post(f"{settings.api_prefix}/handle_user_query", response_model=QueryResponse)
async def handle_user_query(
    query: UserQuery,
    supabase: SupabaseService = Depends(get_supabase_service),
    ai: AIService = Depends(get_ai_service)
):
    """
    Handle a user query using RAG over messages and summaries
    
    This endpoint:
    1. Retrieves relevant messages and summaries
    2. Uses AI to answer the query based on context
    3. Returns answer with sources
    
    Args:
        query: UserQuery with query text and optional filters
        
    Returns:
        QueryResponse with answer and sources
    """
    try:
        date = query.date or datetime.utcnow()
        
        # Get messages
        messages = await supabase.get_messages(
            start_date=date,
            chat_id=query.chat_ids[0] if query.chat_ids else None
        )
        
        # Get summaries
        summaries = await supabase.get_chat_summaries(
            date=date,
            chat_ids=query.chat_ids
        )
        
        # Use AI to answer query
        result = await ai.handle_query(
            query=query.query,
            messages=messages,
            summaries=summaries
        )
        
        return QueryResponse(**result)
        
    except Exception as e:
        logger.error(f"Error handling query: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get(f"{settings.api_prefix}/chats")
async def get_chats():
    """
    Get all WhatsApp chats from MCP server
    
    Returns:
        List of chat objects
    """
    try:
        async with MCPClient() as mcp:
            chats = await mcp.get_chats()
        
        return {
            "chats": chats,
            "total": len(chats)
        }
        
    except Exception as e:
        logger.error(f"Error getting chats: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get(f"{settings.api_prefix}/messages")
async def get_messages(
    chat_id: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    limit: int = 100
):
    """
    Get messages from MCP server
    
    Args:
        chat_id: Optional chat ID to filter by
        start_date: Optional start date (ISO format)
        end_date: Optional end date (ISO format)
        limit: Maximum number of messages to return
        
    Returns:
        List of message objects
    """
    try:
        async with MCPClient() as mcp:
            messages = await mcp.get_messages(
                chat_id=chat_id,
                start_date=start_date,
                end_date=end_date,
                limit=limit
            )
        
        return {
            "messages": messages,
            "total": len(messages)
        }
        
    except Exception as e:
        logger.error(f"Error getting messages: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get(f"{settings.api_prefix}/task_status/{{task_id}}")
async def get_task_status(task_id: str):
    """
    Get status of a background task
    
    Args:
        task_id: Celery task ID
        
    Returns:
        Task status information
    """
    from celery.result import AsyncResult
    
    task = AsyncResult(task_id)
    
    return {
        "task_id": task_id,
        "status": task.status,
        "result": task.result if task.ready() else None,
        "info": task.info
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True if settings.environment == "development" else False
    )
