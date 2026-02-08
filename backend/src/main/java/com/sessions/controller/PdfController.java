package com.sessions.controller;

import com.sessions.dto.OptimizeRequest;
import com.sessions.model.PdfSession;
import com.sessions.repository.PdfSessionRepository;
import com.sessions.service.PdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/pdf")
@CrossOrigin(origins = "*")
public class PdfController {
    
    @Autowired
    private PdfService pdfService;
    
    @Autowired
    private PdfSessionRepository pdfSessionRepository;
    
    /**
     * POST /api/pdf/upload
     * Upload a PDF file
     */
    @PostMapping("/upload")
    public ResponseEntity<?> uploadPdf(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "userId", required = false) String userId) {
        
        // Validate file
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No file provided"));
        }
        
        String contentType = file.getContentType();
        if (contentType == null || !contentType.equals("application/pdf")) {
            return ResponseEntity.badRequest().body(Map.of("error", "File must be a PDF"));
        }
        
        // Check file size (50MB max)
        if (file.getSize() > 50 * 1024 * 1024) {
            return ResponseEntity.badRequest().body(Map.of("error", "File size exceeds 50MB limit"));
        }
        
        try {
            PdfSession session = pdfService.uploadPdf(file);
            
            Map<String, Object> response = new HashMap<>();
            response.put("sessionId", session.getId());
            response.put("originalFileName", session.getOriginalFileName());
            response.put("status", session.getStatus());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to upload file: " + e.getMessage()));
        }
    }
    
    /**
     * POST /api/pdf/{id}/analyze
     * Analyze an uploaded PDF
     */
    @PostMapping("/{id}/analyze")
    public ResponseEntity<?> analyzePdf(@PathVariable String id) {
        try {
            PdfSession session = pdfService.analyzePdf(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("diagnosis", session.getSuggestions());
            response.put("recommendations", session.getSuggestions());
            response.put("estimatedSavings", Map.of(
                    "pages", Math.max(0, (session.getPagesBefore() != null ? session.getPagesBefore() : 0) - 
                            (session.getPagesAfter() != null ? session.getPagesAfter() : session.getPagesBefore())),
                    "inkPercent", session.getInkBefore() != null ? Math.round((1 - 0.7) * 100) : 0
            ));
            response.put("inkBefore", session.getInkBefore());
            response.put("pagesBefore", session.getPagesBefore());
            response.put("optimizingScore", session.getOptimizingScore());
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to analyze PDF: " + e.getMessage()));
        }
    }
    
    /**
     * POST /api/pdf/{id}/optimize
     * Optimize a PDF with given settings
     */
    @PostMapping("/{id}/optimize")
    public ResponseEntity<?> optimizePdf(
            @PathVariable String id,
            @RequestBody OptimizeRequest request) {
        try {
            PdfSession session = pdfService.optimizePdf(
                    id,
                    request.getInkSaverLevel(),
                    request.getPageSaverLevel(),
                    request.getPreserveQuality(),
                    request.getExcludeImages()
            );
            
            return ResponseEntity.ok(session);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to optimize PDF: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/pdf/{id}/status
     * Get session status and metrics
     */
    @GetMapping("/{id}/status")
    public ResponseEntity<PdfSession> getSessionStatus(@PathVariable String id) {
        return pdfSessionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * GET /api/pdf/{id}/original
     * Download original PDF
     */
    @GetMapping("/{id}/original")
    public ResponseEntity<byte[]> getOriginalPdf(@PathVariable String id) {
        try {
            PdfSession session = pdfSessionRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Session not found"));
            
            byte[] pdfBytes = pdfService.getPdfBytes(id, "original");
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.builder("attachment")
                    .filename(session.getOriginalFileName())
                    .build());
            
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * GET /api/pdf/{id}/report
     * Get HTML report content
     */
    @GetMapping("/{id}/report")
    public ResponseEntity<String> getReport(@PathVariable String id) {
        try {
            String htmlContent = pdfService.getReportHtml(id);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.TEXT_HTML);
            
            return new ResponseEntity<>(htmlContent, headers, HttpStatus.OK);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * GET /api/pdf/{id}/report/download
     * Download HTML report as file
     */
    @GetMapping("/{id}/report/download")
    public ResponseEntity<byte[]> downloadReport(@PathVariable String id) {
        try {
            PdfSession session = pdfSessionRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Session not found"));
            
            String htmlContent = pdfService.getReportHtml(id);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.TEXT_HTML);
            headers.setContentDisposition(ContentDisposition.builder("attachment")
                    .filename(session.getOriginalFileName().replace(".pdf", "") + "_report.html")
                    .build());
            
            return new ResponseEntity<>(htmlContent.getBytes(), headers, HttpStatus.OK);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * DELETE /api/pdf/{id}
     * Delete session and files
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSession(@PathVariable String id) {
        try {
            pdfService.deleteSession(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
