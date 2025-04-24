import { createWorker } from "tesseract.js"
import fetch from "node-fetch"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"

// Get directory name
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const processImage = async (imageUrl) => {
  try {
    console.log(`Processing image: ${imageUrl}`)

    // Download the image if it's a remote URL
    let imagePath
    if (imageUrl.startsWith("http")) {
      const response = await fetch(imageUrl)
      const buffer = await response.buffer()

      // Save to temp file
      const tempDir = path.join(__dirname, "..", "uploads", "temp")
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true })
      }

      imagePath = path.join(tempDir, `temp-${Date.now()}.png`)
      fs.writeFileSync(imagePath, buffer)
    } else {
      // If it's a local path, convert to absolute path
      imagePath = path.join(__dirname, "..", imageUrl.replace(/^\//, ""))
    }

    // Perform OCR using Tesseract
    const worker = await createWorker()
    await worker.loadLanguage("eng")
    await worker.initialize("eng")

    const { data } = await worker.recognize(imagePath)
    await worker.terminate()

    // Clean up temp file if we created one
    if (imageUrl.startsWith("http") && fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath)
    }

    // Return the extracted text and metadata
    return {
      text: data.text,
      metadata: {
        confidence: data.confidence,
        imageUrl: imageUrl,
        words: data.words ? data.words.length : 0,
      },
    }
  } catch (error) {
    console.error("Error processing image:", error)
    return {
      text: "Error processing image. Could not extract text.",
      error: error.message,
      metadata: {
        imageUrl: imageUrl,
      },
    }
  }
}
