import { apiFetch } from './api';

// ==========================================
// TYPE DEFINITIONS
// ==========================================
export interface Message {
  id: number;
  conversation_id: number;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  created_at: string;
}

export interface Conversation {
  id: number;
  user_id: number;
  title: string;
  created_at: string;
}

export interface RAGResponse {
  question: string;
  answer: string;
  sources: string[];
}

// Helper untuk menangani parsing JSON dan error handling dari Fetch
async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Permintaan gagal dengan status ${response.status}`);
  }
  return response.json();
}

// ==========================================
// CHAT SERVICE IMPLEMENTATION
// ==========================================
export const chatService = {
  /**
   * Mengambil seluruh daftar percakapan milik user
   */
  getConversations: async (): Promise<Conversation[]> => {
    const res = await apiFetch('/conversations');
    return parseResponse<Conversation[]>(res);
  },

  /**
   * Membuat sesi percakapan baru
   */
  createConversation: async (title: string = 'Percakapan Baru'): Promise<Conversation> => {
    const res = await apiFetch('/conversations', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
    return parseResponse<Conversation>(res);
  },

  /**
   * Mengubah judul percakapan (Bonus Challenge)
   */
  renameConversation: async (id: number, title: string): Promise<Conversation> => {
    const res = await apiFetch(`/conversations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ title }),
    });
    return parseResponse<Conversation>(res);
  },

  /**
   * Menghapus percakapan berdasarkan ID
   */
  deleteConversation: async (id: number): Promise<{ message: string }> => {
    const res = await apiFetch(`/conversations/${id}`, {
      method: 'DELETE',
    });
    return parseResponse<{ message: string }>(res);
  },

  /**
   * Mengambil riwayat pesan dalam percakapan tertentu
   */
  getMessages: async (conversationId: number): Promise<Message[]> => {
    const res = await apiFetch(`/conversations/${conversationId}/messages`);
    return parseResponse<Message[]>(res);
  },

  /**
   * Mengirim pesan user dan menerima balasan dari AI
   */
  sendMessage: async (conversationId: number, content: string): Promise<Message> => {
    const res = await apiFetch(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
    return parseResponse<Message>(res);
  },

  /**
   * Menanyakan sesuatu ke RAG Knowledge Base (Sesi 9)
   */
  askAssistantRAG: async (question: string): Promise<RAGResponse> => {
    const res = await apiFetch('/assistant', {
      method: 'POST',
      body: JSON.stringify({ question }),
    });
    return parseResponse<RAGResponse>(res);
  },
};

export default chatService;