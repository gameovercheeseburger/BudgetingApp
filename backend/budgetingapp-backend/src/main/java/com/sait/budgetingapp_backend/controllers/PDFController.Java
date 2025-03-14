package com.sait.budgetingapp_backend.controllers;

import com.sait.budgetingapp_backend.services.PDFService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/pdf")
public class PDFController {

    private final PDFService pdfService;

    public PDFController(PDFService pdfService) {
        this.pdfService = pdfService;
    }

    @PostMapping("/upload-pdf")
    public ResponseEntity<?> uploadPDF(@RequestParam("file") MultipartFile file) {
        try {
            List<String> transactions = pdfService.extractTransactionsFromPDF(file);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error processing PDF: " + e.getMessage());
        }
    }
}
