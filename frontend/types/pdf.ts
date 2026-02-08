export interface PdfSession {
  id: string;
  userId?: string;
  originalFileName: string;
  originalFilePath?: string;
  optimizedFilePath?: string;
  pagesBefore: number;
  pagesAfter?: number;
  inkBefore: number;
  inkAfter?: number;
  optimizingScore?: number;
  suggestions?: string[];
  changesApplied?: string[];
  inkSaverLevel?: number;
  pageSaverLevel?: number;
  preserveQuality?: boolean;
  status: 'UPLOADED' | 'ANALYZING' | 'ANALYZED' | 'OPTIMIZING' | 'COMPLETE' | 'ERROR';
  createdAt: string;
  expiresAt?: string;
}

export interface OptimizeSettings {
  inkSaverLevel: number;      // 0-100
  pageSaverLevel: number;     // 0-100
  preserveQuality: boolean;
  excludeImages?: boolean;
}

export interface AnalysisResult {
  diagnosis: string[];
  recommendations: string[];
  estimatedSavings: {
    pages: number;
    inkPercent: number;
  };
  inkBefore: number;
  pagesBefore: number;
  optimizingScore: number;
}

export interface UploadResponse {
  sessionId: string;
  originalFileName: string;
  status: string;
}
