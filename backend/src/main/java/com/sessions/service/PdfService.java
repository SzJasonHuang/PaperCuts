package com.sessions.service;

import com.sessions.model.PdfSession;
import com.sessions.repository.PdfSessionRepository;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.file.*;
import java.time.Instant;
import java.util.*;

import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Part;

// Use Builder class for instantiation. Explicitly set the API key to use Gemini
// Developer backend.


@Service
public class PdfService {
    
    @Autowired
    private PdfSessionRepository pdfSessionRepository;
    
    @Value("${pdf.storage.path:./pdf-storage}")
    private String storagePath;

    @Value("${gemini.api.key}")
    private String geminiKey;

    private Client geminiClient;

    private Client getClient() {
    if (geminiClient == null) {
        if (geminiKey == null || geminiKey.isEmpty()) {
            throw new RuntimeException("GEMINI_API_KEY is not set");
        }
        geminiClient = Client.builder().apiKey(geminiKey).build();
    }
    return geminiClient;
}

    /**
     * Upload and store a PDF file
     */
    public PdfSession uploadPdf(MultipartFile file) throws IOException {
        // Create storage directory if it doesn't exist
        Path storageDir = Paths.get(storagePath);
        if (!Files.exists(storageDir)) {
            Files.createDirectories(storageDir);
        }
        
        // Generate unique filename
        String fileId = UUID.randomUUID().toString();
        String originalFileName = file.getOriginalFilename();
        String storedFileName = fileId + "_original.pdf";
        Path filePath = storageDir.resolve(storedFileName);
        
        // Save file
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        // Create session record
        PdfSession session = new PdfSession();
        session.setOriginalFileName(originalFileName);
        session.setOriginalFilePath(filePath.toString());
        session.setStatus("UPLOADED");
        
        return pdfSessionRepository.save(session);
    }
    
    /**
     * Analyze a PDF and calculate metrics
     */
    public PdfSession analyzePdf(String sessionId) throws IOException {
        PdfSession session = pdfSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found: " + sessionId));
        
        session.setStatus("ANALYZING");
        pdfSessionRepository.save(session);
        
        try (PDDocument document = Loader.loadPDF(new File(session.getOriginalFilePath()))) {
            // Get page count
            int pageCount = document.getNumberOfPages();
            session.setPagesBefore(pageCount);
            
            // Calculate ink usage
            double inkUsage = calculateInkUsage(document);
            session.setInkBefore(inkUsage);
            
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            document.save(baos);

            Content content =
            Content.fromParts(
            Part.fromText("Suggest three ways this pdf could be edited to improve ink and page usage, for sustainability purposes. Additionally, don't use any markdown and maximum 40 words. Divide reasons with the string $NEWLINE$"),
            Part.fromBytes(baos.toByteArray(),"application/pdf"));
            
        
            GenerateContentResponse response =
            getClient().models.generateContent("gemini-2.5-flash", content, null);

            // Generate AI suggestions based on document analysis
            List<String> suggestions = Arrays.asList(response.text().split("\\$NEWLINE\\$"));
            session.setSuggestions(suggestions);


            content =
            Content.fromParts(
            Part.fromText("Give this document a score out of 100 points, taking into consideration effective page use and ink conservation from an a sustainability standpoint. Return the score as a whole number with NO OTHER TEXT."),
            Part.fromBytes(baos.toByteArray(),"application/pdf"));


            response =
            getClient().models.generateContent("gemini-2.5-flash", content, null);
            
            int score = 50;
            try {
                score = Integer.parseInt(response.text());
            } catch (Exception e) {}
            session.setOptimizingScore(score);
            
            session.setStatus("ANALYZED");
            return pdfSessionRepository.save(session);
        } catch (Exception e) {
            session.setStatus("ERROR");
            pdfSessionRepository.save(session);
            throw new IOException("Failed to analyze PDF: " + e.getMessage(), e);
        }
    }
    
    /**
     * Generate HTML report with optimization recommendations
     */
    public PdfSession optimizePdf(String sessionId, Integer inkSaverLevel, Integer pageSaverLevel, 
                                   Boolean preserveQuality, Boolean excludeImages) throws IOException {
        PdfSession session = pdfSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found: " + sessionId));
        
        session.setStatus("OPTIMIZING");
        session.setInkSaverLevel(inkSaverLevel);
        session.setPageSaverLevel(pageSaverLevel);
        session.setPreserveQuality(preserveQuality);
        session.setExcludeImages(excludeImages);
        pdfSessionRepository.save(session);
        
        try (PDDocument document = Loader.loadPDF(new File(session.getOriginalFilePath()))) {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            document.save(baos);

            // Generate HTML report with 3 specific edits
            String prompt = """
                Analyze this PDF and create an HTML5 document imitation with exactly 3 specific edits to reduce ink and page usage.
                
                Return ONLY a valid standalone HTML5 document with this structure, try to imitate my input pdf file with the changes applied and generate an html file back
                 <!DOCTYPE html>.
                """;

            Content content = Content.fromParts(
                Part.fromText(prompt),
                Part.fromBytes(baos.toByteArray(), "application/pdf")
            );

            GenerateContentResponse response = getClient().models.generateContent("gemini-2.5-flash", content, null);

            // Save HTML report
            String reportFileName = session.getId() + "_report.html";
            Path reportPath = Paths.get(storagePath).resolve(reportFileName);
            
            String cleanedHtml = sanitizeHtmlResponse(response.text());
            Files.writeString(reportPath, cleanedHtml);
            
            // Store report path (reusing optimizedFilePath field)
            session.setOptimizedFilePath(reportPath.toString());
            session.setPagesAfter(document.getNumberOfPages());
            
            // Estimate savings based on analysis
            double inkSavings = 0.15 + (inkSaverLevel != null ? inkSaverLevel * 0.002 : 0);
            session.setInkAfter(session.getInkBefore() * (1 - inkSavings));
            
            List<String> changesApplied = new ArrayList<>();
            changesApplied.add("Generated optimization report with 3 recommendations");
            session.setChangesApplied(changesApplied);
            session.setStatus("COMPLETE");
            
            return pdfSessionRepository.save(session);
        } catch (Exception e) {
            session.setStatus("ERROR");
            pdfSessionRepository.save(session);
            throw new IOException("Failed to generate report: " + e.getMessage(), e);
        }
    }
    
    /**
     * Get HTML report content
     */
    public String getReportHtml(String sessionId) throws IOException {
        PdfSession session = pdfSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found: " + sessionId));
        
        if (session.getOptimizedFilePath() == null) {
            throw new RuntimeException("Report not generated yet");
        }
        
        return Files.readString(Paths.get(session.getOptimizedFilePath()));
    }
    
    /**
     * Get PDF bytes for download
     */
    public byte[] getPdfBytes(String sessionId, String type) throws IOException {
        PdfSession session = pdfSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found: " + sessionId));
        
        String filePath = "original".equals(type) 
                ? session.getOriginalFilePath() 
                : session.getOptimizedFilePath();
        
        if (filePath == null) {
            throw new RuntimeException("File not found for type: " + type);
        }
        
        return Files.readAllBytes(Paths.get(filePath));
    }
    
    /**
     * Delete session and associated files
     */
    public void deleteSession(String sessionId) throws IOException {
        PdfSession session = pdfSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found: " + sessionId));
        
        // Delete files
        if (session.getOriginalFilePath() != null) {
            Files.deleteIfExists(Paths.get(session.getOriginalFilePath()));
        }
        if (session.getOptimizedFilePath() != null) {
            Files.deleteIfExists(Paths.get(session.getOptimizedFilePath()));
        }
        
        // Delete session record
        pdfSessionRepository.deleteById(sessionId);
    }
    
    /**
     * Clean up expired sessions
     */
    public void cleanupExpiredSessions() {
        List<PdfSession> expired = pdfSessionRepository.findByExpiresAtBefore(Instant.now());
        for (PdfSession session : expired) {
            try {
                deleteSession(session.getId());
            } catch (IOException e) {
                System.err.println("Failed to delete expired session: " + session.getId());
            }
        }
    }
    
    // ========== Private Helper Methods ==========
    
    /**
     * Sanitize AI response to extract clean HTML
     * Removes markdown formatting and extracts HTML content
     */
    private String sanitizeHtmlResponse(String response) {
        if (response == null || response.isEmpty()) {
            return response;
        }
        
        String cleaned = response;
        
        // Remove markdown code block markers
        cleaned = cleaned.replaceAll("```html\\s*", "");
        cleaned = cleaned.replaceAll("```HTML\\s*", "");
        cleaned = cleaned.replaceAll("```\\s*", "");
        
        // Trim whitespace
        cleaned = cleaned.trim();
        
        // Try to extract just the HTML document if there's extra text
        int doctypeIndex = cleaned.toLowerCase().indexOf("<!doctype");
        int htmlStartIndex = cleaned.toLowerCase().indexOf("<html");
        int htmlEndIndex = cleaned.toLowerCase().lastIndexOf("</html>");
        
        int startIndex = -1;
        if (doctypeIndex >= 0) {
            startIndex = doctypeIndex;
        } else if (htmlStartIndex >= 0) {
            startIndex = htmlStartIndex;
        }
        
        if (startIndex >= 0 && htmlEndIndex > startIndex) {
            cleaned = cleaned.substring(startIndex, htmlEndIndex + 7); // 7 = length of "</html>"
        }
        
        return cleaned;
    }
    
    /**
     * Calculate ink usage by rendering pages and measuring darkness
     */
    private double calculateInkUsage(PDDocument document) {
        try {
            PDFRenderer renderer = new PDFRenderer(document);
            double totalInk = 0.0;
            int pageCount = document.getNumberOfPages();
            
            // Sample first 10 pages max for performance
            int samplesToTake = Math.min(pageCount, 10);
            
            for (int i = 0; i < samplesToTake; i++) {
                // Render at 72 DPI for speed
                BufferedImage image = renderer.renderImageWithDPI(i, 72);
                double pageInk = calculateImageDarkness(image);
                totalInk += pageInk;
            }
            
            // Extrapolate for remaining pages
            if (pageCount > samplesToTake) {
                double avgInkPerPage = totalInk / samplesToTake;
                totalInk = avgInkPerPage * pageCount;
            }
            
            // Normalize to 0-1 range
            return Math.min(1.0, totalInk / pageCount);
        } catch (Exception e) {
            // Default fallback
            return 0.15;
        }
    }
    
    /**
     * Calculate darkness/ink coverage of an image
     */
    private double calculateImageDarkness(BufferedImage image) {
        long totalDarkness = 0;
        int width = image.getWidth();
        int height = image.getHeight();
        int totalPixels = width * height;
        
        // Sample every 4th pixel for performance
        for (int y = 0; y < height; y += 4) {
            for (int x = 0; x < width; x += 4) {
                int rgb = image.getRGB(x, y);
                int r = (rgb >> 16) & 0xFF;
                int g = (rgb >> 8) & 0xFF;
                int b = rgb & 0xFF;
                
                // Calculate grayscale brightness
                int brightness = (r + g + b) / 3;
                // Ink = 1 - brightness (darker = more ink)
                totalDarkness += (255 - brightness);
            }
        }
        
        // Normalize
        int sampledPixels = (width / 4) * (height / 4);
        return (totalDarkness / (double) sampledPixels) / 255.0;
    }
    
    
    
   
   
}
