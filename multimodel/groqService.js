// Groq AI Service Module
class GroqService {
    constructor() {
      this.apiKey = "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"
      this.apiUrl = "https://api.groq.com/openai/v1/chat/completions"
      this.cache = new Map()
      this.currentModel = "llama-3.1-8b-instant"
      this.currentLanguage = "en"
  
      // Language mapping for translations
      this.languages = {
        en: "English",
        es: "Spanish",
        fr: "French",
        de: "German",
        zh: "Chinese",
        ja: "Japanese",
        hi: "Hindi",
        mr: "Marathi",
        gu: "Gujarati",
        ta: "Tamil",
        ml: "Malayalam",
        ar: "Arabic",
        ru: "Russian",
      }
  
      // Model information
      this.models = {
       
        "llama-3.1-8b-instant": {
          name: "Llama 3.1 8B",
          description: "Fast and efficient model for quick responses",
          contextWindow: 128000,
        },
      
      }
  
      console.log("GroqService initialized with model:", this.currentModel)
    }
  
    async fetchWithRetry(url, options, retries = 3, delay = 1000) {
      for (let i = 0; i < retries; i++) {
        try {
          console.log(`Attempt ${i + 1} to fetch from Groq API`)
          const response = await fetch(url, options)
  
          if (response.ok) {
            console.log("Successful response from Groq API")
            return response
          }
  
          console.error(`Attempt ${i + 1} failed with status: ${response.status}`)
          const errorData = await response.json().catch(() => ({}))
          console.error("Error data:", errorData)
  
          if (i < retries - 1) {
            console.log(`Waiting ${delay}ms before retry...`)
            await new Promise((resolve) => setTimeout(resolve, delay))
            delay *= 1.5 // Exponential backoff
          }
        } catch (error) {
          console.error(`Attempt ${i + 1} failed with error:`, error)
  
          if (i < retries - 1) {
            console.log(`Waiting ${delay}ms before retry...`)
            await new Promise((resolve) => setTimeout(resolve, delay))
            delay *= 1.5 // Exponential backoff
          }
        }
      }
  
      throw new Error("Failed to fetch after multiple attempts")
    }
  
    async processMessage(message, options = {}) {
      const { fileContent, modelOverride, languageOverride } = options
  
      const model = modelOverride || this.currentModel
      const language = languageOverride || this.currentLanguage
  
      console.log(`Processing message with model: ${model}, language: ${language}`)
  
      // Check if the model exists
      if (!this.models[model]) {
        console.warn(`Model ${model} not found, using default`)
        this.currentModel = "llama-3.1-8b-instant" // Default to a known working model
        return {
          text: `I'm sorry, the model "${model}" is not available. I've switched to the default model.`,
          type: "text",
          additionalContent: null,
        }
      }
  
      try {
        // Show loading indicator
        document.getElementById("loading-overlay").classList.remove("hidden")
  
        const loadingText = document.getElementById("loading-text")
        if (window.translationService) {
          loadingText.textContent = window.translationService.getText("chat.thinking")
        } else {
          loadingText.textContent = "Thinking..."
        }
  
        // Prepare system message based on language
        let systemMessage = `You are a helpful, friendly AI tutor. Provide clear, concise explanations. 
        When appropriate, include relevant references to websites, YouTube videos, or images. 
        Format your response as follows:
        
        1. Main text response
        2. If relevant, include [REFERENCES] section with up to 3 website links
        3. If relevant, include [YOUTUBE] section with a relevant YouTube video ID
        4. If relevant, include [IMAGE] section with a description of an image that would help illustrate the concept
        5. If relevant, include [AUDIO] section to indicate text that should be read aloud
        
        Example format:
        Your main response text here...
        
        [REFERENCES]
        - Title 1: https://example.com/page1
        - Title 2: https://example.com/page2
        
        [YOUTUBE]
        dQw4w9WgXcQ
        
        [IMAGE]
        A diagram showing the water cycle with arrows indicating evaporation, condensation, and precipitation.
        
        [AUDIO]
        This is the key part that should be read aloud to emphasize the main concept.`
  
        if (language !== "en") {
          systemMessage += ` Respond in ${this.languages[language]}.`
        }
  
        // Prepare messages array
        const messages = [{ role: "system", content: systemMessage }]
  
        // Add file content if provided
        if (fileContent) {
          let filePrompt = `The user has uploaded a file. `
  
          if (fileContent.imageUrl) {
            filePrompt += `It's an image file (${fileContent.metadata.fileName}).`
            if (fileContent.text) {
              filePrompt += ` The image contains the following text: "${fileContent.text}"`
            }
            if (fileContent.metadata.labels && fileContent.metadata.labels.length > 0) {
              filePrompt += ` The image has been labeled as: ${fileContent.metadata.labels.map((l) => l.description).join(", ")}`
            }
            filePrompt += ` Please analyze this information and respond to the user's query: "${message}"`
          } else if (fileContent.audioUrl) {
            filePrompt += `It's an audio file with the following transcription: "${fileContent.text}". Please analyze this transcription and respond to the user's query: "${message}"`
          } else {
            filePrompt += `It's a document with the following content: "${fileContent.text}". Please analyze this content and respond to the user's query: "${message}"`
          }
  
          messages.push({ role: "user", content: filePrompt })
        } else {
          messages.push({ role: "user", content: message })
        }
  
        console.log("Sending request to Groq API with messages:", messages)
  
        // Make API call to Groq
        const response = await this.fetchWithRetry(this.apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: model,
            messages: messages,
            temperature: 0.7,
            max_tokens: 2048,
          }),
        })
  
        const data = await response.json()
        console.log("Groq API response:", data)
  
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
          throw new Error("Invalid response format from Groq API")
        }
  
        // Parse the response to extract different content types
        const parsedResponse = this.parseEnhancedResponse(data.choices[0].message.content)
  
        // Hide loading indicator
        document.getElementById("loading-overlay").classList.add("hidden")
  
        return parsedResponse
      } catch (error) {
        console.error("Error processing message with Groq:", error)
  
        // Hide loading indicator
        document.getElementById("loading-overlay").classList.add("hidden")
  
        let errorMessage = `I'm sorry, I encountered an error: ${error.message}. Please try again.`
  
        if (window.translationService) {
          errorMessage = window.translationService.formatText("chat.error", error.message)
        }
  
        return {
          text: errorMessage,
          type: "text",
          additionalContent: null,
        }
      }
    }
  
    parseEnhancedResponse(content) {
      // Default response structure
      const response = {
        text: content,
        type: "text",
        additionalContent: null,
      }
  
      // Check for special sections
      const sections = {
        references: this.extractSection(content, "[REFERENCES]", "[YOUTUBE]|[IMAGE]|[AUDIO]"),
        youtube: this.extractSection(content, "[YOUTUBE]", "[IMAGE]|[AUDIO]|$"),
        image: this.extractSection(content, "[IMAGE]", "[AUDIO]|$"),
        audio: this.extractSection(content, "[AUDIO]", "$"),
      }
  
      // Clean up the main text by removing the sections
      let mainText = content
      Object.values(sections).forEach((section) => {
        if (section) {
          mainText = mainText.replace(new RegExp(`\\[${section.type.toUpperCase()}\\][\\s\\S]*?(?=\\[|$)`, "i"), "")
        }
      })
  
      // Trim the main text
      response.text = mainText.trim()
  
      // Process additional content
      const additionalContent = []
  
      // Process references
      if (sections.references) {
        const links = this.parseReferences(sections.references.content)
        if (links.length > 0) {
          additionalContent.push({
            type: "links",
            links: links,
          })
        }
      }
  
      // Process YouTube
      if (sections.youtube) {
        const videoId = this.parseYouTubeId(sections.youtube.content)
        if (videoId) {
          additionalContent.push({
            type: "video",
            videoId: videoId,
            url: `https://www.youtube.com/embed/${videoId}`,
            title: "Related Video",
          })
        }
      }
  
      // Process image
      if (sections.image) {
        additionalContent.push({
          type: "image",
          description: sections.image.content.trim(),
          url: this.generatePlaceholderImage(sections.image.content.trim()),
        })
      }
  
      // Process audio
      if (sections.audio) {
        additionalContent.push({
          type: "audio",
          text: sections.audio.content.trim(),
        })
      }
  
      // Add additional content if any
      if (additionalContent.length > 0) {
        response.additionalContent = additionalContent
      }
  
      return response
    }
  
    extractSection(content, sectionStart, nextSectionPattern) {
      const regex = new RegExp(`${sectionStart}([\\s\\S]*?)(?=${nextSectionPattern})`, "i")
      const match = content.match(regex)
  
      if (match && match[1]) {
        return {
          type: sectionStart.replace(/[[\]]/g, "").toLowerCase(),
          content: match[1].trim(),
        }
      }
  
      return null
    }
  
    parseReferences(referencesContent) {
      const links = []
      const regex = /- (.*?):\s*(https?:\/\/[^\s]+)/g
      let match
  
      while ((match = regex.exec(referencesContent)) !== null) {
        links.push({
          title: match[1].trim(),
          url: match[2].trim(),
        })
      }
  
      return links
    }
  
    parseYouTubeId(youtubeContent) {
      // Extract YouTube ID (11 characters)
      const regex = /([a-zA-Z0-9_-]{11})/
      const match = youtubeContent.match(regex)
  
      return match ? match[1] : null
    }
  
    generatePlaceholderImage(description) {
      // In a real implementation, you might use an image generation API
      // For now, we'll use a placeholder service
      const encodedDescription = encodeURIComponent(description)
      return `https://via.placeholder.com/600x400?text=${encodedDescription}`
    }
  
    setModel(model) {
      if (this.models[model]) {
        this.currentModel = model
        console.log(`Model changed to ${model}`)
        return true
      }
      console.warn(`Invalid model selected: ${model}`)
      return false
    }
  
    setLanguage(language) {
      if (this.languages[language]) {
        this.currentLanguage = language
        console.log(`Language changed to ${language}`)
        return true
      }
      return false
    }
  
    getCurrentModel() {
      return this.currentModel
    }
  
    getCurrentLanguage() {
      return this.currentLanguage
    }
  }
  
  // Initialize Groq service
  document.addEventListener("DOMContentLoaded", () => {
    console.log("Initializing GroqService")
    window.groqService = new GroqService()
  })
  