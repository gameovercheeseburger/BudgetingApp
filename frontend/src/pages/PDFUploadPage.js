import React, { useState } from "react";

function PdfUploadPage() {
  const [file, setFile] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8080/upload-pdf", {
        method: "POST",
        body: file,
        headers: {
          "Content-Type": "application/pdf"
        },
      });
      if (!response.ok) {
        throw new Error("File upload failed");
      }
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <h3>Upload PDF Transactions</h3>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>


      <h4>Extracted Transactions:</h4>
      <ul>
        {transactions.map((transaction, index) => (
          <li key={index}>{transaction}</li>
        ))}
      </ul>
    </div>
  );
}

export default PdfUploadPage;

