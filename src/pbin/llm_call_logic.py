import json
from typing import Any, Dict, List, Optional, Union
from anthropic import Anthropic
from dataclasses import dataclass
from abc import ABC, abstractmethod
from dotenv import load_dotenv

load_dotenv()

# Abstract base for tool connectors
class ToolConnector(ABC):
    @abstractmethod
    async def execute_tool(self, tool_name: str, parameters: Dict[str, Any]) -> Any:
        pass


# Placeholder MCP Connector
class MCPConnector(ToolConnector):
    def __init__(self, server_config: Optional[Dict] = None):
        """
        Initialize MCP connector with server configuration.
        In a real implementation, this would handle MCP server connections.
        """
        self.server_config = server_config or {}
        # Placeholder: In reality, would establish connection to MCP server(s)
        
    async def execute_tool(self, tool_name: str, parameters: Dict[str, Any]) -> Any:
        """
        Execute tool through MCP protocol.
        This is a placeholder - actual implementation would:
        1. Route to appropriate MCP server
        2. Execute tool call through MCP protocol
        3. Handle responses and errors
        """
        # Placeholder implementation
        return {
            "status": "success",
            "result": f"Executed {tool_name} via MCP with params: {parameters}",
            "mcp_server": "placeholder_server"
        }


# Native tool implementation example
class NativeToolConnector(ToolConnector):
    def __init__(self):
        # Define available native tools
        self.tools = {
            "get_weather": self._get_weather,
            "calculate": self._calculate,
        }
    
    async def execute_tool(self, tool_name: str, parameters: Dict[str, Any]) -> Any:
        if tool_name in self.tools:
            return await self.tools[tool_name](parameters)
        raise ValueError(f"Unknown tool: {tool_name}")
    
    async def _get_weather(self, params: Dict[str, Any]) -> str:
        location = params.get("location", "unknown")
        return f"Weather in {location}: Sunny, 72°F"
    
    async def _calculate(self, params: Dict[str, Any]) -> str:
        expression = params.get("expression", "")
        # Simple placeholder - in production use safe eval
        return f"Result of {expression}: 42"


class AnthropicToolExecutor:
    def __init__(self, api_key: str, use_mcp: bool = False):
        self.client = Anthropic(api_key=api_key)
        
        # Initialize appropriate tool connector
        if use_mcp:
            self.tool_connector = MCPConnector()
        else:
            self.tool_connector = NativeToolConnector()
        
        # Define available tools for Claude
        self.tool_definitions = [
            {
                "name": "get_weather",
                "description": "Get the current weather for a location",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "The city and state, e.g., San Francisco, CA"
                        }
                    },
                    "required": ["location"]
                }
            },
            {
                "name": "calculate",
                "description": "Perform a mathematical calculation",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "expression": {
                            "type": "string",
                            "description": "The mathematical expression to evaluate"
                        }
                    },
                    "required": ["expression"]
                }
            }
        ]
    
    async def make_request_with_tools(
        self,
        messages: List[Dict[str, str]],
        model: str = "claude-haiku-4-5-20251001",
        max_tokens: int = 1024,
        temperature: float = 0.7
    ) -> Dict[str, Any]:
        """
        Make a request to Anthropic API with tool execution support.
        Handles tool calls in the response and executes them.
        """
        
        conversation_messages = messages.copy()
        
        while True:
            # Make API call with tools
            response = self.client.messages.create(
                model=model,
                max_tokens=max_tokens,
                temperature=temperature,
                messages=conversation_messages,
                tools=self.tool_definitions
            )
            
            # Check if the response contains tool calls
            tool_calls = []
            final_text = []
            
            for content_block in response.content:
                if content_block.type == "tool_use":
                    tool_calls.append(content_block)
                elif content_block.type == "text":
                    final_text.append(content_block.text)
            
            # If no tool calls, return the response
            if not tool_calls:
                return {
                    "final_response": " ".join(final_text),
                    "tool_executions": [],
                    "usage": response.usage.model_dump() if response.usage else None
                }
            
            # Execute tool calls
            tool_results = []
            for tool_call in tool_calls:
                tool_name = tool_call.name
                tool_input = tool_call.input
                tool_id = tool_call.id
                
                try:
                    # Execute tool through the connector (MCP or native)
                    result = await self.tool_connector.execute_tool(
                        tool_name, 
                        tool_input
                    )
                    
                    tool_results.append({
                        "tool_use_id": tool_id,
                        "type": "tool_result",
                        "content": str(result)
                    })
                    
                except Exception as e:
                    tool_results.append({
                        "tool_use_id": tool_id,
                        "type": "tool_result",
                        "is_error": True,
                        "content": f"Error executing tool: {str(e)}"
                    })
            
            # Add assistant's message with tool use to conversation
            conversation_messages.append({
                "role": "assistant",
                "content": response.content
            })
            
            # Add tool results to conversation
            conversation_messages.append({
                "role": "user",
                "content": tool_results
            })
            
            # Continue the loop to get Claude's response after tool execution


# Example usage
async def main():
    import asyncio
    import os
    
    # Initialize with API key (use environment variable in production)
    api_key = os.getenv("ANTHROPIC_API_KEY")
    
    # Create executor with MCP support enabled
    executor = AnthropicToolExecutor(api_key=api_key, use_mcp=True)
    
    # Example conversation
    messages = [
        {
            "role": "user",
            "content": "What's the weather like in San Francisco, and can you calculate 15% tip on a $85 bill?"
        }
    ]
    
    # Make request with tool execution
    result = await executor.make_request_with_tools(messages)
    
    print("Final Response:", result["final_response"])
    print("\nTool Executions:", json.dumps(result.get("tool_executions", []), indent=2))
    print("\nUsage:", json.dumps(result.get("usage", {}), indent=2))


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())