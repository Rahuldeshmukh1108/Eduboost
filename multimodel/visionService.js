// Google Cloud Vision API Service
class VisionService {
    constructor() {
      this.apiKey = "AIzaSyBTT3aZTezkw2jG9YwiPhF_hq07_kF1nZE"
      this.apiUrl = "https://vision.googleapis.com/v1/images:annotate"
      console.log("VisionService initialized")
    }
  
    async analyzeImage(imageBase64) {
      try {
        console.log("Analyzing image with Vision API")
  
        // Remove data URL prefix if present
        const base64Content = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "")
  
        const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requests: [
              {
                image: {
                  content: base64Content,
                },
                features: [
                  {
                    type: "TEXT_DETECTION",
                    maxResults: 10,
                  },
                  {
                    type: "LABEL_DETECTION",
                    maxResults: 10,
                  },
                  {
                    type: "OBJECT_LOCALIZATION",
                    maxResults: 10,
                  },
                ],
              },
            ],
          }),
        })
  
        if (!response.ok) {
          const errorData = await response.json()
          console.error("Vision API error:", errorData)
          throw new Error(`Vision API error: ${errorData.error?.message || response.statusText}`)
        }
  
        const data = await response.json()
        console.log("Vision API response:", data)
  
        return this.processVisionResponse(data)
      } catch (error) {
        console.error("Error analyzing image with Vision API:", error)
  
        // Fallback to Tesseract if available
        if (window.Tesseract) {
          try {
            console.log("Falling back to Tesseract OCR")
            return await this.fallbackToTesseract(imageBase64)
          } catch (tesseractError) {
            console.error("Tesseract fallback failed:", tesseractError)
          }
        }
  
        return {
          text: "",
          labels: [],
          objects: [],
        }
      }
    }
  
    async fallbackToTesseract(imageBase64) {
      const { createWorker } = window.Tesseract
      console.log("Creating Tesseract worker")
  
      const worker = await createWorker()
      await worker.loadLanguage("eng")
      await worker.initialize("eng")
  
      console.log("Tesseract initialized, recognizing text")
      const { data } = await worker.recognize(imageBase64)
      await worker.terminate()
  
      console.log("Tesseract recognition complete:", data.text)
  
      return {
        text: data.text,
        labels: [],
        objects: [],
      }
    }
  
    processVisionResponse(data) {
      const result = {
        text: "",
        labels: [],
        objects: [],
      }
  
      if (!data.responses || !data.responses[0]) {
        return result
      }
  
      const response = data.responses[0]
  
      // Extract text
      if (response.fullTextAnnotation) {
        result.text = response.fullTextAnnotation.text
      } else if (response.textAnnotations && response.textAnnotations.length > 0) {
        result.text = response.textAnnotations[0].description
      }
  
      // Extract labels
      if (response.labelAnnotations) {
        result.labels = response.labelAnnotations.map((label) => ({
          description: label.description,
          score: label.score,
        }))
      }
  
      // Extract objects
      if (response.localizedObjectAnnotations) {
        result.objects = response.localizedObjectAnnotations.map((obj) => ({
          name: obj.name,
          score: obj.score,
        }))
      }
  
      return result
    }
  }
  
  // Initialize Vision service
  document.addEventListener("DOMContentLoaded", () => {
    console.log("Initializing VisionService")
    window.visionService = new VisionService()
  })