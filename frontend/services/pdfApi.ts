import type { PdfSession, OptimizeSettings, AnalysisResult, UploadResponse } from '@/types/pdf';

// Toggle for mock vs real API
// Set to true for demo mode without backend, false for real backend
const USE_MOCK = true;

// Base API URL - point to your Spring Boot backend
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Mock data for development
const mockSession: PdfSession = {
  id: 'mock-session-123',
  originalFileName: 'document.pdf',
  pagesBefore: 42,
  pagesAfter: 39,
  inkBefore: 0.18,
  inkAfter: 0.12,
  optimizingScore: 82,
  suggestions: [
    'Margins are 1.5 inches - reducing to 0.75 inches could save 3 pages',
    '5 images exceed 300 DPI - compressing to 150 DPI reduces file size by 40%',
    'Background shading detected on 8 pages - removing saves 15% ink',
    'Large headers using 18pt font - 14pt would save space without losing readability'
  ],
  changesApplied: [
    'Reduced margins from 1.5" to 0.75"',
    'Compressed 5 images (40% size reduction)',
    'Converted background colors to white',
    'Optimized font rendering'
  ],
  status: 'COMPLETE',
  createdAt: new Date().toISOString()
};

const mockAnalysis: AnalysisResult = {
  diagnosis: [
    'Large margins detected (1.5 inches)',
    '5 high-resolution images (300+ DPI)',
    'Background shading on 8 pages',
    'Oversized header fonts (18pt)'
  ],
  recommendations: [
    'Reduce margins to save approximately 3 pages',
    'Compress images to reduce ink usage by 25%',
    'Remove background shading to save 15% ink',
    'Consider smaller fonts for headers'
  ],
  estimatedSavings: {
    pages: 3,
    inkPercent: 33
  },
  inkBefore: 0.18,
  pagesBefore: 42,
  optimizingScore: 82
};

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
    if (USE_MOCK) return true;
    
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
    if (USE_MOCK) {
      await delay(1500);
      return {
        sessionId: 'mock-session-123',
        originalFileName: file.name,
        status: 'UPLOADED'
      };
    }

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
    if (USE_MOCK) {
      await delay(2000);
      return mockAnalysis;
    }

    const response = await fetch(`${API_BASE}/pdf/${sessionId}/analyze`, {
      method: 'POST'
    });

    return handleResponse<AnalysisResult>(response);
  },

  /**
   * Optimize a PDF with given settings
   */
  async optimizePdf(sessionId: string, settings: OptimizeSettings): Promise<PdfSession> {
    if (USE_MOCK) {
      await delay(2500);
      return {
        ...mockSession,
        inkSaverLevel: settings.inkSaverLevel,
        pageSaverLevel: settings.pageSaverLevel,
        preserveQuality: settings.preserveQuality
      };
    }

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
    if (USE_MOCK) {
      await delay(500);
      return mockSession;
    }

    const response = await fetch(`${API_BASE}/pdf/${sessionId}/status`);
    return handleResponse<PdfSession>(response);
  },

  /**
   * Get URL for original PDF
   */
  getOriginalPdfUrl(sessionId: string): string {
    if (USE_MOCK) {
      return '/sample.pdf';
    }
    return `${API_BASE}/pdf/${sessionId}/original`;
  },

  /**
   * Get URL for optimized PDF
   */
  getOptimizedPdfUrl(sessionId: string): string {
    if (USE_MOCK) {
      return '/sample.pdf';
    }
    return `${API_BASE}/pdf/${sessionId}/optimized`;
  },

  /**
   * Delete a session and its files
   */
  async deleteSession(sessionId: string): Promise<void> {
    if (USE_MOCK) {
      await delay(300);
      return;
    }

    const response = await fetch(`${API_BASE}/pdf/${sessionId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete session');
    }
  }
};
