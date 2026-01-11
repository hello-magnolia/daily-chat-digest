import pytest
import asyncio
from datetime import datetime
from models import Message, ChatSummary, UserQuery
from ai_service import AIService


@pytest.mark.asyncio
async def test_ai_service_initialization():
    """Test AI service initializes correctly"""
    ai = AIService()
    assert ai is not None


@pytest.mark.asyncio
async def test_generate_chat_summary_empty():
    """Test summary generation with no messages"""
    ai = AIService()
    summary = await ai.generate_chat_summary([], "Test Chat")
    
    assert summary.chat_id == "unknown"
    assert summary.message_count == 0
    assert len(summary.key_points) == 0


def test_message_model():
    """Test Message model"""
    msg = Message(
        id="msg1",
        chat_id="chat1",
        sender="Alice",
        timestamp=datetime.utcnow(),
        text="Hello world"
    )
    
    assert msg.id == "msg1"
    assert msg.sender == "Alice"
    assert msg.text == "Hello world"


def test_user_query_model():
    """Test UserQuery model"""
    query = UserQuery(
        query="What did we discuss?",
        date=datetime.utcnow()
    )
    
    assert query.query == "What did we discuss?"
    assert query.date is not None


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
