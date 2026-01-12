// Real API layer - connects to FastAPI backend

const API_URL = import.meta.env.VITE_API_URL || 'https://whatsapp-mcpj-production.up.railway.app';

// Response types from backend
export interface Contact {
  phone_number: string;
  name?: string;
  jid: string;
}

export interface Chat {
  jid: string;
  name?: string;
  last_message_time?: string;
  last_message?: string;
  last_sender?: string;
  last_is_from_me?: boolean;
  is_group: boolean;
}

export interface Message {
  id: string;
  timestamp: string;
  sender: string;
  content: string;
  is_from_me: boolean;
  chat_jid: string;
  chat_name?: string;
  media_type?: string;
}

export interface QRCodeResponse {
  qr?: string;
  authenticated: boolean;
  timestamp: string;
  message: string;
}

export interface ConnectionStatus {
  connected: boolean;
  authenticated: boolean;
  timestamp: string;
  message: string;
}

export interface AnalyzeResponse {
  query_type: string;
  period: string;
  messages_analyzed: number;
  analysis: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

// Helper function to handle API errors
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `API error: ${response.status}`);
  }
  return response.json();
}

/**
 * GET /api/qr
 * Get current QR code for WhatsApp login
 */
export async function getQRCode(): Promise<QRCodeResponse> {
  const response = await fetch(`${API_URL}/api/qr`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse<QRCodeResponse>(response);
}

/**
 * GET /api/status
 * Get WhatsApp connection status
 */
export async function getConnectionStatus(): Promise<ConnectionStatus> {
  const response = await fetch(`${API_URL}/api/status`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse<ConnectionStatus>(response);
}

/**
 * GET /chats
 * List all chats
 */
export async function listChats(limit: number = 50, page: number = 0): Promise<Chat[]> {
  const response = await fetch(`${API_URL}/chats?limit=${limit}&page=${page}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse<Chat[]>(response);
}

/**
 * GET /chats/{jid}
 * Get a specific chat by JID
 */
export async function getChat(jid: string): Promise<Chat> {
  const response = await fetch(`${API_URL}/chats/${jid}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse<Chat>(response);
}

/**
 * GET /chats/{jid}/messages
 * Get messages from a chat
 */
export async function getChatMessages(jid: string, limit: number = 50, page: number = 0): Promise<Message[]> {
  const response = await fetch(`${API_URL}/chats/${jid}/messages?limit=${limit}&page=${page}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse<Message[]>(response);
}

/**
 * POST /analyze/daily-summary
 * Get daily summary for a specific date
 */
export async function getDailySummary(date?: string): Promise<AnalyzeResponse> {
  const payload = { date: date || new Date().toISOString().split('T')[0] };
  const response = await fetch(`${API_URL}/analyze/daily-summary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<AnalyzeResponse>(response);
}

/**
 * POST /analyze/contact-summary/{jid}
 * Get conversation summary with a specific contact
 */
export async function getContactSummary(jid: string, days: number = 7, include_media: boolean = true): Promise<AnalyzeResponse> {
  const url = new URL(`${API_URL}/analyze/contact-summary/${jid}`);
  url.searchParams.append('days', days.toString());
  url.searchParams.append('include_media', include_media.toString());
  
  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse<AnalyzeResponse>(response);
}

/**
 * POST /analyze/search
 * Search messages semantically
 */
export async function searchMessages(query: string, chatJid?: string): Promise<Message[]> {
  const payload = {
    search_query: query,
    chat_jid: chatJid,
    max_messages: 100,
  };
  const response = await fetch(`${API_URL}/analyze/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<Message[]>(response);
}

/**
 * GET /contacts
 * Search for contacts
 */
export async function searchContacts(query?: string): Promise<Contact[]> {
  const url = new URL(`${API_URL}/contacts`);
  if (query) {
    url.searchParams.append('q', query);
  }
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse<Contact[]>(response);
}

/**
 * POST /messages/send
 * Send a message to a recipient
 */
export async function sendMessage(recipient: string, text: string): Promise<{ success: boolean; message: string }> {
  const payload = { recipient, text };
  const response = await fetch(`${API_URL}/messages/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}

/**
 * POST /analyze/query
 * Search across all conversations with AI analysis
 */
export async function analyzeQuery(
  customQuery: string, 
  maxMessages: number = 100
): Promise<AnalyzeResponse> {
  const payload = {
    query_type: "custom",
    custom_query: customQuery,
    max_messages: maxMessages
  };
  
  const response = await fetch(`${API_URL}/analyze/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<AnalyzeResponse>(response);
}

// Legacy mock functions - kept for backward compatibility (can be removed)
export async function postUserPrompt(content: string) {
  return { success: true, data: { id: '1', content, createdAt: new Date() } };
}

export async function getPrompt(id?: string) {
  return { success: true, data: null };
}

export async function updateSummary(chatId: string, content: string) {
  return { success: true, data: { id: '1', chatId, content, updatedAt: new Date() } };
}

export async function getSummary(chatId: string) {
  return { success: true, data: null };
}

export async function simulateQRScan() {
  return { success: true, status: 'scanned' };
}
