import httpx
import json
from typing import Any, Optional
from config import get_settings

settings = get_settings()


class MCPClient:
    """Client for communicating with MCP (Model Context Protocol) server"""
    
    def __init__(self, server_url: str = None):
        self.server_url = server_url or settings.mcp_server_url
        self.client = httpx.AsyncClient(timeout=30.0)
        
    async def __aenter__(self):
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.client.aclose()
    
    async def get_messages(
        self, 
        chat_id: Optional[str] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        limit: int = 1000
    ) -> list[dict]:
        """
        Get messages from WhatsApp via MCP server
        
        Args:
            chat_id: Specific chat ID to filter by
            start_date: Start date in ISO format
            end_date: End date in ISO format
            limit: Maximum number of messages to retrieve
            
        Returns:
            List of message dictionaries
        """
        try:
            payload = {
                "method": "tools/call",
                "params": {
                    "name": "get_messages",
                    "arguments": {
                        "chat_id": chat_id,
                        "start_date": start_date,
                        "end_date": end_date,
                        "limit": limit
                    }
                }
            }
            
            response = await self.client.post(
                f"{self.server_url}/mcp",
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            response.raise_for_status()
            
            result = response.json()
            return result.get("result", {}).get("messages", [])
            
        except httpx.HTTPError as e:
            print(f"Error fetching messages from MCP server: {e}")
            return []
    
    async def get_chats(self) -> list[dict]:
        """
        Get all chats from WhatsApp via MCP server
        
        Returns:
            List of chat dictionaries
        """
        try:
            payload = {
                "method": "tools/call",
                "params": {
                    "name": "get_chats",
                    "arguments": {}
                }
            }
            
            response = await self.client.post(
                f"{self.server_url}/mcp",
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            response.raise_for_status()
            
            result = response.json()
            return result.get("result", {}).get("chats", [])
            
        except httpx.HTTPError as e:
            print(f"Error fetching chats from MCP server: {e}")
            return []
    
    async def send_message(self, chat_id: str, message: str) -> bool:
        """
        Send a message via WhatsApp MCP server
        
        Args:
            chat_id: Target chat ID
            message: Message text to send
            
        Returns:
            True if successful, False otherwise
        """
        try:
            payload = {
                "method": "tools/call",
                "params": {
                    "name": "send_message",
                    "arguments": {
                        "chat_id": chat_id,
                        "message": message
                    }
                }
            }
            
            response = await self.client.post(
                f"{self.server_url}/mcp",
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            response.raise_for_status()
            return True
            
        except httpx.HTTPError as e:
            print(f"Error sending message via MCP server: {e}")
            return False
    
    async def health_check(self) -> bool:
        """
        Check if MCP server is healthy
        
        Returns:
            True if healthy, False otherwise
        """
        try:
            response = await self.client.get(f"{self.server_url}/health")
            return response.status_code == 200
        except:
            return False
