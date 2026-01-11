from celery import Celery
from datetime import datetime
from config import get_settings

settings = get_settings()

# Initialize Celery
celery_app = Celery(
    "whatsapp_digest",
    broker=settings.redis_url,
    backend=settings.redis_url
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
)


@celery_app.task(name="update_summaries_task")
def update_summaries_task(date_str: str = None, chat_ids: list = None):
    """
    Background task to update summaries
    
    Args:
        date_str: Date string in ISO format
        chat_ids: List of chat IDs to update
    """
    import asyncio
    from datetime import datetime
    from mcp_client import MCPClient
    from supabase_service import SupabaseService
    from ai_service import AIService
    
    async def _update():
        date = datetime.fromisoformat(date_str) if date_str else datetime.utcnow()
        
        mcp = MCPClient()
        supabase = SupabaseService()
        ai = AIService()
        
        # Get messages from MCP
        messages = await mcp.get_messages(
            start_date=date.date().isoformat(),
            end_date=date.date().isoformat()
        )
        
        # Group by chat
        chats = {}
        for msg in messages:
            chat_id = msg["chat_id"]
            if chat_ids and chat_id not in chat_ids:
                continue
            if chat_id not in chats:
                chats[chat_id] = []
            chats[chat_id].append(msg)
        
        # Generate summaries
        summaries = []
        for chat_id, chat_messages in chats.items():
            summary = await ai.generate_chat_summary(
                chat_messages,
                chat_id
            )
            await supabase.store_chat_summary(summary)
            summaries.append(summary)
        
        # Generate daily digest
        if summaries:
            from models import DailyDigest
            overall = await ai.generate_daily_digest(summaries)
            
            digest = DailyDigest(
                date=date,
                overall_summary=overall,
                chat_summaries=summaries,
                highlights=[],
                total_messages=sum(s.message_count for s in summaries),
                total_chats=len(summaries)
            )
            
            await supabase.store_daily_digest(digest)
        
        return len(summaries)
    
    return asyncio.run(_update())


@celery_app.task(name="sync_messages_task")
def sync_messages_task():
    """Background task to sync messages from WhatsApp to Supabase"""
    import asyncio
    from mcp_client import MCPClient
    from supabase_service import SupabaseService
    
    async def _sync():
        mcp = MCPClient()
        supabase = SupabaseService()
        
        messages = await mcp.get_messages()
        count = await supabase.store_messages(messages)
        
        return count
    
    return asyncio.run(_sync())
