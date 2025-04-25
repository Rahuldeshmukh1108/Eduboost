import express from "express"
import cors from "cors"
import multer from "multer"
import path from "path"
import fs from "fs/promises"
import { fileURLToPath } from "url"

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Environment variables
const GROQ_API_KEY = process.env.GROQ_API_KEY || "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"
const PORT = process.env.PORT || 5500

// Initialize Express app
const app = express()

// Configure multer for file uploads
const uploadDir = path.join(__dirname, "uploads")
;(async () => {
  try {
    await fs.mkdir(uploadDir, { recursive: true })
    console.log("Upload directory created or already exists")
  } catch (err) {
    console.error("Error creating upload directory:", err)
  }
})()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({ storage: storage })

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static("public"))

// Routes
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, model = "llama-3.1-8b-instant", apiKey } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages format" })
    }

    // Check for API key
    const groqApiKey = apiKey || GROQ_API_KEY
    if (!groqApiKey) {
      return res.status(400).json({ error: "Groq API key is required" })
    }

    // Format messages for Groq
    const formattedMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }))

    // System message for AI tutor
    const systemMessage = {
      role: "system",
      content:
        "You are an AI tutor designed to help students learn various subjects. Provide clear, concise, and helpful responses. Break down complex topics into understandable parts. If you don't know something, admit it rather than making up information.",
    }

    // Make request to Groq API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        messages: [systemMessage, ...formattedMessages],
        model: model,
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        stream: false,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || "Failed to get response from Groq API")
    }

    const data = await response.json()
    res.json({
      response: data.choices[0].message.content,
      usage: data.usage,
    })
  } catch (error) {
    console.error("Error in chat endpoint:", error)
    res.status(500).json({ error: "Failed to get response from AI: " + error.message })
  }
})

// File upload endpoint
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" })
    }

    // In a real app, you would process the file here (e.g., extract text)
    // For this example, we'll just return the file path
    const filePath = req.file.path
    const fileName = req.file.originalname

    // Read file content (for text files)
    let fileContent = ""
    try {
      if (req.file.mimetype.includes("text") || req.file.mimetype.includes("application/pdf")) {
        // In a real app, you would use proper PDF parsing for PDFs
        fileContent = await fs.readFile(filePath, "utf8")
      }
    } catch (err) {
      console.error("Error reading file:", err)
    }

    res.json({
      success: true,
      file: {
        name: fileName,
        path: filePath,
        content: fileContent.substring(0, 1000), // Send first 1000 chars for preview
      },
    })
  } catch (error) {
    console.error("Error in file upload:", error)
    res.status(500).json({ error: "Failed to process uploaded file" })
  }
})

// Speech to text endpoint
app.post("/api/speech-to-text", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" })
    }

    // In a real implementation, you would send this to a speech-to-text API
    // For this example, we'll just return a mock response
    res.json({
      success: true,
      transcript:
        "This is a simulated transcription. In a real implementation, this would be the text from your speech.",
    })
  } catch (error) {
    console.error("Error in speech-to-text:", error)
    res.status(500).json({ error: "Failed to process speech" })
  }
})

// Available models endpoint
app.get("/api/models", (req, res) => {
  // List of available Groq models
  const models = [
    {
      id: "llama-3.1-8b-instant",
      name: "Llama 3.1 8B (Fast)",
      description: "Fast responses, good for general questions",
    },
    { id: "llama-3.1-70b", name: "Llama 3.1 70B", description: "More capable, better for complex topics" },
    { id: "mixtral-8x7b", name: "Mixtral 8x7B", description: "Good for creative and technical content" },
    {
      id: "meta-llama/llama-4-scout-17b-16e-instruct",
      name: "Llama 4 Scout (17B)",
      description: "Latest model with improved reasoning",
    },
  ]

  res.json({ models })
})

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    version: "1.0.0",
    timestamp: new Date(),
    environment: process.env.NODE_ENV || "development",
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Groq API Key: ${GROQ_API_KEY ? "Configured" : "Not configured"}`)
})
