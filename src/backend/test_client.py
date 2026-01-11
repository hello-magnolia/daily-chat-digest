"""
Example client script to test the API
"""
import httpx
import asyncio
from datetime import datetime


BASE_URL = "http://localhost:8000"


async def test_health():
    """Test health endpoint"""
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}/health")
        print("Health Check:", response.json())


async def test_get_chats():
    """Test getting chats"""
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}/api/v1/chats")
        print("Chats:", response.json())


async def test_update_summaries():
    """Test updating summaries"""
    async with httpx.AsyncClient() as client:
        payload = {
            "date": datetime.utcnow().isoformat(),
            "force": True
        }
        response = await client.post(
            f"{BASE_URL}/api/v1/update_summaries",
            json=payload
        )
        print("Update Summaries:", response.json())


async def test_get_summaries():
    """Test getting summaries"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{BASE_URL}/api/v1/get_summaries",
            params={"date": datetime.utcnow().date().isoformat()}
        )
        print("Get Summaries:", response.json())


async def test_user_query():
    """Test user query"""
    async with httpx.AsyncClient() as client:
        payload = {
            "query": "What did we discuss today?",
            "date": datetime.utcnow().isoformat()
        }
        response = await client.post(
            f"{BASE_URL}/api/v1/handle_user_query",
            json=payload
        )
        print("User Query:", response.json())


async def main():
    print("=== Testing WhatsApp Digest API ===\n")
    
    print("1. Health Check")
    await test_health()
    print()
    
    print("2. Get Chats")
    await test_get_chats()
    print()
    
    print("3. Update Summaries")
    await test_update_summaries()
    print()
    
    print("4. Get Summaries")
    await test_get_summaries()
    print()
    
    print("5. User Query")
    await test_user_query()
    print()


if __name__ == "__main__":
    asyncio.run(main())
