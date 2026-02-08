// Background service worker for Paper Cuts Chrome Extension
// Handles API proxying and extension lifecycle

const API_BASE = 'http://localhost:8080/api';

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'API_REQUEST') {
    handleApiRequest(request)
      .then(sendResponse)
      .catch(error => sendResponse({ error: error.message }));
    return true; // Keep channel open for async response
  }
  
  if (request.type === 'CHECK_HEALTH') {
    checkHealth()
      .then(sendResponse)
      .catch(() => sendResponse({ connected: false }));
    return true;
  }
});

// Handle API requests
async function handleApiRequest({ method, endpoint, body, formData }) {
  const url = `${API_BASE}${endpoint}`;
  
  const options = {
    method,
    headers: {}
  };

  if (formData) {
    // For file uploads, let browser set content-type with boundary
    options.body = formData;
  } else if (body) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch {
      // Ignore parse errors
    }
    throw new Error(errorMessage);
  }

  // Check content type for response handling
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return await response.json();
  } else if (contentType?.includes('text/html')) {
    return await response.text();
  } else {
    return await response.blob();
  }
}

// Check backend health
async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE}/health`, {
      signal: AbortSignal.timeout(5000)
    });
    return { connected: response.ok };
  } catch {
    return { connected: false };
  }
}

// Extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Paper Cuts extension installed');
  } else if (details.reason === 'update') {
    console.log('Paper Cuts extension updated');
  }
});
