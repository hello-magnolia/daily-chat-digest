from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class Message(BaseModel):
    """WhatsApp message model"""
    id: str
    chat_id: str
    sender: str
    timestamp: datetime
    text: str
    

class Chat(BaseModel):
    """WhatsApp chat model"""
    id: str
    name: str
    is_group: bool
    participants: Optional[list[str]] = None
    avatar: Optional[str] = None


class ChatSummary(BaseModel):
    """Chat summary model"""
    chat_id: str
    summary: str
    key_points: list[str]
    notable_messages: list[Message]
    message_count: int
    created_at: datetime = Field(default_factory=datetime.utcnow)
    

class DailyDigest(BaseModel):
    """Daily digest model"""
    date: datetime
    overall_summary: str
    chat_summaries: list[ChatSummary]
    highlights: list[dict]
    total_messages: int
    total_chats: int
    created_at: datetime = Field(default_factory=datetime.utcnow)


class UserQuery(BaseModel):
    """User query model"""
    query: str
    date: Optional[datetime] = None
    chat_ids: Optional[list[str]] = None


class QueryResponse(BaseModel):
    """Query response model"""
    answer: str
    sources: list[dict]
    confidence: float = 1.0
    

class UpdateSummariesRequest(BaseModel):
    """Request to update summaries"""
    date: Optional[datetime] = None
    chat_ids: Optional[list[str]] = None
    force: bool = False


class UpdateSummariesResponse(BaseModel):
    """Response from update summaries"""
    success: bool
    message: str
    summaries_updated: int
    task_id: Optional[str] = None
