// Main Application
class ChatApp {
    constructor() {
      // DOM Elements
      this.chatMessages = document.getElementById("chat-messages")
      this.userInput = document.getElementById("user-input")
      this.sendButton = document.getElementById("send-button")
      this.voiceInputButton = document.getElementById("voice-input-button")
      this.sidebarToggle = document.getElementById("sidebar-toggle")
      this.mobileSidebarToggle = document.getElementById("mobile-sidebar-toggle")
      this.sidebar = document.querySelector(".sidebar")
      this.languageSelect = document.getElementById("language-select")
      this.modelSelect = document.getElementById("model-select")
      this.themeToggle = document.getElementById("theme-toggle")
      this.voiceToggle = document.getElementById("voice-toggle")
      this.historyList = document.getElementById("history-list")
      this.userProfileButton = document.getElementById("user-profile-button")
      this.newChatButton = document.getElementById("new-chat-button")
  
      // Chat state
      this.currentConversation = {
        id: Date.now().toString(),
        title: "New Conversation",
        timestamp: Date.now(),
        messages: [],
      }
  
      this.conversations = []
      this.isProcessing = false
      this.speechSynthesis = window.speechSynthesis
      this.voices = []
      this.isRecording = false
      this.messageIdCounter = 0
  
      console.log("ChatApp initialized")
      this.init()
    }
  
    init() {
      console.log("Setting up event listeners")
  
      // Event listeners
      this.sendButton.addEventListener("click", () => {
        console.log("Send button clicked")
        this.sendMessage()
      })
  
      this.userInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault()
          this.sendMessage()
        }
      })
  
      this.voiceInputButton.addEventListener("click", () => {
        console.log("Voice button clicked")
        if (!this.isRecording) {
          this.startVoiceInput()
        } else {
          this.stopVoiceInput()
        }
      })
  
      this.sidebarToggle.addEventListener("click", () => this.toggleSidebar())
      this.mobileSidebarToggle.addEventListener("click", () => this.toggleSidebar())
  
      this.languageSelect.addEventListener("change", () => {
        console.log("Language changed to:", this.languageSelect.value)
        this.changeLanguage()
      })
  
      this.modelSelect.addEventListener("change", () => {
        console.log("Model changed to:", this.modelSelect.value)
        this.changeModel()
      })
  
      this.themeToggle.addEventListener("change", () => {
        console.log("Theme toggle changed:", this.themeToggle.checked)
        this.toggleTheme()
      })
  
      this.voiceToggle.addEventListener("change", () => {
        console.log("Voice toggle changed:", this.voiceToggle.checked)
        this.toggleVoice()
      })
  
      // User profile button
      this.userProfileButton.addEventListener("click", () => {
        console.log("User profile button clicked")
        this.showUserProfile()
      })
  
      // New chat button
      this.newChatButton.addEventListener("click", () => {
        console.log("New chat button clicked")
        this.clearChat()
      })
  
      // Auto-resize textarea
      this.userInput.addEventListener("input", () => {
        this.userInput.style.height = "auto"
        this.userInput.style.height = this.userInput.scrollHeight + "px"
      })
  
      // Check for saved theme preference
      const darkMode = localStorage.getItem("darkMode") === "true"
      if (darkMode) {
        document.body.classList.add("dark-theme")
        this.themeToggle.checked = true
      }
  
      // Check for saved voice preference
      const voiceEnabled = localStorage.getItem("voiceEnabled") === "true"
      this.voiceToggle.checked = voiceEnabled
  
      // Load speech synthesis voices
      this.loadVoices()
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.loadVoices()
      }
  
      // Load conversation history from localStorage
      this.loadConversations()
  
      // Initialize with welcome message if no messages
      if (this.currentConversation.messages.length === 0) {
        const welcomeText = window.translationService
          ? window.translationService.getText("chat.welcome")
          : "Hello! I'm your AI Tutor. I can help you learn about any subject. You can ask me questions, upload files, or even send me images and audio. How can I assist you today?"
  
        this.addBotMessage({
          text: welcomeText,
          type: "text",
        })
      }
  
      console.log("ChatApp initialization complete")
    }
  
    loadVoices() {
      this.voices = this.speechSynthesis.getVoices()
    }
  
    async sendMessage() {
      const message = this.userInput.value.trim()
      if (!message || this.isProcessing) return
  
      console.log("Sending message:", message)
  
      // Add user message to UI
      this.addUserMessage(message)
  
      // Clear input
      this.userInput.value = ""
      this.userInput.style.height = "auto"
  
      // Process message
      this.isProcessing = true
  
      try {
        // Check if there's file content to process
        let fileContent = null
        if (window.fileProcessor && window.fileProcessor.getProcessedContent) {
          fileContent = window.fileProcessor.getProcessedContent()
          if (fileContent) {
            window.fileProcessor.clearCurrentFile()
          }
        }
  
        // Get response from Groq service
        if (!window.groqService) {
          throw new Error("Groq service not initialized")
        }
  
        const response = await window.groqService.processMessage(message, {
          fileContent,
          modelOverride: window.groqService.getCurrentModel(),
          languageOverride: window.groqService.getCurrentLanguage(),
        })
  
        // Add bot response to UI
        this.addBotMessage(response)
  
        // Save conversation
        this.saveConversation()
        this.updateConversationHistory()
      } catch (error) {
        console.error("Error processing message:", error)
  
        let errorMessage = `I'm sorry, I encountered an error: ${error.message}. Please try again.`
  
        if (window.translationService) {
          errorMessage = window.translationService.formatText("chat.error", error.message)
        }
  
        this.addBotMessage({
          text: errorMessage,
          type: "text",
        })
      } finally {
        this.isProcessing = false
      }
    }
  
    addUserMessage(message) {
      const messageId = `msg-${Date.now()}-${this.messageIdCounter++}`
      const messageElement = this.createMessageElement("user", { text: message, type: "text" }, messageId)
      this.chatMessages.appendChild(messageElement)
      this.scrollToBottom()
  
      // Add to conversation history
      this.currentConversation.messages.push({
        id: messageId,
        role: "user",
        content: message,
        timestamp: Date.now(),
      })
  
      // Add message actions
      if (window.messageActions) {
        window.messageActions.addActionsToMessage(messageElement, true)
      }
    }
  
    addBotMessage(response) {
      const messageId = `msg-${Date.now()}-${this.messageIdCounter++}`
      const messageElement = this.createMessageElement("bot", response, messageId)
      this.chatMessages.appendChild(messageElement)
      this.scrollToBottom()
  
      // Add to conversation history
      this.currentConversation.messages.push({
        id: messageId,
        role: "bot",
        content: response,
        timestamp: Date.now(),
      })
  
      // Text-to-speech if enabled
      if (this.voiceToggle.checked) {
        // Check if there's specific audio content
        if (response.additionalContent) {
          const audioContent = response.additionalContent.find((content) => content.type === "audio")
          if (audioContent) {
            this.speakText(audioContent.text)
          } else {
            this.speakText(response.text)
          }
        } else {
          this.speakText(response.text)
        }
      }
  
      // Add message actions
      if (window.messageActions) {
        window.messageActions.addActionsToMessage(messageElement, false)
      }
  
      // Save conversation
      this.saveConversation()
  
      // Update conversation history UI
      if (window.conversationHistoryManager) {
        window.conversationHistoryManager.addConversation(this.currentConversation)
      }
    }
  
    createMessageElement(role, content, messageId) {
      const messageDiv = document.createElement("div")
      messageDiv.className = `message ${role}-message`
      messageDiv.dataset.messageId = messageId
  
      const avatarDiv = document.createElement("div")
      avatarDiv.className = "message-avatar"
  
      const avatarIcon = document.createElement("i")
      avatarIcon.className = role === "user" ? "fas fa-user" : "fas fa-robot"
      avatarDiv.appendChild(avatarIcon)
  
      const contentDiv = document.createElement("div")
      contentDiv.className = "message-content"
  
      // Process the content based on type
      if (typeof content === "string") {
        // Legacy support for string messages
        const paragraph = document.createElement("p")
        paragraph.textContent = content
        contentDiv.appendChild(paragraph)
      } else {
        // Process structured content
        const { text, additionalContent } = content
  
        // Add the main text
        const paragraph = document.createElement("p")
        paragraph.innerHTML = this.formatText(text)
        contentDiv.appendChild(paragraph)
  
        // Add additional content if available
        if (additionalContent && additionalContent.length > 0) {
          additionalContent.forEach((content) => {
            switch (content.type) {
              case "links":
                const linksContainer = document.createElement("div")
                linksContainer.className = "references-container"
  
                const linksTitle = document.createElement("h4")
                linksTitle.textContent = "References:"
                linksContainer.appendChild(linksTitle)
  
                const linksList = document.createElement("ul")
                linksList.className = "references-list"
  
                content.links.forEach((link) => {
                  const listItem = document.createElement("li")
                  const anchor = document.createElement("a")
                  anchor.href = link.url
                  anchor.textContent = link.title
                  anchor.target = "_blank"
                  anchor.rel = "noopener noreferrer"
                  listItem.appendChild(anchor)
                  linksList.appendChild(listItem)
                })
  
                linksContainer.appendChild(linksList)
                contentDiv.appendChild(linksContainer)
                break
  
              case "video":
                const videoContainer = document.createElement("div")
                videoContainer.className = "video-container"
  
                const videoTitle = document.createElement("h4")
                videoTitle.textContent = "Related Video:"
                videoContainer.appendChild(videoTitle)
  
                const iframe = document.createElement("iframe")
                iframe.width = "100%"
                iframe.height = "200"
                iframe.src = content.url
                iframe.title = content.title || "Related Video"
                iframe.frameBorder = "0"
                iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                iframe.allowFullscreen = true
  
                videoContainer.appendChild(iframe)
                contentDiv.appendChild(videoContainer)
                break
  
              case "image":
                const imageContainer = document.createElement("div")
                imageContainer.className = "image-container"
  
                const imageTitle = document.createElement("h4")
                imageTitle.textContent = "Illustration:"
                imageContainer.appendChild(imageTitle)
  
                const img = document.createElement("img")
                img.src = content.url
                img.alt = content.description
                img.className = "response-image"
  
                const caption = document.createElement("p")
                caption.className = "image-caption"
                caption.textContent = content.description
  
                imageContainer.appendChild(img)
                imageContainer.appendChild(caption)
                contentDiv.appendChild(imageContainer)
                break
  
              case "audio":
                const audioContainer = document.createElement("div")
                audioContainer.className = "audio-container"
  
                const audioTitle = document.createElement("h4")
                audioTitle.textContent = "Audio Summary:"
                audioContainer.appendChild(audioTitle)
  
                const audioText = document.createElement("p")
                audioText.className = "audio-text"
                audioText.innerHTML = this.formatText(content.text)
  
                const playButton = document.createElement("button")
                playButton.className = "play-audio-btn"
                playButton.innerHTML = '<i class="fas fa-play"></i> Play Audio'
                playButton.addEventListener("click", () => {
                  if (window.speechSynthesis) {
                    const utterance = new SpeechSynthesisUtterance(content.text)
  
                    // Set language based on current selection
                    const language = window.groqService ? window.groqService.getCurrentLanguage() : "en"
                    utterance.lang = this.getVoiceLanguageCode(language)
  
                    // Find appropriate voice
                    const voices = window.speechSynthesis.getVoices()
                    const voice = voices.find((v) => v.lang.startsWith(utterance.lang))
                    if (voice) {
                      utterance.voice = voice
                    }
  
                    window.speechSynthesis.speak(utterance)
                  }
                })
  
                audioContainer.appendChild(audioText)
                audioContainer.appendChild(playButton)
                contentDiv.appendChild(audioContainer)
                break
            }
          })
        }
      }
  
      messageDiv.appendChild(avatarDiv)
      messageDiv.appendChild(contentDiv)
  
      return messageDiv
    }
  
    formatText(text) {
      if (!text) return ""
  
      // Convert URLs to links
      text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
  
      // Convert line breaks to <br>
      text = text.replace(/\n/g, "<br>")
  
      return text
    }
  
    scrollToBottom() {
      this.chatMessages.scrollTop = this.chatMessages.scrollHeight
    }
  
    clearChat() {
      // Clear UI
      this.chatMessages.innerHTML = ""
  
      // Create new conversation
      this.currentConversation = {
        id: Date.now().toString(),
        title: "New Conversation",
        timestamp: Date.now(),
        messages: [],
      }
  
      // Add welcome message
      const welcomeText = window.translationService
        ? window.translationService.getText("chat.welcome")
        : "Hello! I'm your AI Tutor. I can help you learn about any subject. You can ask me questions, upload files, or even send me images and audio. How can I assist you today?"
  
      this.addBotMessage({
        text: welcomeText,
        type: "text",
      })
  
      // Save empty conversation
      this.saveConversation()
      this.updateConversationHistory()
  
      console.log("Chat cleared, new conversation started")
    }
  
    startVoiceInput() {
      // Check if browser supports speech recognition
      if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
        alert("Your browser does not support speech recognition. Please try using Chrome or Edge.")
        return
      }
  
      // Create speech recognition object
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      this.recognition = new SpeechRecognition()
  
      // Set language based on current selection
      const language = window.groqService ? window.groqService.getCurrentLanguage() : "en"
      this.recognition.lang = this.getVoiceLanguageCode(language)
  
      this.recognition.continuous = false
      this.recognition.interimResults = true
  
      // Change button appearance
      this.voiceInputButton.classList.add("recording")
      this.voiceInputButton.innerHTML = '<i class="fas fa-stop"></i>'
      this.isRecording = true
  
      // Handle results
      this.recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("")
  
        this.userInput.value = transcript
  
        // Auto-resize the textarea
        this.userInput.style.height = "auto"
        this.userInput.style.height = this.userInput.scrollHeight + "px"
      }
  
      // Handle errors
      this.recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error)
        this.stopVoiceInput()
      }
  
      // Handle end of speech recognition
      this.recognition.onend = () => {
        this.stopVoiceInput()
      }
  
      // Start recognition
      this.recognition.start()
      console.log("Voice recognition started with language:", this.recognition.lang)
    }
  
    stopVoiceInput() {
      if (this.recognition) {
        this.recognition.stop()
      }
  
      // Reset button
      this.voiceInputButton.classList.remove("recording")
      this.voiceInputButton.innerHTML = '<i class="fas fa-microphone"></i>'
      this.isRecording = false
      console.log("Voice recognition stopped")
    }
  
    speakText(text) {
      if (!this.speechSynthesis) return
  
      // Cancel any ongoing speech
      this.speechSynthesis.cancel()
  
      const utterance = new SpeechSynthesisUtterance(text)
  
      // Set language based on current selection
      const language = window.groqService ? window.groqService.getCurrentLanguage() : "en"
      utterance.lang = this.getVoiceLanguageCode(language)
  
      // Find appropriate voice
      const voice = this.voices.find((v) => v.lang.startsWith(utterance.lang))
      if (voice) {
        utterance.voice = voice
      }
  
      this.speechSynthesis.speak(utterance)
      console.log("Speaking text with language:", utterance.lang)
    }
  
    getVoiceLanguageCode(language) {
      switch (language) {
        case "en":
          return "en-US"
        case "es":
          return "es-ES"
        case "fr":
          return "fr-FR"
        case "de":
          return "de-DE"
        case "zh":
          return "zh-CN"
        case "ja":
          return "ja-JP"
        case "hi":
          return "hi-IN"
        case "ar":
          return "ar-SA"
        case "ru":
          return "ru-RU"
        default:
          return "en-US"
      }
    }
  
    toggleSidebar() {
      this.sidebar.classList.toggle("active")
      console.log("Sidebar toggled")
    }
  
    changeLanguage() {
      const language = this.languageSelect.value
  
      // Update Groq service language
      if (window.groqService) {
        window.groqService.setLanguage(language)
      }
  
      // Update UI language
      if (window.translationService) {
        window.translationService.setLanguage(language)
  
        // Add message about language change
        const languageName = window.groqService ? window.groqService.languages[language] : language
  
        this.addBotMessage({
          text: `Language changed to ${languageName}`,
          type: "text",
        })
      } else {
        console.error("Translation service not initialized")
      }
    }
  
    changeModel() {
      const model = this.modelSelect.value
      if (window.groqService) {
        window.groqService.setModel(model)
  
        const modelInfo = window.groqService.models[model]
  
        // Update UI with new model
        this.addBotMessage({
          text: `AI model changed to ${modelInfo.name}. ${modelInfo.description}.`,
          type: "text",
        })
      } else {
        console.error("Groq service not initialized")
      }
    }
  
    toggleTheme() {
      document.body.classList.toggle("dark-theme")
      localStorage.setItem("darkMode", this.themeToggle.checked)
      console.log("Theme toggled, dark mode:", this.themeToggle.checked)
    }
  
    toggleVoice() {
      localStorage.setItem("voiceEnabled", this.voiceToggle.checked)
      console.log("Voice toggled, enabled:", this.voiceToggle.checked)
  
      if (this.voiceToggle.checked) {
        const voiceEnabledText = window.translationService
          ? window.translationService.getText("chat.voiceEnabled") ||
            "Text-to-speech is now enabled. I will read my responses aloud."
          : "Text-to-speech is now enabled. I will read my responses aloud."
  
        this.addBotMessage({
          text: voiceEnabledText,
          type: "text",
        })
      }
    }
  
    showUserProfile() {
      // Create a modal for user profile
      const modal = document.createElement("div")
      modal.className = "user-profile-modal"
  
      const title = window.translationService ? window.translationService.getText("profile.title") : "User Profile"
  
      const guestUser = window.translationService ? window.translationService.getText("profile.guest") : "Guest User"
  
      const guestMode = window.translationService
        ? window.translationService.getText("profile.guestMode")
        : "Using AI Tutor in guest mode"
  
      const statistics = window.translationService
        ? window.translationService.getText("profile.statistics")
        : "Statistics"
  
      const conversations = window.translationService
        ? window.translationService.getText("profile.conversations")
        : "Conversations:"
  
      const messages = window.translationService ? window.translationService.getText("profile.messages") : "Messages:"
  
      const close = window.translationService ? window.translationService.getText("profile.close") : "Close"
  
      modal.innerHTML = `
              <div class="user-profile-content">
                  <h2 style="margin-bottom: 1rem; color: var(--primary-color);">${title}</h2>
                  <div style="display: flex; align-items: center; margin-bottom: 1.5rem;">
                      <div style="width: 60px; height: 60px; border-radius: 50%; background-color: var(--primary-color); display: flex; justify-content: center; align-items: center; margin-right: 1rem;">
                          <i class="fas fa-user" style="font-size: 2rem; color: white;"></i>
                      </div>
                      <div>
                          <h3 style="margin: 0;">${guestUser}</h3>
                          <p style="margin: 0; color: var(--text-light);">${guestMode}</p>
                      </div>
                  </div>
                  <div style="margin-bottom: 1.5rem;">
                      <h4 style="margin-bottom: 0.5rem;">${statistics}</h4>
                      <p>${conversations} ${this.conversations.length}</p>
                      <p>${messages} ${this.currentConversation.messages.length}</p>
                  </div>
                  <button id="close-profile-modal" style="padding: 0.75rem; background-color: var(--primary-color); color: white; border: none; border-radius: var(--radius); width: 100%; cursor: pointer;">${close}</button>
              </div>
          `
  
      document.body.appendChild(modal)
  
      // Add event listener to close button
      document.getElementById("close-profile-modal").addEventListener("click", () => {
        document.body.removeChild(modal)
      })
  
      // Close modal when clicking outside
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal)
        }
      })
    }
  
    removeMessageFromConversation(messageId) {
      // Find the message in the current conversation
      const messageIndex = this.currentConversation.messages.findIndex((m) => m.id === messageId)
  
      if (messageIndex !== -1) {
        // Remove the message
        this.currentConversation.messages.splice(messageIndex, 1)
  
        // Save the updated conversation
        this.saveConversation()
      }
    }
  
    saveConversation() {
      // Update conversation title based on first message if it's a new conversation
      if (this.currentConversation.messages.length > 0 && this.currentConversation.title === "New Conversation") {
        const firstUserMessage = this.currentConversation.messages.find((m) => m.role === "user")
        if (firstUserMessage) {
          const content =
            typeof firstUserMessage.content === "string" ? firstUserMessage.content : firstUserMessage.content.text || ""
  
          this.currentConversation.title = content.substring(0, 30) + (content.length > 30 ? "..." : "")
        }
      }
  
      // Find existing conversation or add new one
      const existingIndex = this.conversations.findIndex((c) => c.id === this.currentConversation.id)
      if (existingIndex >= 0) {
        this.conversations[existingIndex] = { ...this.currentConversation }
      } else {
        this.conversations.push({ ...this.currentConversation })
      }
  
      // Save to localStorage
      localStorage.setItem("conversations", JSON.stringify(this.conversations))
    }
  
    loadConversations() {
      const savedConversations = localStorage.getItem("conversations")
      if (savedConversations) {
        try {
          this.conversations = JSON.parse(savedConversations)
          this.updateConversationHistory()
        } catch (error) {
          console.error("Error parsing saved conversations:", error)
          this.conversations = []
        }
      }
    }
  
    updateConversationHistory() {
      // Clear current history
      this.historyList.innerHTML = ""
  
      // Sort conversations by timestamp (newest first)
      const sortedConversations = [...this.conversations].sort((a, b) => b.timestamp - a.timestamp)
  
      // Add conversations to history list
      sortedConversations.forEach((conversation) => {
        const listItem = document.createElement("li")
        listItem.className = "history-item"
        listItem.textContent = conversation.title
        listItem.dataset.id = conversation.id
  
        // Highlight current conversation
        if (conversation.id === this.currentConversation.id) {
          listItem.style.backgroundColor = "var(--primary-light)"
          listItem.style.color = "white"
        }
  
        // Add click event to load conversation
        listItem.addEventListener("click", () => {
          this.loadConversation(conversation.id)
        })
  
        this.historyList.appendChild(listItem)
      })
    }
  
    loadConversation(conversationId) {
      const conversation = this.conversations.find((c) => c.id === conversationId)
      if (!conversation) return
  
      // Clear current chat
      this.chatMessages.innerHTML = ""
  
      // Set current conversation
      this.currentConversation = JSON.parse(JSON.stringify(conversation))
  
      // Rebuild chat UI
      conversation.messages.forEach((msg) => {
        if (msg.role === "user") {
          const content = typeof msg.content === "string" ? { text: msg.content, type: "text" } : msg.content
  
          const messageElement = this.createMessageElement("user", content, msg.id)
          this.chatMessages.appendChild(messageElement)
  
          // Add message actions
          if (window.messageActions) {
            window.messageActions.addActionsToMessage(messageElement, true)
          }
        } else {
          const content = typeof msg.content === "string" ? { text: msg.content, type: "text" } : msg.content
  
          const messageElement = this.createMessageElement("bot", content, msg.id)
          this.chatMessages.appendChild(messageElement)
  
          // Add message actions
          if (window.messageActions) {
            window.messageActions.addActionsToMessage(messageElement, false)
          }
        }
      })
  
      this.scrollToBottom()
      this.updateConversationHistory()
    }
  }
  
  // Initialize chat app when the DOM is loaded
  document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded, initializing ChatApp")
  
    // Make sure all services are initialized before creating the chat app
    setTimeout(() => {
      window.chatApp = new ChatApp()
    }, 500) // Small delay to ensure other services are initialized
  })
  
  // Settings dropdown toggle script
  document.addEventListener("DOMContentLoaded", () => {
    const settingsIcon = document.getElementById("settings-icon")
    const settingsDropdown = document.getElementById("settings-dropdown")
  
    settingsIcon.addEventListener("click", (e) => {
      e.stopPropagation()
      settingsDropdown.classList.toggle("hidden")
    })
  
    document.addEventListener("click", (e) => {
      if (!settingsIcon.contains(e.target) && !settingsDropdown.contains(e.target)) {
        settingsDropdown.classList.add("hidden")
      }
    })
  })
  