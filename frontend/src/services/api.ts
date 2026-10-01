import {
  ChatResponse,
  StandardItem,
  ProductSpecResponse,
  LaboratoryItem,
  DocumentAnalysisResponse
} from '../types';

const BASE_URL = '/api/v1';

export const api = {
  // Chat / RAG
  async sendChatMessage(message: string, language: string = 'en', conversationId?: string): Promise<ChatResponse> {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, language, conversation_id: conversationId }),
    });
    if (!res.ok) throw new Error(`Chat error: ${res.statusText}`);
    return res.json();
  },

  // Standards
  async searchStandards(q?: string, category?: string, mandatoryOnly?: boolean): Promise<{ total: number; standards: StandardItem[] }> {
    const params = new URLSearchParams();
    if (q) params.append('q', q);
    if (category && category !== 'all') params.append('category', category);
    if (mandatoryOnly) params.append('mandatory_only', 'true');

    const res = await fetch(`${BASE_URL}/standards/search?${params.toString()}`);
    if (!res.ok) throw new Error(`Standards search error: ${res.statusText}`);
    return res.json();
  },

  async getStandardById(id: string): Promise<StandardItem> {
    const res = await fetch(`${BASE_URL}/standards/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error(`Get standard error: ${res.statusText}`);
    return res.json();
  },

  // Recommendation Engine
  async recommendStandards(spec: {
    product_name: string;
    material?: string;
    power_wattage?: string;
    voltage?: string;
    intended_use?: string;
    capacity?: string;
  }): Promise<ProductSpecResponse> {
    const res = await fetch(`${BASE_URL}/standards/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(spec),
    });
    if (!res.ok) throw new Error(`Recommendation error: ${res.statusText}`);
    return res.json();
  },

  // Certification Roadmap
  async getCertificationRoadmap(product?: string): Promise<any> {
    const params = new URLSearchParams();
    if (product) params.append('product', product);
    const res = await fetch(`${BASE_URL}/certification/roadmap?${params.toString()}`);
    if (!res.ok) throw new Error(`Certification error: ${res.statusText}`);
    return res.json();
  },

  // Laboratories (LIMS)
  async getLaboratories(isNumber?: string, state?: string, labType?: string): Promise<{ total: number; laboratories: LaboratoryItem[] }> {
    const params = new URLSearchParams();
    if (isNumber) params.append('is_number', isNumber);
    if (state && state !== 'all') params.append('state', state);
    if (labType && labType !== 'all') params.append('lab_type', labType);

    const res = await fetch(`${BASE_URL}/laboratories?${params.toString()}`);
    if (!res.ok) throw new Error(`Laboratories search error: ${res.statusText}`);
    return res.json();
  },

  // Hallmarking
  async getHallmarkingOverview(): Promise<any> {
    const res = await fetch(`${BASE_URL}/hallmarking/overview`);
    if (!res.ok) throw new Error(`Hallmarking error: ${res.statusText}`);
    return res.json();
  },

  async verifyHuid(huid: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/hallmarking/verify-huid?huid=${encodeURIComponent(huid)}`);
    if (!res.ok) throw new Error(`HUID verification error: ${res.statusText}`);
    return res.json();
  },

  // Documents
  async analyzeDocumentFile(file: File): Promise<DocumentAnalysisResponse> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${BASE_URL}/documents/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error(`Document upload error: ${res.statusText}`);
    return res.json();
  },

  async analyzeDocumentText(title: string, textContent: string): Promise<DocumentAnalysisResponse> {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('text_content', textContent);
    const res = await fetch(`${BASE_URL}/documents/analyze-text`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error(`Document text analysis error: ${res.statusText}`);
    return res.json();
  },

  // System Analytics
  async getAnalytics(): Promise<any> {
    const res = await fetch(`${BASE_URL}/analytics/metrics`);
    if (!res.ok) throw new Error(`Analytics error: ${res.statusText}`);
    return res.json();
  }
};
