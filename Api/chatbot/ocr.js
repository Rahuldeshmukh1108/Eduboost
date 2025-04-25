// OCR Integration using Tesseract.js
// This script adds OCR (Optical Character Recognition) capabilities to the AI Tutor

// Declare Tesseract and showToast
let Tesseract
let showToast

// Load Tesseract.js from CDN
document.addEventListener("DOMContentLoaded", () => {
  const script = document.createElement("script")
  script.src = "https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js"
  script.async = true
  script.onload = () => {
    Tesseract = window.Tesseract // Assign Tesseract after it's loaded
    initializeOCR()
  }
  document.head.appendChild(script)
})

// OCR State
let ocrWorker = null
let isOcrInitialized = false
let isOcrProcessing = false

// Initialize OCR
function initializeOCR() {
  if (typeof Tesseract === "undefined") {
    console.error("Tesseract.js failed to load")
    return
  }

  // Create worker when needed (lazy initialization)
  const createWorker = async () => {
    if (ocrWorker) return

    try {
      showToast("OCR Initializing", "Setting up text recognition capabilities...")
      ocrWorker = await Tesseract.createWorker("eng")
      await ocrWorker.loadLanguage("eng")
      await ocrWorker.initialize("eng")
      isOcrInitialized = true
      showToast("OCR Ready", "Text recognition is now available for images")
    } catch (error) {
      console.error("Error initializing OCR:", error)
      showToast("OCR Error", "Failed to initialize text recognition", true)
    }
  }

  // Override the image upload handler to include OCR
  const originalHandleImageChange = window.handleImageChange
  window.handleImageChange = async function (e) {
    // Call the original handler first
    originalHandleImageChange.call(this, e)

    if (!e.target.files || !e.target.files[0]) return

    const file = e.target.files[0]

    // Initialize OCR worker if needed
    if (!isOcrInitialized) {
      await createWorker()
    }

    // Process the image with OCR
    if (isOcrInitialized && ocrWorker) {
      processImageWithOCR(file)
    }
  }
}

// Process image with OCR
async function processImageWithOCR(file) {
  if (isOcrProcessing || !ocrWorker) return

  isOcrProcessing = true
  showToast("OCR Processing", "Analyzing text in the image...")

  try {
    // Create a URL for the image file
    const imageUrl = URL.createObjectURL(file)

    // Recognize text in the image
    const result = await ocrWorker.recognize(imageUrl)

    // Get the recognized text
    const recognizedText = result.data.text.trim()

    // If text was found, add it to the file content
    if (recognizedText) {
      // Update the global fileContent variable
      window.fileContent += `\n\nText detected in image:\n${recognizedText}`

      showToast("OCR Complete", "Text has been extracted from the image")

      // Update the file info display
      const fileNameElement = document.getElementById("file-name")
      if (fileNameElement) {
        fileNameElement.textContent = `Image: ${file.name} (with text)`
      }
    } else {
      showToast("OCR Result", "No text was detected in the image")
    }

    // Release the object URL
    URL.revokeObjectURL(imageUrl)
  } catch (error) {
    console.error("OCR processing error:", error)
    showToast("OCR Error", "Failed to extract text from the image", true)
  } finally {
    isOcrProcessing = false
  }
}

// Enhanced voice input with visual feedback
document.addEventListener("DOMContentLoaded", () => {
  const micButton = document.getElementById("mic-button")
  if (!micButton) return

  // Create a recording indicator
  const recordingIndicator = document.createElement("div")
  recordingIndicator.className = "recording-indicator"
  recordingIndicator.innerHTML = `
    <div class="recording-pulse"></div>
    <div class="recording-text">Recording...</div>
  `
  recordingIndicator.style.display = "none"
  document.body.appendChild(recordingIndicator)

  // Add styles for recording indicator
  const style = document.createElement("style")
  style.textContent = `
    .recording-indicator {
      position: fixed;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      background-color: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: 1rem;
      padding: 0.75rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      box-shadow: 0 4px 12px var(--shadow-color);
      z-index: 100;
      animation: fadeIn 0.3s ease;
    }
    
    .recording-pulse {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: #ef4444;
      animation: pulse 1.5s infinite;
    }
    
    .recording-text {
      font-weight: 500;
    }
    
    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
      }
      70% {
        box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
      }
    }
  `
  document.head.appendChild(style)

  // Override the original recording functions
  const originalStartRecording = window.startRecording
  window.startRecording = async function () {
    await originalStartRecording.call(this)
    if (window.isRecording) {
      recordingIndicator.style.display = "flex"
    }
  }

  const originalStopRecording = window.stopRecording
  window.stopRecording = function () {
    originalStopRecording.call(this)
    recordingIndicator.style.display = "none"
  }
})

// Enhanced website and video suggestions
document.addEventListener("DOMContentLoaded", () => {
  // Additional educational websites by subject
  const additionalWebsites = {
    biology: [
      { name: "National Geographic", url: "https://www.nationalgeographic.com/science/" },
      { name: "Biology Online", url: "https://www.biology-online.org/" },
    ],
    mathematics: [
      { name: "Brilliant", url: "https://brilliant.org/" },
      { name: "Mathigon", url: "https://mathigon.org/" },
    ],
    literature: [
      { name: "Project Gutenberg", url: "https://www.gutenberg.org/" },
      { name: "SparkNotes", url: "https://www.sparknotes.com/" },
    ],
    astronomy: [
      { name: "NASA", url: "https://www.nasa.gov/" },
      { name: "Space.com", url: "https://www.space.com/" },
    ],
    geography: [
      { name: "National Geographic Maps", url: "https://www.nationalgeographic.org/maps/" },
      { name: "WorldAtlas", url: "https://www.worldatlas.com/" },
    ],
  }

  // Additional educational YouTube channels by subject
  const educationalChannels = {
    science: [
      { name: "Veritasium", id: "UCHnyfMqiRRG1u-2MsSQLbXA" },
      { name: "SciShow", id: "UCZYTClx2T1of7BRZ86-8fow" },
    ],
    mathematics: [
      { name: "3Blue1Brown", id: "UCYO_jab_esuFRV4b17AJtAw" },
      { name: "Numberphile", id: "UCoxcjq-8xIDTYp3uz647V5A" },
    ],
    history: [
      { name: "Crash Course", id: "UCX6b17PVsYBQ0ip5gyeme-Q" },
      { name: "Oversimplified", id: "UCNIuvl7V8zACPpTmmNIqP2A" },
    ],
    computerScience: [
      { name: "Computerphile", id: "UC9-y-6csu5WGm29I7JiwpnA" },
      { name: "Fireship", id: "UCsBjURrPoezykLs9EqgamOA" },
    ],
    languages: [
      { name: "Easy Languages", id: "UCqcBu0YyEJH4vfKR--97cng" },
      { name: "Langfocus", id: "UCNhX3WQEkraW3VHPyup8jkQ" },
    ],
  }

  // Override the enhanceResponseWithLinks function to include more resources
  const originalEnhanceResponseWithLinks = window.enhanceResponseWithLinks
  window.enhanceResponseWithLinks = function (text) {
    // First call the original function
    let enhanced = originalEnhanceResponseWithLinks.call(this, text)

    // Add additional website suggestions based on content
    for (const [topic, sites] of Object.entries(additionalWebsites)) {
      if (text.toLowerCase().includes(topic.toLowerCase())) {
        const websiteSuggestions = `<div class="website-suggestions"><p>Additional resources for ${topic}:</p><ul>`
        const siteLinks = sites
          .map((site) => `<li><a href="${site.url}" target="_blank" rel="noopener noreferrer">${site.name}</a></li>`)
          .join("")
        enhanced += `${websiteSuggestions}${siteLinks}</ul></div>`
      }
    }

    // Add educational YouTube channel suggestions
    for (const [subject, channels] of Object.entries(educationalChannels)) {
      if (text.toLowerCase().includes(subject.toLowerCase())) {
        const channelSuggestions = `<div class="video-suggestions-container"><p>Educational channels about ${subject}:</p>`
        const channelLinks = channels
          .map(
            (channel) =>
              `<div class="video-suggestion">
            <a href="https://www.youtube.com/channel/${channel.id}" target="_blank" rel="noopener noreferrer">
              <div class="video-thumbnail">
                <img src="https://i.ytimg.com/vi/placeholder/mqdefault.jpg" alt="Channel Thumbnail">
                <div class="play-button"><i class="fas fa-play"></i></div>
              </div>
              <div class="video-title">${channel.name}</div>
            </a>
          </div>`,
          )
          .join("")
        enhanced += `${channelSuggestions}${channelLinks}</div>`
        break // Only add one set of channel suggestions
      }
    }

    return enhanced
  }
})
