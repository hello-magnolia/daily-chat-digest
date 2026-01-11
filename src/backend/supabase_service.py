from supabase import create_client, Client
from datetime import datetime
from typing import Optional
from config import get_settings
from models import ChatSummary, DailyDigest

settings = get_settings()


class SupabaseService:
    """Service for interacting with Supabase"""
    
    def __init__(self):
        self.client: Client = create_client(
            settings.supabase_url,
            settings.supabase_key
        )
    
    async def store_chat_summary(self, summary: ChatSummary) -> dict:
        """
        Store or update a chat summary in Supabase
        
        Args:
            summary: ChatSummary object to store
            
        Returns:
            Stored summary data
        """
        data = {
            "chat_id": summary.chat_id,
            "summary": summary.summary,
            "key_points": summary.key_points,
            "notable_messages": [msg.model_dump() for msg in summary.notable_messages],
            "message_count": summary.message_count,
            "created_at": summary.created_at.isoformat(),
            "date": summary.created_at.date().isoformat()
        }
        
        # Upsert (insert or update)
        result = self.client.table("chat_summaries").upsert(
            data,
            on_conflict="chat_id,date"
        ).execute()
        
        return result.data[0] if result.data else {}
    
    async def get_chat_summaries(
        self, 
        date: Optional[datetime] = None,
        chat_ids: Optional[list[str]] = None
    ) -> list[dict]:
        """
        Get chat summaries from Supabase
        
        Args:
            date: Filter by specific date
            chat_ids: Filter by specific chat IDs
            
        Returns:
            List of chat summary dictionaries
        """
        query = self.client.table("chat_summaries").select("*")
        
        if date:
            query = query.eq("date", date.date().isoformat())
        
        if chat_ids:
            query = query.in_("chat_id", chat_ids)
        
        result = query.order("created_at", desc=True).execute()
        return result.data
    
    async def store_daily_digest(self, digest: DailyDigest) -> dict:
        """
        Store a daily digest in Supabase
        
        Args:
            digest: DailyDigest object to store
            
        Returns:
            Stored digest data
        """
        data = {
            "date": digest.date.date().isoformat(),
            "overall_summary": digest.overall_summary,
            "chat_summaries": [s.model_dump() for s in digest.chat_summaries],
            "highlights": digest.highlights,
            "total_messages": digest.total_messages,
            "total_chats": digest.total_chats,
            "created_at": digest.created_at.isoformat()
        }
        
        result = self.client.table("daily_digests").upsert(
            data,
            on_conflict="date"
        ).execute()
        
        return result.data[0] if result.data else {}
    
    async def get_daily_digest(self, date: datetime) -> Optional[dict]:
        """
        Get daily digest for a specific date
        
        Args:
            date: Date to retrieve digest for
            
        Returns:
            Daily digest dictionary or None
        """
        result = self.client.table("daily_digests").select("*").eq(
            "date", 
            date.date().isoformat()
        ).execute()
        
        return result.data[0] if result.data else None
    
    async def store_messages(self, messages: list[dict]) -> int:
        """
        Store messages in Supabase
        
        Args:
            messages: List of message dictionaries
            
        Returns:
            Number of messages stored
        """
        if not messages:
            return 0
        
        result = self.client.table("messages").upsert(
            messages,
            on_conflict="id"
        ).execute()
        
        return len(result.data) if result.data else 0
    
    async def get_messages(
        self,
        chat_id: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        limit: int = 1000
    ) -> list[dict]:
        """
        Get messages from Supabase
        
        Args:
            chat_id: Filter by chat ID
            start_date: Filter by start date
            end_date: Filter by end date
            limit: Maximum number of messages
            
        Returns:
            List of message dictionaries
        """
        query = self.client.table("messages").select("*")
        
        if chat_id:
            query = query.eq("chat_id", chat_id)
        
        if start_date:
            query = query.gte("timestamp", start_date.isoformat())
        
        if end_date:
            query = query.lte("timestamp", end_date.isoformat())
        
        result = query.order("timestamp", desc=True).limit(limit).execute()
        return result.data
