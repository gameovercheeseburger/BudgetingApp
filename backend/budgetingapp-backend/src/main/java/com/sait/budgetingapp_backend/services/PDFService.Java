package com.sait.budgetingapp_backend.services;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class PDFService {

    public List<String> extractTransactionsFromPDF(MultipartFile file) throws IOException {
        List<String> transactions = new ArrayList<>();

        try (InputStream inputStream = file.getInputStream();
             PDDocument document = PDDocument.load(inputStream)) {

            PDFTextStripper pdfStripper = new PDFTextStripper();
            String text = pdfStripper.getText(document);

            // Regex to extract amounts and descriptions (Example: "$50.00 - Grocery Shopping")
            String regex = "\\$(\\d+\\.\\d{2})\\s-\\s([A-Za-z\\s]+)";
            Pattern pattern = Pattern.compile(regex);
            Matcher matcher = pattern.matcher(text);

            while (matcher.find()) {
                String amount = matcher.group(1);
                String description = matcher.group(2);
                transactions.add(description + ": $" + amount);
            }
        }

        return transactions;
    }
}
