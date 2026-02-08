import type { PdfSession, OptimizeSettings, AnalysisResult, UploadResponse } from '@/types/pdf';

// Toggle for mock vs real API
// Set to true for demo mode without backend, false for real backend
const USE_MOCK = import.meta.env.VITE_USE_MOCK === true || 'false';

// Base API URL - point to your Spring Boot backend
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';



// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to handle API errors
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch {
      // Ignore JSON parse errors
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

export const pdfApi = {
  /**
   * Check if backend is available
   */
  async checkHealth(): Promise<boolean> {
    
    try {
      const response = await fetch(`${API_BASE}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      return response.ok;
    } catch {
      return false;
    }
  },

  /**
   * Get current configuration
   */
  getConfig() {
    return {
      useMock: USE_MOCK,
      apiBase: API_BASE
    };
  },

  /**
   * Upload a PDF file
   */
  async uploadPdf(file: File, userId?: string): Promise<UploadResponse> {

    const formData = new FormData();
    formData.append('file', file);
    if (userId) formData.append('userId', userId);

    const response = await fetch(`${API_BASE}/pdf/upload`, {
      method: 'POST',
      body: formData
    });

    return handleResponse<UploadResponse>(response);
  },

  /**
   * Analyze an uploaded PDF
   */
  async analyzePdf(sessionId: string): Promise<AnalysisResult> {

    const response = await fetch(`${API_BASE}/pdf/${sessionId}/analyze`, {
      method: 'POST'
    });

    return handleResponse<AnalysisResult>(response);
  },

  /**
   * Optimize a PDF with given settings
   */
  async optimizePdf(sessionId: string, settings: OptimizeSettings): Promise<PdfSession> {

    const response = await fetch(`${API_BASE}/pdf/${sessionId}/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });

    return handleResponse<PdfSession>(response);
  },

  /**
   * Get session status and metrics
   */
  async getSession(sessionId: string): Promise<PdfSession> {

    const response = await fetch(`${API_BASE}/pdf/${sessionId}/status`);
    return handleResponse<PdfSession>(response);
  },

  /**
   * Get URL for original PDF
   */
  getOriginalPdfUrl(sessionId: string): string {
    return `${API_BASE}/pdf/${sessionId}/original`;
  },

  /**
   * Get URL for optimized PDF
   */
  getOptimizedPdfUrl(sessionId: string): string {
    return `${API_BASE}/pdf/${sessionId}/optimized`;
  },

  /**
   * Delete a session and its files
   */
  async deleteSession(sessionId: string): Promise<void> {

    const response = await fetch(`${API_BASE}/pdf/${sessionId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete session');
    }
  }
};
