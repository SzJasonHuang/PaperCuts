// API Configuration
const API_BASE = 'http://localhost:8080/api';

// State
let currentStep = 'upload';
let sessionId = null;
let sessionData = null;

// DOM Elements
const elements = {
  connectionStatus: document.getElementById('connection-status'),
  uploadStep: document.getElementById('upload-step'),
  resultsStep: document.getElementById('results-step'),
  previewStep: document.getElementById('preview-step'),
  errorState: document.getElementById('error-state'),
  dropZone: document.getElementById('drop-zone'),
  fileInput: document.getElementById('file-input'),
  uploadProgress: document.getElementById('upload-progress'),
  progressFill: document.querySelector('.progress-fill'),
  progressText: document.querySelector('.progress-text'),
  fileName: document.getElementById('file-name'),
  pagesCount: document.getElementById('pages-count'),
  inkUsage: document.getElementById('ink-usage'),
  optScore: document.getElementById('opt-score'),
  suggestionsList: document.getElementById('suggestions-list'),
  optimizeBtn: document.getElementById('optimize-btn'),
  pagesSaved: document.getElementById('pages-saved'),
  inkReduced: document.getElementById('ink-reduced'),
  reportPreview: document.getElementById('report-preview'),
  downloadOriginalBtn: document.getElementById('download-original-btn'),
  downloadReportBtn: document.getElementById('download-report-btn'),
  newBtn: document.getElementById('new-btn'),
  retryBtn: document.getElementById('retry-btn'),
  errorMessage: document.getElementById('error-message')
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  checkConnection();
  setupEventListeners();
});

// Check backend connection
async function checkConnection() {
  try {
    const response = await fetch(`${API_BASE}/health`, {
      signal: AbortSignal.timeout(5000)
    });
    if (response.ok) {
      elements.connectionStatus.textContent = '🟢 Connected';
      elements.connectionStatus.className = 'status connected';
    } else {
      throw new Error('Not OK');
    }
  } catch {
    elements.connectionStatus.textContent = '🔴 Offline';
    elements.connectionStatus.className = 'status offline';
  }
}

// Setup event listeners
function setupEventListeners() {
  // Drop zone
  elements.dropZone.addEventListener('click', () => elements.fileInput.click());
  elements.dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    elements.dropZone.classList.add('dragover');
  });
  elements.dropZone.addEventListener('dragleave', () => {
    elements.dropZone.classList.remove('dragover');
  });
  elements.dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    elements.dropZone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      handleFileUpload(file);
    }
  });

  // File input
  elements.fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleFileUpload(file);
  });

  // Buttons
  elements.optimizeBtn.addEventListener('click', handleOptimize);
  elements.downloadOriginalBtn.addEventListener('click', handleDownloadOriginal);
  elements.downloadReportBtn.addEventListener('click', handleDownloadReport);
  elements.newBtn.addEventListener('click', handleReset);
  elements.retryBtn.addEventListener('click', handleReset);
}

// Navigate to step
function goToStep(step) {
  currentStep = step;
  
  // Update step indicators
  document.querySelectorAll('.step').forEach(el => {
    const stepName = el.dataset.step;
    el.classList.remove('active', 'completed');
    
    const stepOrder = ['upload', 'results', 'preview'];
    const currentIndex = stepOrder.indexOf(step);
    const stepIndex = stepOrder.indexOf(stepName);
    
    if (stepIndex < currentIndex) {
      el.classList.add('completed');
    } else if (stepIndex === currentIndex) {
      el.classList.add('active');
    }
  });

  // Update connectors
  document.querySelectorAll('.step-connector').forEach((el, idx) => {
    const stepOrder = ['upload', 'results', 'preview'];
    el.classList.toggle('active', idx < stepOrder.indexOf(step));
  });

  // Show/hide content
  elements.uploadStep.classList.toggle('active', step === 'upload');
  elements.resultsStep.classList.toggle('active', step === 'results');
  elements.previewStep.classList.toggle('active', step === 'preview');
  elements.errorState.classList.add('hidden');
}

// Show error
function showError(message) {
  elements.errorMessage.textContent = message;
  elements.uploadStep.classList.remove('active');
  elements.resultsStep.classList.remove('active');
  elements.previewStep.classList.remove('active');
  elements.errorState.classList.remove('hidden');
}

// Handle file upload
async function handleFileUpload(file) {
  // Validate
  if (file.size > 50 * 1024 * 1024) {
    showError('File size exceeds 50MB limit');
    return;
  }

  // Show progress
  elements.uploadProgress.classList.remove('hidden');
  elements.progressFill.style.width = '30%';
  elements.progressText.textContent = 'Uploading...';

  try {
    // Upload
    const formData = new FormData();
    formData.append('file', file);

    const uploadResponse = await fetch(`${API_BASE}/pdf/upload`, {
      method: 'POST',
      body: formData
    });

    if (!uploadResponse.ok) {
      const error = await uploadResponse.json();
      throw new Error(error.error || 'Upload failed');
    }

    const uploadData = await uploadResponse.json();
    sessionId = uploadData.sessionId;

    // Analyze
    elements.progressFill.style.width = '60%';
    elements.progressText.textContent = 'Analyzing...';

    const analyzeResponse = await fetch(`${API_BASE}/pdf/${sessionId}/analyze`, {
      method: 'POST'
    });

    if (!analyzeResponse.ok) {
      throw new Error('Analysis failed');
    }

    const analysisData = await analyzeResponse.json();

    elements.progressFill.style.width = '100%';
    elements.progressText.textContent = 'Complete!';

    // Store session data
    sessionData = {
      fileName: uploadData.originalFileName,
      pagesBefore: analysisData.pagesBefore,
      inkBefore: analysisData.inkBefore,
      optimizingScore: analysisData.optimizingScore,
      suggestions: analysisData.recommendations || []
    };

    // Update UI
    setTimeout(() => {
      elements.uploadProgress.classList.add('hidden');
      elements.progressFill.style.width = '0%';
      populateResults();
      goToStep('results');
    }, 500);

  } catch (error) {
    console.error('Upload error:', error);
    elements.uploadProgress.classList.add('hidden');
    showError(error.message || 'Failed to upload PDF');
  }
}

// Populate results step
function populateResults() {
  elements.fileName.textContent = sessionData.fileName;
  elements.pagesCount.textContent = sessionData.pagesBefore || '--';
  elements.inkUsage.textContent = sessionData.inkBefore ? `${sessionData.inkBefore}%` : '--';
  elements.optScore.textContent = sessionData.optimizingScore ? `${sessionData.optimizingScore}%` : '--';

  // Suggestions
  elements.suggestionsList.innerHTML = '';
  const suggestions = sessionData.suggestions.slice(0, 3);
  suggestions.forEach(suggestion => {
    const div = document.createElement('div');
    div.className = 'suggestion';
    div.innerHTML = `<span class="suggestion-icon">💡</span><span>${suggestion}</span>`;
    elements.suggestionsList.appendChild(div);
  });
}

// Handle optimize
async function handleOptimize() {
  elements.optimizeBtn.disabled = true;
  elements.optimizeBtn.innerHTML = '<span>⏳</span> Generating...';

  try {
    const response = await fetch(`${API_BASE}/pdf/${sessionId}/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inkSaverLevel: 50,
        pageSaverLevel: 50,
        preserveQuality: true,
        excludeImages: false
      })
    });

    if (!response.ok) {
      throw new Error('Optimization failed');
    }

    const optimizedData = await response.json();

    // Update session data
    sessionData.pagesAfter = optimizedData.pagesAfter;
    sessionData.inkAfter = optimizedData.inkAfter;

    // Calculate savings
    const pagesSaved = (sessionData.pagesBefore || 0) - (sessionData.pagesAfter || 0);
    const inkReduced = sessionData.inkBefore && sessionData.inkAfter
      ? Math.round((1 - sessionData.inkAfter / sessionData.inkBefore) * 100)
      : 0;

    elements.pagesSaved.textContent = pagesSaved > 0 ? `-${pagesSaved}` : '0';
    elements.inkReduced.textContent = `${inkReduced}%`;

    // Load report preview
    await loadReportPreview();

    goToStep('preview');

  } catch (error) {
    console.error('Optimize error:', error);
    showError(error.message || 'Failed to generate report');
  } finally {
    elements.optimizeBtn.disabled = false;
    elements.optimizeBtn.innerHTML = '<span>🚀</span> Generate EcoPDF Report';
  }
}

// Load report preview
async function loadReportPreview() {
  try {
    const response = await fetch(`${API_BASE}/pdf/${sessionId}/report`);
    if (!response.ok) throw new Error('Failed to load report');
    
    const html = await response.text();
    
    const iframe = document.createElement('iframe');
    iframe.srcdoc = html;
    iframe.scrolling = 'no';
    iframe.style.overflow = 'hidden';
    
    elements.reportPreview.innerHTML = '';
    elements.reportPreview.appendChild(iframe);
  } catch (error) {
    console.error('Report load error:', error);
    elements.reportPreview.innerHTML = '<p style="padding: 20px; color: #64748b;">Could not load preview</p>';
  }
}

// Handle downloads
function handleDownloadOriginal() {
  if (sessionId) {
    window.open(`${API_BASE}/pdf/${sessionId}/original`, '_blank');
  }
}

function handleDownloadReport() {
  if (sessionId) {
    window.open(`${API_BASE}/pdf/${sessionId}/report/download`, '_blank');
  }
}

// Reset
function handleReset() {
  sessionId = null;
  sessionData = null;
  elements.fileInput.value = '';
  elements.uploadProgress.classList.add('hidden');
  elements.progressFill.style.width = '0%';
  goToStep('upload');
}
