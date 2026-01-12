// Mock API layer - simulates backend endpoints
// Can be replaced with real API calls when backend is connected

interface Prompt {
  id: string;
  content: string;
  createdAt: Date;
}

interface Summary {
  id: string;
  chatId: string;
  content: string;
  updatedAt: Date;
}

interface QRCodeData {
  code: string;
  expiresAt: Date;
  status: 'pending' | 'scanned' | 'connected';
}

const API_BASE_URL =
  (import.meta as { env?: Record<string, string> }).env?.VITE_API_URL ||
  "https://whatsapp-mcpj-production.up.railway.app";

// In-memory storage (simulates database)
let prompts: Prompt[] = [];
let summaries: Summary[] = [];
let currentQR: QRCodeData | null = null;

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * POST /user_prompt
 * Submit a new user prompt
 */
export async function postUserPrompt(content: string): Promise<{ success: boolean; data: Prompt }> {
  await delay(300); // Simulate network latency
  
  const newPrompt: Prompt = {
    id: generateId(),
    content,
    createdAt: new Date(),
  };
  
  prompts.push(newPrompt);
  console.log('[API] POST user_prompt:', newPrompt);
  
  return { success: true, data: newPrompt };
}

/**
 * GET /get_prompt
 * Retrieve all stored prompts or a specific one by ID
 */
export async function getPrompt(id?: string): Promise<{ success: boolean; data: Prompt | Prompt[] | null }> {
  await delay(200);
  
  if (id) {
    const prompt = prompts.find(p => p.id === id) || null;
    console.log('[API] GET get_prompt (by id):', prompt);
    return { success: true, data: prompt };
  }
  
  console.log('[API] GET get_prompt (all):', prompts);
  return { success: true, data: [...prompts] };
}

/**
 * POST /update_summ
 * Create or update a summary for a chat
 */
export async function updateSummary(chatId: string, content: string): Promise<{ success: boolean; data: Summary }> {
  await delay(300);
  
  const existingIndex = summaries.findIndex(s => s.chatId === chatId);
  
  const summary: Summary = {
    id: existingIndex >= 0 ? summaries[existingIndex].id : generateId(),
    chatId,
    content,
    updatedAt: new Date(),
  };
  
  if (existingIndex >= 0) {
    summaries[existingIndex] = summary;
  } else {
    summaries.push(summary);
  }
  
  console.log('[API] POST update_summ:', summary);
  return { success: true, data: summary };
}

/**
 * GET /get_qr_code
 * Generate or retrieve current QR code for WhatsApp connection
 */
export async function getQRCode(): Promise<{ success: boolean; data: QRCodeData }> {
  const response = await fetch(`${API_BASE_URL}/api/qr`);
  if (!response.ok) {
    throw new Error(`Failed to fetch QR code: ${response.status}`);
  }

  const payload = await response.json();
  const data = payload.data ?? payload;
  const expiresAt = data.expires_at ? new Date(data.expires_at) : new Date(Date.now() + 5 * 60 * 1000);

  const qrData: QRCodeData = {
    code: data.code || data.qr || "",
    expiresAt,
    status: data.status || "pending",
  };

  console.log('[API] GET /api/qr:', qrData);
  return { success: true, data: qrData };
}

/**
 * Utility: Simulate QR code being scanned
 */
export async function simulateQRScan(): Promise<{ success: boolean; status: string }> {
  await delay(500);
  
  if (currentQR) {
    currentQR.status = 'scanned';
    setTimeout(() => {
      if (currentQR) currentQR.status = 'connected';
    }, 1500);
  }
  
  return { success: true, status: 'scanned' };
}

/**
 * GET /get_summary
 * Retrieve summary for a specific chat
 */
export async function getSummary(chatId: string): Promise<{ success: boolean; data: Summary | null }> {
  await delay(200);
  
  const summary = summaries.find(s => s.chatId === chatId) || null;
  console.log('[API] GET get_summary:', summary);
  return { success: true, data: summary };
}

// Export types for use in components
export type { Prompt, Summary, QRCodeData };
