# Paper Cuts Chrome Extension

A Chrome extension for AI-powered PDF optimization to reduce ink and paper usage.

## Installation

1. **Create icons** - Add icon files to the `icons/` folder:
   - `icon16.png` (16x16 pixels)
   - `icon48.png` (48x48 pixels)
   - `icon128.png` (128x128 pixels)

2. **Load the extension in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `extension/` folder

3. **Start the backend**:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

4. **Use the extension**:
   - Click the Paper Cuts icon in Chrome toolbar
   - Upload a PDF
   - View analysis and generate EcoPDF report

## Files

- `manifest.json` - Extension configuration (Manifest V3)
- `popup.html` - Extension popup UI
- `popup.css` - Styles
- `popup.js` - Popup logic and API calls
- `background.js` - Service worker for background tasks

## API Endpoints

The extension connects to the Spring Boot backend at `http://localhost:8080/api`:

- `POST /pdf/upload` - Upload PDF
- `POST /pdf/{id}/analyze` - Analyze PDF
- `POST /pdf/{id}/optimize` - Generate report
- `GET /pdf/{id}/report` - Get HTML report
- `GET /pdf/{id}/report/download` - Download report

## Customization

To point to a different backend, update `API_BASE` in:
- `popup.js`
- `background.js`
