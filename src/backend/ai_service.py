from openai import AsyncOpenAI
from anthropic import AsyncAnthropic
from typing import Optional
from config import get_settings
from models import Message, ChatSummary

settings = get_settings()


class AIService:
    """Service for AI-powered summarization and query handling"""
    
    def __init__(self):
        self.openai_client = None
        self.anthropic_client = None
        
        if settings.openai_api_key:
            self.openai_client = AsyncOpenAI(api_key=settings.openai_api_key)
        
        if settings.anthropic_api_key:
            self.anthropic_client = AsyncAnthropic(api_key=settings.anthropic_api_key)
    
    async def generate_chat_summary(
        self, 
        messages: list[dict],
        chat_name: str
    ) -> ChatSummary:
        """
        Generate a summary for a chat using AI
        
        Args:
            messages: List of message dictionaries
            chat_name: Name of the chat
            
        Returns:
            ChatSummary object
        """
        if not messages:
            return ChatSummary(
                chat_id=messages[0]["chat_id"] if messages else "unknown",
                summary="No messages to summarize.",
                key_points=[],
                notable_messages=[],
                message_count=0
            )
        
        # Format messages for AI
        formatted_messages = "\n".join([
            f"{msg['sender']} ({msg['timestamp']}): {msg['text']}"
            for msg in messages
        ])
        
        prompt = f"""Analyze the following WhatsApp chat messages from "{chat_name}" and provide:

1. A concise summary (2-3 sentences)
2. Key points (3-5 bullet points)
3. Identify 2-3 most important/notable messages

Chat messages:
{formatted_messages}

Respond in JSON format:
{{
  "summary": "...",
  "key_points": ["...", "..."],
  "notable_message_ids": ["...", "..."]
}}"""

        try:
            if self.openai_client:
                response = await self.openai_client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": "You are a helpful assistant that summarizes WhatsApp conversations."},
                        {"role": "user", "content": prompt}
                    ],
                    response_format={"type": "json_object"},
                    temperature=0.3
                )
                
                result = response.choices[0].message.content
                import json
                parsed = json.loads(result)
                
                # Find notable messages
                notable_message_ids = parsed.get("notable_message_ids", [])
                notable_messages = [
                    Message(**msg) for msg in messages 
                    if msg["id"] in notable_message_ids
                ][:3]
                
                return ChatSummary(
                    chat_id=messages[0]["chat_id"],
                    summary=parsed.get("summary", ""),
                    key_points=parsed.get("key_points", []),
                    notable_messages=notable_messages,
                    message_count=len(messages)
                )
            
            elif self.anthropic_client:
                response = await self.anthropic_client.messages.create(
                    model="claude-3-5-sonnet-20241022",
                    max_tokens=1024,
                    messages=[
                        {"role": "user", "content": prompt}
                    ]
                )
                
                result = response.content[0].text
                import json
                parsed = json.loads(result)
                
                notable_message_ids = parsed.get("notable_message_ids", [])
                notable_messages = [
                    Message(**msg) for msg in messages 
                    if msg["id"] in notable_message_ids
                ][:3]
                
                return ChatSummary(
                    chat_id=messages[0]["chat_id"],
                    summary=parsed.get("summary", ""),
                    key_points=parsed.get("key_points", []),
                    notable_messages=notable_messages,
                    message_count=len(messages)
                )
            
            else:
                # Fallback: basic summary
                return ChatSummary(
                    chat_id=messages[0]["chat_id"],
                    summary=f"Chat with {len(messages)} messages from {chat_name}.",
                    key_points=[f"Total messages: {len(messages)}"],
                    notable_messages=[Message(**messages[0])] if messages else [],
                    message_count=len(messages)
                )
                
        except Exception as e:
            print(f"Error generating summary: {e}")
            return ChatSummary(
                chat_id=messages[0]["chat_id"],
                summary=f"Error generating summary: {str(e)}",
                key_points=[],
                notable_messages=[],
                message_count=len(messages)
            )
    
    async def generate_daily_digest(
        self, 
        chat_summaries: list[ChatSummary]
    ) -> str:
        """
        Generate an overall daily digest from chat summaries
        
        Args:
            chat_summaries: List of ChatSummary objects
            
        Returns:
            Overall digest text
        """
        if not chat_summaries:
            return "No activity today."
        
        summaries_text = "\n\n".join([
            f"**{i+1}. Chat ID: {s.chat_id}**\n{s.summary}\nKey points:\n" + 
            "\n".join([f"- {kp}" for kp in s.key_points])
            for i, s in enumerate(chat_summaries)
        ])
        
        total_messages = sum(s.message_count for s in chat_summaries)
        
        prompt = f"""Create a cohesive daily digest from these chat summaries. 
Make it engaging and highlight the most important information.

Total messages today: {total_messages}
Total chats: {len(chat_summaries)}

Chat summaries:
{summaries_text}

Create a 2-3 paragraph digest that flows naturally."""

        try:
            if self.openai_client:
                response = await self.openai_client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": "You are a helpful assistant that creates engaging daily digests."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.5
                )
                
                return response.choices[0].message.content
            
            elif self.anthropic_client:
                response = await self.anthropic_client.messages.create(
                    model="claude-3-5-sonnet-20241022",
                    max_tokens=2048,
                    messages=[
                        {"role": "user", "content": prompt}
                    ]
                )
                
                return response.content[0].text
            
            else:
                return f"Today you had {total_messages} messages across {len(chat_summaries)} chats."
                
        except Exception as e:
            print(f"Error generating digest: {e}")
            return f"Daily summary: {total_messages} messages across {len(chat_summaries)} chats."
    
    async def handle_query(
        self, 
        query: str,
        messages: list[dict],
        summaries: list[dict]
    ) -> dict:
        """
        Handle a user query using RAG over messages and summaries
        
        Args:
            query: User's question
            messages: Relevant messages
            summaries: Relevant summaries
            
        Returns:
            Dictionary with answer and sources
        """
        # Format context
        context_messages = "\n".join([
            f"{msg['sender']}: {msg['text']}"
            for msg in messages[:50]  # Limit context
        ])
        
        context_summaries = "\n\n".join([
            f"Chat {s['chat_id']}:\n{s['summary']}"
            for s in summaries
        ])
        
        prompt = f"""Answer the user's question based on their WhatsApp messages and summaries.

Question: {query}

Summaries:
{context_summaries}

Recent messages:
{context_messages}

Provide a helpful, concise answer. If you can't find the information, say so."""

        try:
            if self.openai_client:
                response = await self.openai_client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": "You are a helpful assistant that answers questions about WhatsApp conversations."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.3
                )
                
                answer = response.choices[0].message.content
                
            elif self.anthropic_client:
                response = await self.anthropic_client.messages.create(
                    model="claude-3-5-sonnet-20241022",
                    max_tokens=1024,
                    messages=[
                        {"role": "user", "content": prompt}
                    ]
                )
                
                answer = response.content[0].text
            
            else:
                answer = "AI service not configured. Please set OPENAI_API_KEY or ANTHROPIC_API_KEY."
            
            # Format sources
            sources = []
            chat_ids = set(msg["chat_id"] for msg in messages)
            for chat_id in list(chat_ids)[:5]:
                chat_messages = [m for m in messages if m["chat_id"] == chat_id][:3]
                sources.append({
                    "chat_id": chat_id,
                    "messages": chat_messages
                })
            
            return {
                "answer": answer,
                "sources": sources,
                "confidence": 0.8
            }
            
        except Exception as e:
            print(f"Error handling query: {e}")
            return {
                "answer": f"Error processing query: {str(e)}",
                "sources": [],
                "confidence": 0.0
            }
