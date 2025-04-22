// Improved File Processing Module
class FileProcessor {
    constructor() {
      // DOM Elements
      this.fileUploadButton = document.getElementById("file-upload-button");
      this.fileUploadOptions = document.getElementById("file-upload-options");
      this.pdfOption = document.getElementById("pdf-option");
      this.docOption = document.getElementById("doc-option");
      this.imageOption = document.getElementById("image-option");
      this.audioOption = document.getElementById("audio-option");
      this.pdfUpload = document.getElementById("pdf-upload");
      this.docUpload = document.getElementById("doc-upload");
      this.imageUpload = document.getElementById("image-upload");
      this.audioUpload = document.getElementById("audio-upload");
      this.filePreviewContainer = document.getElementById("file-preview-container");
      this.filePreviewContent = document.getElementById("file-preview-content");
      this.closePreview = document.getElementById("close-preview");
      this.loadingOverlay = document.getElementById("loading-overlay");
      this.loadingText = document.getElementById("loading-text");
  
      this.currentFile = null;
      this.processedContent = null;
  
      this.init();
      console.log("FileProcessor initialized");
    }
  
    init() {
      // Toggle file upload options
      this.fileUploadButton.addEventListener("click", (e) => {
        e.stopPropagation();
        this.fileUploadOptions.classList.toggle("hidden");
      });
  
      // Close file upload options when clicking outside
      document.addEventListener("click", (e) => {
        if (!this.fileUploadButton.contains(e.target) && !this.fileUploadOptions.contains(e.target)) {
          this.fileUploadOptions.classList.add("hidden");
        }
      });
  
      // Click handlers for file option divs
      this.pdfOption.addEventListener("click", () => this.pdfUpload.click());
      this.docOption.addEventListener("click", () => this.docUpload.click());
      this.imageOption.addEventListener("click", () => this.imageUpload.click());
      this.audioOption.addEventListener("click", () => this.audioUpload.click());
  
      // File upload handlers
      this.pdfUpload.addEventListener("change", (e) => this.handleFileUpload(e, "pdf"));
      this.docUpload.addEventListener("change", (e) => this.handleFileUpload(e, "doc"));
      this.imageUpload.addEventListener("change", (e) => this.handleFileUpload(e, "image"));
      this.audioUpload.addEventListener("change", (e) => this.handleFileUpload(e, "audio"));
  
      // Close preview
      this.closePreview.addEventListener("click", () => {
        this.filePreviewContainer.classList.add("hidden");
        this.currentFile = null;
        this.processedContent = null;
      });
  
      console.log("FileProcessor event listeners set up");
    }
  
    handleFileUpload(event, type) {
      const file = event.target.files[0];
      if (!file) return;
  
      this.currentFile = {
        file,
        type,
        name: file.name,
        size: file.size,
        lastModified: file.lastModified,
      };
  
      this.fileUploadOptions.classList.add("hidden");
      this.showLoading(`Processing ${type} file...`);
  
      switch (type) {
        case "pdf":
          this.processPdf(file);
          break;
        case "doc":
          this.processDoc(file);
          break;
        case "image":
          this.processImage(file);
          break;
        case "audio":
          this.processAudio(file);
          break;
      }
    }
  
    async processPdf(file) {
      try {
        // Load PDF.js dynamically if not already loaded
        if (!window.pdfjsLib) {
          await this.loadScript("https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/build/pdf.min.js");
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/build/pdf.worker.min.js";
        }
  
        const arrayBuffer = await this.readFileAsArrayBuffer(file);
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
        let fullText = "";
  
        for (let i = 1; i <= Math.min(pdf.numPages, 5); i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item) => item.str).join(" ");
          fullText += `Page ${i}: ${pageText}\n\n`;
        }
  
        if (pdf.numPages > 5) {
          fullText += `\n[Note: Only showing first 5 pages of ${pdf.numPages} total pages]`;
        }
  
        this.processedContent = {
          text: fullText,
          metadata: {
            pageCount: pdf.numPages,
            fileName: file.name,
            fileSize: this.formatFileSize(file.size),
          },
        };
  
        this.previewFile(
          "PDF Content",
          `
            <div>
              <div class="file-info">
                <p><strong>File:</strong> ${file.name}</p>
                <p><strong>Pages:</strong> ${pdf.numPages}</p>
                <p><strong>Size:</strong> ${this.formatFileSize(file.size)}</p>
              </div>
              <div class="file-content">
                <h4>Extracted Text:</h4>
                <div style="max-height: 200px; overflow-y: auto; border: 1px solid var(--border-color); padding: 0.5rem; margin-top: 0.5rem;">
                  ${fullText.replace(/\n/g, "<br>")}
                </div>
              </div>
            </div>
          `,
          true
        );
  
        this.hideLoading();
      } catch (error) {
        console.error("Error processing PDF:", error);
        this.handleProcessingError("PDF");
      }
    }
  
    async processDoc(file) {
      try {
        if (file.name.endsWith(".txt")) {
          const text = await this.readFileAsText(file);
  
          this.processedContent = {
            text: text,
            metadata: {
              fileName: file.name,
              fileSize: this.formatFileSize(file.size),
            },
          };
  
          this.previewFile(
            "Document Content",
            `
              <div>
                <div class="file-info">
                  <p><strong>File:</strong> ${file.name}</p>
                  <p><strong>Size:</strong> ${this.formatFileSize(file.size)}</p>
                </div>
                <div class="file-content">
                  <h4>Document Text:</h4>
                  <div style="max-height: 200px; overflow-y: auto; border: 1px solid var(--border-color); padding: 0.5rem; margin-top: 0.5rem;">
                    ${text.replace(/\n/g, "<br>")}
                  </div>
                </div>
              </div>
            `,
            true
          );
        } else {
          // For .doc/.docx files, we'll simulate processing
          await new Promise((resolve) => setTimeout(resolve, 1000));
  
          this.processedContent = {
            text: `This is a simulated extraction from ${file.name}. In a real implementation, you would use a library like mammoth.js to extract text from .doc/.docx files.`,
            metadata: {
              fileName: file.name,
              fileSize: this.formatFileSize(file.size),
            },
          };
  
          this.previewFile(
            "Document Content",
            `
              <div>
                <div class="file-info">
                  <p><strong>File:</strong> ${file.name}</p>
                  <p><strong>Size:</strong> ${this.formatFileSize(file.size)}</p>
                </div>
                <div class="file-content">
                  <h4>Document Text:</h4>
                  <div style="max-height: 200px; overflow-y: auto; border: 1px solid var(--border-color); padding: 0.5rem; margin-top: 0.5rem;">
                    This is a simulated extraction from ${file.name}. In a real implementation, you would use a library like mammoth.js to extract text from .doc/.docx files.
                  </div>
                </div>
              </div>
            `,
            true
          );
        }
  
        this.hideLoading();
      } catch (error) {
        console.error("Error processing document:", error);
        this.handleProcessingError("document");
      }
    }
  
    async processImage(file) {
      try {
        const imageUrl = URL.createObjectURL(file);
        const dimensions = await this.getImageDimensions(imageUrl);
        
        // Create image element for preview
        const img = document.createElement("img");
        img.src = imageUrl;
        img.style.maxWidth = "100%";
        img.style.maxHeight = "200px";
        
        // Simple OCR simulation
        this.loadingText.textContent = "Analyzing image...";
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing time
        
        const simulatedText = "This is simulated text extracted from the image. In a real implementation, you would use an OCR service like Tesseract.js or Google Cloud Vision API.";
        
        this.processedContent = {
          text: simulatedText,
          imageUrl: imageUrl,
          metadata: {
            fileName: file.name,
            fileSize: this.formatFileSize(file.size),
            dimensions: dimensions,
          },
        };
        
        this.previewFile(
          "Image Analysis",
          `
            <div>
              <div class="file-info">
                <p><strong>File:</strong> ${file.name}</p>
                <p><strong>Size:</strong> ${this.formatFileSize(file.size)}</p>
                <p><strong>Dimensions:</strong> ${dimensions.width} x ${dimensions.height}</p>
              </div>
              <div class="file-content">
                <div style="margin: 0.5rem 0;">${img.outerHTML}</div>
                <h4>Extracted Text:</h4>
                <div style="max-height: 100px; overflow-y: auto; border: 1px solid var(--border-color); padding: 0.5rem; margin-top: 0.5rem;">
                  ${simulatedText || "No text detected in image"}
                </div>
              </div>
            </div>
          `,
          true
        );
        
        this.hideLoading();
      } catch (error) {
        console.error("Error processing image:", error);
        this.handleProcessingError("image");
      }
    }
  
    async processAudio(file) {
      try {
        const audioUrl = URL.createObjectURL(file);
        
        // Create audio element for preview
        const audio = document.createElement("audio");
        audio.controls = true;
        audio.src = audioUrl;
        
        // Simulate transcription
        this.loadingText.textContent = "Transcribing audio...";
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing time
        
        const simulatedTranscription = "This is a simulated transcription of the audio file. In a real implementation, you would use a speech-to-text service.";
        
        this.processedContent = {
          text: simulatedTranscription,
          audioUrl: audioUrl,
          metadata: {
            fileName: file.name,
            fileSize: this.formatFileSize(file.size),
            type: file.type,
          },
        };
        
        this.previewFile(
          "Audio File",
          `
            <div>
              <div class="file-info">
                <p><strong>File:</strong> ${file.name}</p>
                <p><strong>Size:</strong> ${this.formatFileSize(file.size)}</p>
                <p><strong>Type:</strong> ${file.type}</p>
              </div>
              <div class="file-content">
                <h4>Audio:</h4>
                <audio controls src="${audioUrl}" style="width: 100%; margin: 0.5rem 0;"></audio>
                <h4>Transcription:</h4>
                <div style="max-height: 100px; overflow-y: auto; border: 1px solid var(--border-color); padding: 0.5rem; margin-top: 0.5rem;">
                  ${simulatedTranscription || "No transcription available"}
                </div>
              </div>
            </div>
          `,
          true
        );
        
        this.hideLoading();
      } catch (error) {
        console.error("Error processing audio file:", error);
        this.handleProcessingError("audio");
      }
    }
  
    previewFile(title, content, isHTML = false) {
      const previewHeader = this.filePreviewContainer.querySelector(".file-preview-header h3");
      previewHeader.textContent = title;
  
      if (isHTML) {
        this.filePreviewContent.innerHTML = content;
      } else {
        this.filePreviewContent.textContent = content;
      }
  
      this.filePreviewContainer.classList.remove("hidden");
    }
  
    handleProcessingError(fileType) {
      this.hideLoading();
      this.previewFile(
        `${fileType} Processing Error`,
        `There was an error processing your ${fileType.toLowerCase()} file. Please try again with a different file.`
      );
      this.currentFile = null;
      this.processedContent = null;
    }
  
    showLoading(message) {
      this.loadingText.textContent = message;
      this.loadingOverlay.classList.remove("hidden");
    }
  
    hideLoading() {
      this.loadingOverlay.classList.add("hidden");
    }
  
    getProcessedContent() {
      return this.processedContent;
    }
  
    clearCurrentFile() {
      this.currentFile = null;
      this.processedContent = null;
      this.filePreviewContainer.classList.add("hidden");
    }
  
    formatFileSize(bytes) {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    }
  
    async getImageDimensions(url) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = function () {
          resolve({
            width: this.width,
            height: this.height,
          });
        };
        img.src = url;
      });
    }
  
    async loadScript(url) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
  
    readFileAsArrayBuffer(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
    }
  
    readFileAsText(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsText(file);
      });
    }
  }
  
  // Initialize file processor
  document.addEventListener("DOMContentLoaded", () => {
    console.log("Initializing FileProcessor");
    window.fileProcessor = new FileProcessor();
  });