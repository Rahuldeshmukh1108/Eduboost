import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"
import { processImage } from "../utils/imageProcessor.js"
import { extractTextFromPdf } from "../utils/pdfProcessor.js"
import { transcribeAudio } from "../utils/audioProcessor.js"

// Get directory name
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" })
    }

    const file = req.file
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`

    console.log(`File uploaded: ${file.originalname}, saved as: ${file.filename}`)

    // Return file information
    res.status(200).json({
      success: true,
      file: {
        originalName: file.originalname,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
        url: fileUrl,
      },
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    res.status(500).json({ error: "Failed to upload file", details: error.message })
  }
}

export const processFile = async (req, res) => {
  try {
    const { fileUrl, fileType, fileName } = req.body

    if (!fileUrl || !fileType) {
      return res.status(400).json({ error: "File URL and type are required" })
    }

    console.log(`Processing file: ${fileName}, type: ${fileType}`)

    let result = {
      text: "",
      metadata: {
        fileName,
        fileType,
      },
    }

    // Process file based on type
    switch (fileType) {
      case "image":
        result = await processImage(fileUrl)
        break
      case "pdf":
        result = await extractTextFromPdf(fileUrl)
        break
      case "audio":
        result = await transcribeAudio(fileUrl)
        break
      case "doc":
      case "docx":
      case "txt":
        // For text files, read the content directly
        const filePath = new URL(fileUrl).pathname
        const localPath = path.join(__dirname, "..", filePath)
        if (fs.existsSync(localPath)) {
          result.text = fs.readFileSync(localPath, "utf8")
        }
        break
      default:
        return res.status(400).json({ error: "Unsupported file type" })
    }

    res.status(200).json({ result })
  } catch (error) {
    console.error("Error processing file:", error)
    res.status(500).json({ error: "Failed to process file", details: error.message })
  }
}
