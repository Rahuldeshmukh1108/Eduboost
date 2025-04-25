// DOM Elements
const sidebar = document.getElementById("sidebar")
const conversationsList = document.getElementById("conversations-list")
const messagesContainer = document.getElementById("messages-container")
const welcomeCard = document.getElementById("welcome-card")
const messageInput = document.getElementById("message-input")
const chatForm = document.getElementById("chat-form")
const sendButton = document.getElementById("send-button")
const uploadButton = document.getElementById("upload-button")
const fileInput = document.getElementById("file-input")
const micButton = document.getElementById("mic-button")
const ttsButton = document.getElementById("tts-button")
const clearButton = document.getElementById("clear-button")
const fileAlert = document.getElementById("file-alert")
const fileName = document.getElementById("file-name")
const removeFile = document.getElementById("remove-file")
const themeToggle = document.getElementById("theme-toggle")
const settingsButton = document.getElementById("settings-button")
const settingsModal = document.getElementById("settings-modal")
const closeSettings = document.getElementById("close-settings")
const themeSelect = document.getElementById("theme-select")
const languageSelect = document.getElementById("language-select")
const modelSelect = document.getElementById("model-select")
const ttsToggle = document.getElementById("tts-toggle")
const apiKeyInput = document.getElementById("api-key-input")
const saveApiKey = document.getElementById("save-api-key")
const tabButtons = document.querySelectorAll(".tab-button")
const tabPanes = document.querySelectorAll(".tab-pane")
const startLearning = document.getElementById("start-learning")
const exampleButtons = document.querySelectorAll(".example-button")
const newChatButton = document.getElementById("new-chat-button")
const sidebarToggle = document.getElementById("sidebar-toggle")
const menuToggle = document.getElementById("menu-toggle")
const shareModal = document.getElementById("share-modal")
const closeShare = document.getElementById("close-share")
const copyLink = document.getElementById("copy-link")
const exportText = document.getElementById("export-text")
const exportJson = document.getElementById("export-json")
const deleteModal = document.getElementById("delete-modal")
const closeDelete = document.getElementById("close-delete")
const cancelDelete = document.getElementById("cancel-delete")
const confirmDelete = document.getElementById("confirm-delete")
const imageInput = document.getElementById("image-input") // New image input element

// State
let conversations = []
let currentConversationId = null
let messages = []
let isLoading = false
let isRecording = false
let uploadedFile = null
let uploadedImage = null // New state for uploaded image
let fileContent = ""
let mediaRecorder = null
let audioChunks = []
let conversationToDelete = null
let isOnline = navigator.onLine
let settings = {
  theme: "light",
  language: "en",
  textToSpeech: false,
  selectedModel: "llama-3.1-8b-instant", // Default model
  groqApiKey: "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",
}

// Default backend API URL
const DEFAULT_API_URL = window.location.origin

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadSettings()
  initializeApp()

  // Check online status
  window.addEventListener("online", handleOnlineStatusChange)
  window.addEventListener("offline", handleOnlineStatusChange)
  handleOnlineStatusChange()
})

function initializeApp() {
  loadConversations()
  updateUI()

  // Check if system prefers dark theme
  if (settings.theme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    document.body.classList.toggle("dark-theme", prefersDark)
    updateThemeIcon(prefersDark)
  } else {
    document.body.classList.toggle("dark-theme", settings.theme === "dark")
    updateThemeIcon(settings.theme === "dark")
  }

  // Setup event listeners after all elements are loaded
  setupEventListeners()

  // Handle shared conversation if any
  handleSharedConversation()

  // Auto-resize textarea
  if (messageInput) {
    messageInput.addEventListener("input", autoResizeTextarea)
  }
}

function autoResizeTextarea() {
  messageInput.style.height = "auto"
  messageInput.style.height = messageInput.scrollHeight + "px"
}

function handleOnlineStatusChange() {
  isOnline = navigator.onLine
  if (!isOnline) {
    showToast("Offline Mode", "You are currently offline. Some features may be limited.", true)
  } else {
    showToast("Online Mode", "You are back online. All features are available.")
  }
}

function setupEventListeners() {
  // Main form submission
  if (chatForm) {
    chatForm.addEventListener("submit", handleSubmit)
  }

  // Input validation
  if (messageInput) {
    messageInput.addEventListener("input", validateInput)
  }

  // File handling
  if (uploadButton) {
    uploadButton.addEventListener("click", () => {
      // Show file type selection menu
      const fileTypeMenu = document.getElementById("file-type-menu")
      if (fileTypeMenu) {
        fileTypeMenu.classList.toggle("show")
      }
    })
  }

  if (fileInput) {
    fileInput.addEventListener("change", handleFileChange)
  }

  // Image handling
  if (imageInput) {
    imageInput.addEventListener("change", handleImageChange)
  }

  // Audio recording
  if (micButton) {
    micButton.addEventListener("click", toggleRecording)
  }

  // Text to speech
  if (ttsButton) {
    ttsButton.addEventListener("click", toggleTextToSpeech)
  }

  // Clear conversation
  if (clearButton) {
    clearButton.addEventListener("click", clearConversation)
  }

  // File removal
  if (removeFile) {
    removeFile.addEventListener("click", removeUploadedFile)
  }

  // Theme toggle
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme)
  }

  // Settings modal
  if (settingsButton) {
    settingsButton.addEventListener("click", openSettings)
  }
  if (closeSettings) {
    closeSettings.addEventListener("click", closeSettingsModal)
  }

  // Settings changes
  if (themeSelect) {
    themeSelect.addEventListener("change", updateThemeSetting)
  }
  if (languageSelect) {
    languageSelect.addEventListener("change", updateLanguageSetting)
  }
  if (modelSelect) {
    modelSelect.addEventListener("change", updateModelSetting)
  }
  if (ttsToggle) {
    ttsToggle.addEventListener("change", updateTTSSetting)
  }

  // API Key
  if (saveApiKey) {
    saveApiKey.addEventListener("click", saveGroqApiKey)
  }

  // Start learning button
  if (startLearning) {
    startLearning.addEventListener("click", () => switchTab("chat"))
  }

  // New chat button
  if (newChatButton) {
    newChatButton.addEventListener("click", createNewConversation)
  }

  // Sidebar toggle
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", toggleSidebar)
  }
  if (menuToggle) {
    menuToggle.addEventListener("click", toggleSidebar)
  }

  // Share modal
  if (closeShare) {
    closeShare.addEventListener("click", closeShareModal)
  }
  if (copyLink) {
    copyLink.addEventListener("click", copyConversationLink)
  }
  if (exportText) {
    exportText.addEventListener("click", exportConversationAsText)
  }
  if (exportJson) {
    exportJson.addEventListener("click", exportConversationAsJson)
  }

  // Delete modal
  if (closeDelete) {
    closeDelete.addEventListener("click", closeDeleteModal)
  }
  if (cancelDelete) {
    cancelDelete.addEventListener("click", closeDeleteModal)
  }
  if (confirmDelete) {
    confirmDelete.addEventListener("click", deleteSelectedConversation)
  }

  // Tab buttons
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tab = button.dataset.tab
      switchTab(tab)
    })
  })

  // Example buttons
  exampleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (messageInput) {
        messageInput.value = button.dataset.text
        validateInput()
        autoResizeTextarea()
      }
    })
  })

  // Close file type menu when clicking outside
  document.addEventListener("click", (e) => {
    const fileTypeMenu = document.getElementById("file-type-menu")
    const uploadBtn = document.getElementById("upload-button")

    if (
      fileTypeMenu &&
      fileTypeMenu.classList.contains("show") &&
      !fileTypeMenu.contains(e.target) &&
      e.target !== uploadBtn
    ) {
      fileTypeMenu.classList.remove("show")
    }
  })
}

function loadSettings() {
  const savedSettings = localStorage.getItem("aiTutorSettings")
  if (savedSettings) {
    const parsedSettings = JSON.parse(savedSettings)
    // Merge saved settings with defaults
    settings = {
      ...settings,
      ...parsedSettings,
    }

    // Update UI based on settings
    if (themeSelect) themeSelect.value = settings.theme
    if (languageSelect) languageSelect.value = settings.language
    if (ttsToggle) ttsToggle.checked = settings.textToSpeech
    if (modelSelect) modelSelect.value = settings.selectedModel
    if (apiKeyInput && settings.groqApiKey) {
      apiKeyInput.value = settings.groqApiKey
    }

    // Update TTS button icon
    updateTTSIcon()
  } else {
    saveSettings()
  }
}

function saveSettings() {
  localStorage.setItem("aiTutorSettings", JSON.stringify(settings))
}

function saveGroqApiKey() {
  if (!apiKeyInput) return

  const apiKey = apiKeyInput.value.trim()
  if (apiKey) {
    settings.groqApiKey = apiKey
    saveSettings()
    showToast("API Key Saved", "Your Groq API key has been saved")
    closeSettingsModal()
  } else {
    showToast("Error", "Please enter a valid API key", true)
  }
}

function getApiUrl() {
  return settings.apiUrl || DEFAULT_API_URL
}

function loadConversations() {
  const savedConversations = localStorage.getItem("aiTutorConversations")
  if (savedConversations) {
    try {
      conversations = JSON.parse(savedConversations)
      renderConversationsList()

      // Load last active conversation
      const lastActiveId = localStorage.getItem("aiTutorActiveConversation")
      if (lastActiveId && conversations.find((c) => c.id === lastActiveId)) {
        loadConversation(lastActiveId)
      } else if (conversations.length > 0) {
        loadConversation(conversations[0].id)
      } else {
        createNewConversation()
      }
    } catch (error) {
      console.error("Error loading conversations:", error)
      showToast("Error", "Failed to load saved conversations", true)
      createNewConversation()
    }
  } else {
    createNewConversation()
  }
}

function saveConversations() {
  localStorage.setItem("aiTutorConversations", JSON.stringify(conversations))
  if (currentConversationId) {
    localStorage.setItem("aiTutorActiveConversation", currentConversationId)
  }
}

function createNewConversation() {
  const id = Date.now().toString()
  const newConversation = {
    id,
    title: "New Conversation",
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  conversations.unshift(newConversation)
  saveConversations()
  renderConversationsList()
  loadConversation(id)
}

function loadConversation(id) {
  const conversation = conversations.find((c) => c.id === id)
  if (!conversation) return

  currentConversationId = id
  messages = [...conversation.messages]

  // Update UI
  renderMessages()
  updateConversationActiveState()

  // Show/hide welcome card
  if (welcomeCard) {
    if (messages.length === 0) {
      welcomeCard.classList.remove("hidden")
      if (clearButton) clearButton.classList.add("hidden")
    } else {
      welcomeCard.classList.add("hidden")
      if (clearButton) clearButton.classList.remove("hidden")
    }
  }

  // Clear any uploaded files
  removeUploadedFile()
}

function updateConversationActiveState() {
  const items = document.querySelectorAll(".conversation-item")
  items.forEach((item) => {
    item.classList.toggle("active", item.dataset.id === currentConversationId)
  })
}

function updateConversationTitle(message) {
  if (!currentConversationId) return

  const conversation = conversations.find((c) => c.id === currentConversationId)
  if (!conversation) return

  // If this is the first message, use it as the title
  if (conversation.messages.length === 0) {
    // Limit title length
    let title = message.substring(0, 30)
    if (message.length > 30) title += "..."
    conversation.title = title

    saveConversations()
    renderConversationsList()
  }
}

function renderConversationsList() {
  if (!conversationsList) return

  conversationsList.innerHTML = ""

  if (conversations.length === 0) {
    conversationsList.innerHTML = `
      <div class="empty-conversations">
        <p>No conversations yet</p>
      </div>
    `
    return
  }

  conversations.forEach((conversation) => {
    const item = document.createElement("div")
    item.classList.add("conversation-item")
    item.dataset.id = conversation.id
    if (conversation.id === currentConversationId) {
      item.classList.add("active")
    }

    item.innerHTML = `
      <div class="conversation-title">${conversation.title}</div>
      <div class="conversation-actions">
        <button class="conversation-action share-conversation" title="Share">
          <i class="fas fa-share-alt"></i>
        </button>
        <button class="conversation-action delete-conversation" title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `

    // Add event listeners
    item.querySelector(".conversation-title").addEventListener("click", () => {
      loadConversation(conversation.id)
    })

    item.querySelector(".share-conversation").addEventListener("click", (e) => {
      e.stopPropagation()
      openShareModal(conversation.id)
    })

    item.querySelector(".delete-conversation").addEventListener("click", (e) => {
      e.stopPropagation()
      openDeleteModal(conversation.id)
    })

    conversationsList.appendChild(item)
  })
}

function validateInput() {
  if (!sendButton || !messageInput) return
  const hasInput = messageInput.value.trim() !== "" || uploadedFile !== null || uploadedImage !== null
  sendButton.disabled = !hasInput
}

async function handleSubmit(e) {
  e.preventDefault()
  if (isLoading) return
  if (!messageInput) return

  const userInput = messageInput.value.trim()
  if (!userInput && !uploadedFile && !uploadedImage) return

  let userMessage = userInput

  // If there's file content, add it to the message
  if (fileContent) {
    userMessage += `\n\nI've uploaded a file with the following content:\n${fileContent}`
  }

  // If there's an image, add a note about it
  if (uploadedImage) {
    userMessage += `\n\nI've uploaded an image for analysis.`
  }

  // Add user message
  addMessage("user", userMessage, uploadedImage ? { type: "image", src: uploadedImage } : null)

  // Update conversation title if this is the first message
  updateConversationTitle(userMessage)

  // Clear input and file
  messageInput.value = ""
  messageInput.style.height = "auto"
  removeUploadedFile()
  validateInput()

  // Send to API
  await sendMessage(userMessage)
}

async function sendMessage(content) {
  setLoading(true)

  try {
    let responseText

    if (isOnline) {
      // Use Groq API for AI response
      responseText = await getGroqResponse(content)
    } else {
      // Fallback to simulated response in offline mode
      responseText = await simulateAIResponse(content)
    }

    // Process the response to enhance it with links and videos
    const enhancedResponse = enhanceResponseWithLinks(responseText)

    // Add AI response
    addMessage("assistant", enhancedResponse)

    // Text-to-speech if enabled
    if (settings.textToSpeech) {
      // Only speak the text part, not the HTML
      const textOnly = stripHtml(responseText)
      speakText(textOnly)
    }
  } catch (error) {
    console.error("Error sending message:", error)

    // More user-friendly error message
    let errorMessage = "Failed to get response from AI"

    if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
      errorMessage = "Cannot connect to AI server. The app is currently running in offline mode."
    } else if (error.message.includes("API key")) {
      errorMessage = "Invalid or missing Groq API key. Please check your settings."
    } else {
      errorMessage = `Error: ${error.message}`
    }

    showToast("Error", errorMessage, true)

    // Add error as system message to conversation
    addMessage("system", `Error: ${errorMessage}`)
  } finally {
    setLoading(false)
  }
}

// Function to strip HTML tags for text-to-speech
function stripHtml(html) {
  const doc = new DOMParser().parseFromString(html, "text/html")
  return doc.body.textContent || ""
}

// Function to enhance response with links and YouTube videos
function enhanceResponseWithLinks(text) {
  // Convert URLs to clickable links
  let enhanced = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')

  // Convert YouTube mentions to embedded videos or links
  enhanced = enhanced.replace(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/g, (match, videoId) => {
    return `
        <div class="video-suggestion">
          <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" rel="noopener noreferrer">
            <div class="video-thumbnail">
              <img src="https://img.youtube.com/vi/${videoId}/mqdefault.jpg" alt="YouTube Video Thumbnail">
              <div class="play-button"><i class="fas fa-play"></i></div>
            </div>
            <div class="video-title">YouTube Video</div>
          </a>
        </div>
      `
  })

  // Add video suggestions based on keywords
  const keywords = {
    photosynthesis: "fHqKqXsjkXI",
    "world war 2": "Objl2dFYWMg",
    "quadratic equation": "ZBalWWHYFQc",
    "python programming": "kqtD5dpn9C8",
    "machine learning": "ukzFI9rgwfU",
    "artificial intelligence": "mJeNghZXtMo",
    "climate change": "ifrHogDujXw",
    "quantum physics": "7ku5zr5uyFU",
  }

  // Check if any keywords are in the text and add video suggestions
  let videoSuggestions = ""
  for (const [keyword, videoId] of Object.entries(keywords)) {
    if (text.toLowerCase().includes(keyword.toLowerCase())) {
      videoSuggestions += `
        <div class="video-suggestion">
          <p class="suggestion-label">Suggested video about ${keyword}:</p>
          <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" rel="noopener noreferrer">
            <div class="video-thumbnail">
              <img src="https://img.youtube.com/vi/${videoId}/mqdefault.jpg" alt="YouTube Video Thumbnail">
              <div class="play-button"><i class="fas fa-play"></i></div>
            </div>
            <div class="video-title">Learn about ${keyword}</div>
          </a>
        </div>
      `
      break // Only add one suggestion to avoid cluttering
    }
  }

  if (videoSuggestions) {
    enhanced += `<div class="video-suggestions-container">${videoSuggestions}</div>`
  }

  // Add website suggestions based on keywords
  const websites = {
    math: [
      { name: "Khan Academy", url: "https://www.khanacademy.org/math" },
      { name: "Wolfram Alpha", url: "https://www.wolframalpha.com/" },
    ],
    physics: [
      { name: "Physics Classroom", url: "https://www.physicsclassroom.com/" },
      { name: "HyperPhysics", url: "http://hyperphysics.phy-astr.gsu.edu/hbase/index.html" },
    ],
    chemistry: [
      { name: "Chemguide", url: "https://www.chemguide.co.uk/" },
      { name: "Chemistry LibreTexts", url: "https://chem.libretexts.org/" },
    ],
    history: [
      { name: "History.com", url: "https://www.history.com/" },
      { name: "Khan Academy History", url: "https://www.khanacademy.org/humanities/world-history" },
    ],
    programming: [
      { name: "W3Schools", url: "https://www.w3schools.com/" },
      { name: "MDN Web Docs", url: "https://developer.mozilla.org/" },
    ],
  }

  let websiteSuggestions = ""
  for (const [topic, sites] of Object.entries(websites)) {
    if (text.toLowerCase().includes(topic.toLowerCase())) {
      websiteSuggestions += `<div class="website-suggestions"><p>Useful resources for ${topic}:</p><ul>`
      sites.forEach((site) => {
        websiteSuggestions += `<li><a href="${site.url}" target="_blank" rel="noopener noreferrer">${site.name}</a></li>`
      })
      websiteSuggestions += `</ul></div>`
      break // Only add one set of suggestions
    }
  }

  if (websiteSuggestions) {
    enhanced += websiteSuggestions
  }

  return enhanced
}

// Get response from Groq API
async function getGroqResponse(userMessage) {
  try {
    // Check if API key is available
    if (!settings.groqApiKey) {
      throw new Error("API key not found. Please add your Groq API key in settings.")
    }

    // Prepare conversation history in the format Groq expects
    const conversationHistory = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }))

    // Add the new user message
    conversationHistory.push({
      role: "user",
      content: userMessage,
    })

    // System message to define the AI's behavior
    const systemMessage = {
      role: "system",
      content:
        "You are an AI tutor designed to help students learn. Provide clear, concise, and accurate information. Be encouraging and supportive. When appropriate, include relevant website links and YouTube video suggestions. Format your responses with markdown for better readability.",
    }

    // Prepare the request body
    const requestBody = {
      messages: [systemMessage, ...conversationHistory],
      model: settings.selectedModel,
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    }

    // Make the API request to Groq
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${settings.groqApiKey}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || "Failed to get response from Groq API")
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error("Error with Groq API:", error)
    throw new Error("Failed to get response from Groq. " + error.message)
  }
}

// Simulate AI response for offline mode or when API is unavailable
async function simulateAIResponse(userMessage) {
  // Add a small delay to simulate network request
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Simple keyword-based responses
  const lowerMessage = userMessage.toLowerCase()

  // Check if the message contains an image
  const hasImage =
    messages.length > 0 &&
    messages[messages.length - 1].attachment &&
    messages[messages.length - 1].attachment.type === "image"

  if (hasImage) {
    return "I can see you've uploaded an image. From what I can observe, this appears to be an image that you'd like me to analyze. In online mode, I could provide detailed analysis of the image content. For educational purposes, I could identify objects, read text, or explain diagrams in the image. You can try asking specific questions about elements in the image for a more focused response."
  }

  if (lowerMessage.includes("hello") || lowerMessage.includes("hi ")) {
    return "Hello! I'm your AI tutor. How can I help you with your studies today? I can provide explanations, suggest resources, and even recommend YouTube videos on topics you're studying."
  }

  if (lowerMessage.includes("photosynthesis")) {
    return "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll. During photosynthesis, plants take in carbon dioxide (CO2) and water (H2O) from the air and soil. Within the plant cell, the water is oxidized, meaning it loses electrons, while the carbon dioxide is reduced, meaning it gains electrons. This transforms the water into oxygen and the carbon dioxide into glucose. The plant then releases the oxygen back into the air, and stores energy within the glucose molecules.\n\nYou can learn more at https://www.khanacademy.org/science/biology/photosynthesis-in-plants"
  }

  if (lowerMessage.includes("world war ii") || lowerMessage.includes("world war 2")) {
    return "The key events that led to World War II include:\n\n1. The Treaty of Versailles (1919) - Imposed harsh penalties on Germany after WWI, creating resentment.\n\n2. The Great Depression (1929) - Global economic crisis that fueled extremist political movements.\n\n3. Rise of fascism - Hitler in Germany (1933), Mussolini in Italy (1922), and militarism in Japan.\n\n4. German rearmament and territorial expansion - Remilitarization of the Rhineland (1936), Anschluss with Austria (1938), and annexation of Czechoslovakia (1938-39).\n\n5. Failure of appeasement - The Munich Agreement (1938) and other attempts to satisfy Hitler's demands failed to prevent war.\n\n6. Nazi-Soviet Pact (1939) - Non-aggression pact that freed Hitler to invade Poland.\n\n7. Invasion of Poland (September 1, 1939) - The direct trigger for Britain and France declaring war on Germany.\n\nYou can watch a great overview at https://youtu.be/Objl2dFYWMg"
  }

  if (lowerMessage.includes("quadratic")) {
    return "To solve quadratic equations of the form ax² + bx + c = 0:\n\n1. Try factoring: Rewrite as (px + q)(rx + s) = 0, then solve px + q = 0 and rx + s = 0.\n\n2. Use the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a\n   - The discriminant (b² - 4ac) tells you how many solutions exist:\n   - If b² - 4ac > 0: Two real solutions\n   - If b² - 4ac = 0: One real solution (repeated)\n   - If b² - 4ac < 0: Two complex solutions\n\n3. Complete the square: Rearrange to (x + p)² = q form.\n\nExample: For x² - 5x + 6 = 0\nFactoring: (x - 2)(x - 3) = 0\nSolutions: x = 2 or x = 3\n\nCheck out this helpful video: https://youtu.be/ZBalWWHYFQc where you can learn more about solving quadratic equations step by step."
  }

  // Default response for other queries
  return (
    "I'm currently running in offline mode, so my responses are limited. In online mode, I could provide a detailed answer about " +
    userMessage.split(" ").slice(0, 3).join(" ") +
    "... and help you understand this topic better. I could also suggest relevant websites and YouTube videos to enhance your learning. Try one of the example questions or connect to a server for full functionality."
  )
}

function addMessage(role, content, attachment = null) {
  const message = {
    id: Date.now().toString(),
    role,
    content,
    attachment,
    timestamp: new Date(),
  }

  messages.push(message)

  // Update conversation in storage
  if (currentConversationId) {
    const conversation = conversations.find((c) => c.id === currentConversationId)
    if (conversation) {
      conversation.messages = messages
      conversation.updatedAt = new Date()
      saveConversations()
    }
  }

  if (welcomeCard && messages.length > 0) {
    welcomeCard.classList.add("hidden")
    if (clearButton) clearButton.classList.remove("hidden")
  }

  renderMessage(message)
  scrollToBottom()
}

function renderMessages() {
  if (!messagesContainer) return

  // Clear existing messages
  messagesContainer.innerHTML = ""

  if (messages.length === 0 && welcomeCard) {
    messagesContainer.appendChild(welcomeCard)
    return
  }

  // Render all messages
  messages.forEach((message) => {
    renderMessage(message)
  })

  scrollToBottom()
}

function renderMessage(message) {
  if (!messagesContainer) return

  const messageElement = document.createElement("div")
  messageElement.classList.add("message", message.role)

  const bubble = document.createElement("div")
  bubble.classList.add("message-bubble")

  const content = document.createElement("div")
  content.classList.add("message-content")

  // For system messages (like errors), use red text
  if (message.role === "system") {
    content.classList.add("error-message")
  }

  // Process content for markdown-like formatting
  const formattedContent = formatMessageContent(message.content)
  content.innerHTML = formattedContent

  // If there's an image attachment, add it to the message
  if (message.attachment && message.attachment.type === "image") {
    const imageContainer = document.createElement("div")
    imageContainer.classList.add("message-image")

    const image = document.createElement("img")
    image.src = message.attachment.src
    image.alt = "Uploaded image"
    image.classList.add("uploaded-image")

    imageContainer.appendChild(image)
    bubble.appendChild(imageContainer)
  }

  const time = document.createElement("div")
  time.classList.add("message-time")
  time.textContent = new Date(message.timestamp).toLocaleTimeString()

  bubble.appendChild(content)
  bubble.appendChild(time)
  messageElement.appendChild(bubble)

  messagesContainer.appendChild(messageElement)
}

// Simple formatter for message content
function formatMessageContent(content) {
  // Replace newlines with <br>
  let formatted = content.replace(/\n/g, "<br>")

  // Simple code block formatting
  formatted = formatted.replace(/```([\s\S]*?)```/g, "<pre>$1</pre>")

  // Inline code
  formatted = formatted.replace(/`([^`]+)`/g, "<code>$1</code>")

  // Bold text
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

  // Italic text
  formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>")

  // Headers
  formatted = formatted.replace(/^# (.*?)$/gm, "<h1>$1</h1>")
  formatted = formatted.replace(/^## (.*?)$/gm, "<h2>$1</h2>")
  formatted = formatted.replace(/^### (.*?)$/gm, "<h3>$1</h3>")

  // Lists
  formatted = formatted.replace(/^\d+\. (.*?)$/gm, "<li>$1</li>")
  formatted = formatted.replace(/^- (.*?)$/gm, "<li>$1</li>")

  return formatted
}

function scrollToBottom() {
  if (messagesContainer) {
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }
}

function setLoading(loading) {
  isLoading = loading
  if (!sendButton) return

  sendButton.disabled = loading

  if (loading) {
    sendButton.innerHTML = '<div class="loading"></div>'
  } else {
    sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>'
    validateInput()
  }
}

function handleFileChange(e) {
  if (!e.target.files || !e.target.files[0]) return

  const file = e.target.files[0]
  uploadFile(file)
}

function handleImageChange(e) {
  if (!e.target.files || !e.target.files[0]) return

  const file = e.target.files[0]

  // Check if file is an image
  if (!file.type.startsWith("image/")) {
    showToast("Error", "Please select an image file", true)
    return
  }

  uploadImage(file)
}

async function uploadFile(file) {
  uploadedFile = file
  if (fileName) fileName.textContent = `File: ${file.name}`
  if (fileAlert) fileAlert.classList.remove("hidden")
  validateInput()

  setLoading(true)

  try {
    // Process file locally since we're in offline mode
    if (
      file.type.startsWith("text/") ||
      file.type === "application/json" ||
      file.name.endsWith(".md") ||
      file.name.endsWith(".csv")
    ) {
      const reader = new FileReader()

      reader.onload = (e) => {
        fileContent = e.target.result
        showToast("File Loaded", `${file.name} has been processed locally`)
        setLoading(false)
      }

      reader.onerror = () => {
        console.error("Error reading file")
        showToast("Error", "Failed to read file contents", true)
        removeUploadedFile()
        setLoading(false)
      }

      reader.readAsText(file)
      return
    }

    // For non-text files, just store the file info
    fileContent = `[File: ${file.name} (${file.type}, ${(file.size / 1024).toFixed(2)} KB)]`
    showToast("File Loaded", `${file.name} has been processed locally`)
  } catch (error) {
    console.error("Error processing file:", error)

    // Fallback to file name only
    fileContent = `[File: ${file.name} (${file.type}, ${(file.size / 1024).toFixed(2)} KB)]`
    showToast("Limited File Support", "Only basic file information is available in offline mode", true)
  } finally {
    setLoading(false)
  }
}

async function uploadImage(file) {
  setLoading(true)

  try {
    const reader = new FileReader()

    reader.onload = (e) => {
      uploadedImage = e.target.result
      if (fileName) fileName.textContent = `Image: ${file.name}`
      if (fileAlert) fileAlert.classList.remove("hidden")
      validateInput()
      showToast("Image Loaded", `${file.name} has been uploaded for analysis`)
      setLoading(false)
    }

    reader.onerror = () => {
      console.error("Error reading image file")
      showToast("Error", "Failed to read image file", true)
      removeUploadedFile()
      setLoading(false)
    }

    reader.readAsDataURL(file)
  } catch (error) {
    console.error("Error processing image:", error)
    showToast("Error", "Failed to process image", true)
    setLoading(false)
  }
}

function removeUploadedFile() {
  uploadedFile = null
  uploadedImage = null
  fileContent = ""
  if (fileAlert) fileAlert.classList.add("hidden")
  if (fileInput) fileInput.value = ""
  if (imageInput) imageInput.value = ""
  validateInput()
}

function toggleRecording() {
  if (isRecording) {
    stopRecording()
  } else {
    startRecording()
  }
}

async function startRecording() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    showToast("Error", "Audio recording is not supported in this browser", true)
    return
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(stream)
    audioChunks = []

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data)
      }
    }

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" })
      await handleAudioTranscription(audioBlob)

      // Stop all tracks
      stream.getTracks().forEach((track) => track.stop())
    }

    mediaRecorder.start()
    isRecording = true
    if (micButton) micButton.classList.add("active")

    showToast("Recording Started", "Speak now. Click the mic button again to stop.")
  } catch (error) {
    console.error("Error starting recording:", error)
    showToast("Error", "Failed to start recording. Please check microphone permissions.", true)
  }
}

function stopRecording() {
  if (mediaRecorder && isRecording) {
    mediaRecorder.stop()
    isRecording = false
    if (micButton) micButton.classList.remove("active")
  }
}

async function handleAudioTranscription(audioBlob) {
  setLoading(true)

  try {
    // Use browser's SpeechRecognition as we're in offline mode
    if (isOnline) {
      // In a real implementation, this would send the audio to a speech-to-text API
      // For this example, we'll use the browser's SpeechRecognition API

      if (window.webkitSpeechRecognition || window.SpeechRecognition) {
        try {
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
          const recognition = new SpeechRecognition()
          recognition.lang = settings.language || "en-US"

          recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript
            if (messageInput) {
              messageInput.value = transcript
              autoResizeTextarea()
              validateInput()
            }
            showToast("Speech Recognized", "Your speech has been converted to text")
          }

          recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error)
            showToast("Error", "Failed to transcribe speech with browser", true)
          }

          recognition.start()
        } catch (fallbackError) {
          console.error("Browser speech recognition failed:", fallbackError)
          simulateTranscription()
        }
      } else {
        simulateTranscription()
      }
    } else {
      simulateTranscription()
    }
  } catch (error) {
    console.error("Error transcribing audio:", error)
    showToast("Error", "Speech-to-text service unavailable", true)
    simulateTranscription()
  } finally {
    setLoading(false)
  }
}

function simulateTranscription() {
  // Simulate a simple transcription for demo purposes
  setTimeout(() => {
    if (messageInput) {
      messageInput.value = "This is a simulated transcription. Speech recognition works better online."
      autoResizeTextarea()
      validateInput()
    }
    showToast("Simulated Transcription", "Real speech recognition requires online mode", true)
  }, 1000)
}

function toggleTextToSpeech() {
  settings.textToSpeech = !settings.textToSpeech
  saveSettings()
  updateTTSIcon()

  if (settings.textToSpeech) {
    showToast("Text-to-Speech", "Text-to-speech has been enabled")

    // Read the last assistant message if available
    const lastAssistantMessage = messages.filter((m) => m.role === "assistant").pop()
    if (lastAssistantMessage) {
      speakText(stripHtml(lastAssistantMessage.content))
    }
  } else {
    // Stop any ongoing speech
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }
  }
}

function updateTTSIcon() {
  if (!ttsButton) return

  if (settings.textToSpeech) {
    ttsButton.innerHTML = '<i class="fas fa-volume-up"></i>'
    if (ttsToggle) ttsToggle.checked = true
  } else {
    ttsButton.innerHTML = '<i class="fas fa-volume-mute"></i>'
    if (ttsToggle) ttsToggle.checked = false
  }
}

function speakText(text) {
  if ("speechSynthesis" in window) {
    // Stop any ongoing speech
    window.speechSynthesis.cancel()

    // Clean up text for speech (remove markdown, etc.)
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/```([\s\S]*?)```/g, "")
      .replace(/\n/g, " ")

    const utterance = new SpeechSynthesisUtterance(cleanText)

    // Set language based on settings
    switch (settings.language) {
      case "es":
        utterance.lang = "es-ES"
        break
      case "fr":
        utterance.lang = "fr-FR"
        break
      case "de":
        utterance.lang = "de-DE"
        break
      case "zh":
        utterance.lang = "zh-CN"
        break
      default:
        utterance.lang = "en-US"
    }

    // Get available voices
    const voices = window.speechSynthesis.getVoices()

    // Try to find a voice that matches the language
    const voice = voices.find((v) => v.lang.startsWith(utterance.lang.split("-")[0]))
    if (voice) {
      utterance.voice = voice
    }

    window.speechSynthesis.speak(utterance)
  } else {
    console.warn("Text-to-speech not supported in this browser")
    showToast("Feature Unavailable", "Text-to-speech is not supported in this browser", true)
  }
}

function clearConversation() {
  if (!currentConversationId) return

  const conversation = conversations.find((c) => c.id === currentConversationId)
  if (conversation) {
    conversation.messages = []
    conversation.updatedAt = new Date()
    saveConversations()
  }

  messages = []
  renderMessages()

  // Also clear any uploaded files
  removeUploadedFile()

  if (welcomeCard) welcomeCard.classList.remove("hidden")
  if (clearButton) clearButton.classList.add("hidden")
  showToast("Conversation Cleared", "All messages have been removed")
}

function toggleTheme() {
  const isDark = document.body.classList.contains("dark-theme")
  document.body.classList.toggle("dark-theme")
  updateThemeIcon(!isDark)

  // Update settings
  settings.theme = !isDark ? "dark" : "light"
  if (themeSelect) themeSelect.value = settings.theme
  saveSettings()
}

function updateThemeIcon(isDark) {
  if (!themeToggle) return

  themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>'
}

function openSettings() {
  if (settingsModal) settingsModal.classList.add("active")
}

function closeSettingsModal() {
  if (settingsModal) settingsModal.classList.remove("active")
}

function updateThemeSetting(e) {
  settings.theme = e.target.value
  saveSettings()

  if (settings.theme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    document.body.classList.toggle("dark-theme", prefersDark)
    updateThemeIcon(prefersDark)
  } else {
    document.body.classList.toggle("dark-theme", settings.theme === "dark")
    updateThemeIcon(settings.theme === "dark")
  }
}

function updateLanguageSetting(e) {
  settings.language = e.target.value
  saveSettings()

  // Update UI language
  updateUILanguage(settings.language)
}

function updateModelSetting(e) {
  settings.selectedModel = e.target.value
  saveSettings()
}

function updateTTSSetting(e) {
  settings.textToSpeech = e.target.checked
  saveSettings()
  updateTTSIcon()
}

function switchTab(tab) {
  // Update tab buttons
  tabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tab)
  })

  // Update tab panes
  tabPanes.forEach((pane) => {
    pane.classList.toggle("active", pane.id === `${tab}-tab`)
  })
}

function toggleSidebar() {
  if (!sidebar) return

  sidebar.classList.toggle("collapsed")
  document.body.classList.toggle("sidebar-collapsed")

  // Update toggle icon direction
  const isCollapsed = sidebar.classList.contains("collapsed")
  if (sidebarToggle) {
    sidebarToggle.innerHTML = isCollapsed
      ? '<i class="fas fa-chevron-right"></i>'
      : '<i class="fas fa-chevron-left"></i>'
  }
}

function openShareModal(conversationId) {
  const conversation = conversations.find((c) => c.id === conversationId)
  if (!conversation || !shareModal) return

  // Store the conversation ID for sharing
  shareModal.dataset.conversationId = conversationId

  // Show the modal
  shareModal.classList.add("active")
}

function closeShareModal() {
  if (shareModal) shareModal.classList.remove("active")
}

function copyConversationLink() {
  if (!shareModal) return

  const conversationId = shareModal.dataset.conversationId
  const conversation = conversations.find((c) => c.id === conversationId)
  if (!conversation) return

  try {
    // In a real app, this would generate a shareable link
    // For this demo, we'll just create a JSON representation
    const shareableData = JSON.stringify(conversation)

    // Create a temporary textarea to copy the data
    const textarea = document.createElement("textarea")
    textarea.value = `${window.location.origin}?conversation=${btoa(shareableData)}`
    document.body.appendChild(textarea)
    textarea.select()

    const success = document.execCommand("copy")
    if (!success) throw new Error("Copy command failed")

    document.body.removeChild(textarea)

    showToast("Link Copied", "Conversation link has been copied to clipboard")
    closeShareModal()
  } catch (error) {
    console.error("Error copying link:", error)
    showToast("Copy Failed", "Failed to copy link to clipboard. Please try again.", true)
  }
}

function exportConversationAsText() {
  if (!shareModal) return

  const conversationId = shareModal.dataset.conversationId
  const conversation = conversations.find((c) => c.id === conversationId)
  if (!conversation) return

  try {
    let textContent = `# ${conversation.title}\n`
    textContent += `Date: ${new Date(conversation.createdAt).toLocaleString()}\n\n`

    conversation.messages.forEach((msg) => {
      const role = msg.role === "user" ? "You" : msg.role === "assistant" ? "AI Tutor" : "System"
      textContent += `${role}: ${msg.content}\n\n`
    })

    // Create a download link
    const blob = new Blob([textContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${conversation.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    showToast("Export Complete", "Conversation has been exported as text")
    closeShareModal()
  } catch (error) {
    console.error("Error exporting as text:", error)
    showToast("Export Failed", "Failed to export conversation", true)
  }
}

function exportConversationAsJson() {
  if (!shareModal) return

  const conversationId = shareModal.dataset.conversationId
  const conversation = conversations.find((c) => c.id === conversationId)
  if (!conversation) return

  try {
    // Create a download link
    const blob = new Blob([JSON.stringify(conversation, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${conversation.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    showToast("Export Complete", "Conversation has been exported as JSON")
    closeShareModal()
  } catch (error) {
    console.error("Error exporting as JSON:", error)
    showToast("Export Failed", "Failed to export conversation as JSON", true)
  }
}

function openDeleteModal(conversationId) {
  const conversation = conversations.find((c) => c.id === conversationId)
  if (!conversation || !deleteModal) return

  // Store the conversation ID for deletion
  conversationToDelete = conversationId

  // Show the modal
  deleteModal.classList.add("active")
}

function closeDeleteModal() {
  if (deleteModal) deleteModal.classList.remove("active")
  conversationToDelete = null
}

function deleteSelectedConversation() {
  if (!conversationToDelete) return

  try {
    // Find the conversation index
    const index = conversations.findIndex((c) => c.id === conversationToDelete)
    if (index === -1) return

    // Remove the conversation
    conversations.splice(index, 1)
    saveConversations()

    // If we deleted the current conversation, load another one
    if (conversationToDelete === currentConversationId) {
      if (conversations.length > 0) {
        loadConversation(conversations[0].id)
      } else {
        createNewConversation()
      }
    }

    // Update UI
    renderConversationsList()

    showToast("Conversation Deleted", "The conversation has been permanently removed")
  } catch (error) {
    console.error("Error deleting conversation:", error)
    showToast("Delete Failed", "Failed to delete conversation", true)
  } finally {
    closeDeleteModal()
  }
}

function showToast(title, message, isError = false) {
  // Create toast container if it doesn't exist
  let toastContainer = document.getElementById("toast-container")
  if (!toastContainer) {
    toastContainer = document.createElement("div")
    toastContainer.id = "toast-container"
    document.body.appendChild(toastContainer)
  }

  const toast = document.createElement("div")
  toast.classList.add("toast")
  if (isError) toast.classList.add("error")

  const toastContent = document.createElement("div")
  toastContent.classList.add("toast-content")

  const toastTitle = document.createElement("div")
  toastTitle.classList.add("toast-title")
  toastTitle.textContent = title

  const toastMessage = document.createElement("div")
  toastMessage.textContent = message

  const closeButton = document.createElement("button")
  closeButton.classList.add("toast-close")
  closeButton.innerHTML = '<i class="fas fa-times"></i>'
  closeButton.addEventListener("click", () => {
    toast.remove()
  })

  toastContent.appendChild(toastTitle)
  toastContent.appendChild(toastMessage)

  toast.appendChild(toastContent)
  toast.appendChild(closeButton)

  toastContainer.appendChild(toast)

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (toast.parentNode === toastContainer) {
      toast.remove()
    }
  }, 5000)
}

function updateUI() {
  // Update based on settings
  document.body.classList.toggle("dark-theme", settings.theme === "dark")
  updateThemeIcon(settings.theme === "dark")
  updateTTSIcon()

  // Update clear button visibility
  if (clearButton) {
    clearButton.classList.toggle("hidden", !messages.length)
  }

  // Update welcome card visibility
  if (welcomeCard) {
    welcomeCard.classList.toggle("hidden", messages.length > 0)
  }
}

// Handle URL parameters for shared conversations
function handleSharedConversation() {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const sharedData = urlParams.get("conversation")

    if (sharedData) {
      const conversationData = JSON.parse(atob(sharedData))

      // Generate a new ID to avoid conflicts
      conversationData.id = Date.now().toString()

      // Add to conversations
      conversations.unshift(conversationData)
      saveConversations()
      renderConversationsList()
      loadConversation(conversationData.id)

      // Remove the parameter from URL
      window.history.replaceState({}, document.title, window.location.pathname)

      showToast("Conversation Imported", "A shared conversation has been imported")
    }
  } catch (error) {
    console.error("Error importing shared conversation:", error)
    showToast("Import Error", "Failed to import the shared conversation", true)
  }
}

// Multilingual support
function updateUILanguage(lang) {
  const translations = {
    en: {
      welcome: "Welcome to AI Tutor",
      welcomeText: "Ask me anything about your studies, and I'll help you learn!",
      exampleButton1: "Explain photosynthesis",
      exampleButton2: "World War II causes",
      exampleButton3: "Quadratic equations",
      inputPlaceholder: "Ask your question...",
      newChat: "New Chat",
      conversations: "Conversations",
      noConversations: "No conversations yet",
      settings: "Settings",
      theme: "Theme",
      language: "Language",
      model: "AI Model",
      textToSpeech: "Text-to-Speech",
      helpTitle: "How to Use AI Tutor",
      startLearning: "Start Learning",
    },
    es: {
      welcome: "Bienvenido a AI Tutor",
      welcomeText: "¡Pregúntame cualquier cosa sobre tus estudios y te ayudaré a aprender!",
      exampleButton1: "Explica la fotosíntesis",
      exampleButton2: "Causas de la Segunda Guerra Mundial",
      exampleButton3: "Ecuaciones cuadráticas",
      inputPlaceholder: "Haz tu pregunta...",
      newChat: "Nueva Conversación",
      conversations: "Conversaciones",
      noConversations: "No hay conversaciones aún",
      settings: "Configuración",
      theme: "Tema",
      language: "Idioma",
      model: "Modelo de IA",
      textToSpeech: "Texto a Voz",
      helpTitle: "Cómo usar AI Tutor",
      startLearning: "Comenzar a Aprender",
    },
    fr: {
      welcome: "Bienvenue sur AI Tutor",
      welcomeText: "Posez-moi n'importe quelle question sur vos études, et je vous aiderai à apprendre !",
      exampleButton1: "Expliquer la photosynthèse",
      exampleButton2: "Causes de la Seconde Guerre mondiale",
      exampleButton3: "Équations quadratiques",
      inputPlaceholder: "Posez votre question...",
      newChat: "Nouvelle Conversation",
      conversations: "Conversations",
      noConversations: "Pas encore de conversations",
      settings: "Paramètres",
      theme: "Thème",
      language: "Langue",
      model: "Modèle d'IA",
      textToSpeech: "Synthèse Vocale",
      helpTitle: "Comment utiliser AI Tutor",
      startLearning: "Commencer à Apprendre",
    },
    de: {
      welcome: "Willkommen bei AI Tutor",
      welcomeText: "Frag mich alles über dein Studium, und ich helfe dir beim Lernen!",
      exampleButton1: "Erkläre Photosynthese",
      exampleButton2: "Ursachen des Zweiten Weltkriegs",
      exampleButton3: "Quadratische Gleichungen",
      inputPlaceholder: "Stelle deine Frage...",
      newChat: "Neuer Chat",
      conversations: "Gespräche",
      noConversations: "Noch keine Gespräche",
      settings: "Einstellungen",
      theme: "Thema",
      language: "Sprache",
      model: "KI-Modell",
      textToSpeech: "Text-zu-Sprache",
      helpTitle: "Wie man AI Tutor verwendet",
      startLearning: "Beginne zu Lernen",
    },
    zh: {
      welcome: "欢迎使用 AI Tutor",
      welcomeText: "问我任何关于你学习的问题，我会帮助你学习！",
      exampleButton1: "解释光合作用",
      exampleButton2: "第二次世界大战的原因",
      exampleButton3: "二次方程",
      inputPlaceholder: "提出你的问题...",
      newChat: "新对话",
      conversations: "对话",
      noConversations: "还没有对话",
      settings: "设置",
      theme: "主题",
      language: "语言",
      model: "AI 模型",
      textToSpeech: "文字转语音",
      helpTitle: "如何使用 AI Tutor",
      startLearning: "开始学习",
    },
  }

  // Default to English if translation not available
  const t = translations[lang] || translations["en"]

  // Update UI elements with translations
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n")
    if (t[key]) el.textContent = t[key]
  })

  // Update specific elements
  if (document.querySelector(".welcome-card h2")) {
    document.querySelector(".welcome-card h2").textContent = t.welcome
  }

  if (document.querySelector(".welcome-card p")) {
    document.querySelector(".welcome-card p").textContent = t.welcomeText
  }

  if (messageInput) {
    messageInput.placeholder = t.inputPlaceholder
  }

  // Update example buttons
  const exampleButtons = document.querySelectorAll(".example-button")
  if (exampleButtons.length >= 3) {
    exampleButtons[0].textContent = t.exampleButton1
    exampleButtons[1].textContent = t.exampleButton2
    exampleButtons[2].textContent = t.exampleButton3
  }

  // Update sidebar header
  if (document.querySelector(".sidebar-header h2")) {
    document.querySelector(".sidebar-header h2").textContent = t.conversations
  }

  if (document.querySelector(".empty-conversations p")) {
    document.querySelector(".empty-conversations p").textContent = t.noConversations
  }

  if (newChatButton) {
    newChatButton.innerHTML = `<i class="fas fa-plus"></i> <span>${t.newChat}</span>`
  }
}

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  // Add data-i18n attributes to elements for translation
  const elementsToTranslate = [
    { selector: ".welcome-card h2", key: "welcome" },
    { selector: ".welcome-card p", key: "welcomeText" },
    { selector: ".sidebar-header h2", key: "conversations" },
    { selector: ".empty-conversations p", key: "noConversations" },
    { selector: ".modal-header h2", key: "settings" },
  ]

  elementsToTranslate.forEach((item) => {
    const el = document.querySelector(item.selector)
    if (el) el.setAttribute("data-i18n", item.key)
  })

  // Initialize language
  if (settings.language) {
    updateUILanguage(settings.language)
  }

  // Initialize speech synthesis voices
  if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices()
    }
  }
})
