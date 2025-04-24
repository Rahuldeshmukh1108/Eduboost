// Student dashboard functionality

// Mock data for students and requests
const currentStudent = {
    id: "student-123",
    name: "John Doe",
    email: "john@example.com",
  }
  
  const studentRequests = [
    {
      id: "request-1",
      subject: "Mathematics",
      description: "I need help with calculus integration problems",
      studentId: "student-123",
      student: currentStudent,
      status: "pending",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      location: { lat: 40.7128, lng: -74.006 },
    },
  ]
  
  // DOM elements
  const doubtForm = document.getElementById("doubt-form")
  const subjectInput = document.getElementById("subject")
  const descriptionInput = document.getElementById("description")
  const locationStatus = document.getElementById("location-status")
  const submitBtn = document.getElementById("submit-btn")
  const requestsList = document.getElementById("requests-list")
  const callModal = document.getElementById("call-modal")
  const chatModal = document.getElementById("chat-modal")
  const callTeacherName = document.getElementById("call-teacher-name")
  const chatTeacherName = document.getElementById("chat-teacher-name")
  const chatMessages = document.getElementById("chat-messages")
  const messageInput = document.getElementById("message-input")
  const sendMessageBtn = document.getElementById("send-message")
  const closeModalBtns = document.querySelectorAll(".close-modal")
  const toggleAudioBtn = document.getElementById("toggle-audio")
  const toggleVideoBtn = document.getElementById("toggle-video")
  const endCallBtn = document.getElementById("end-call")
  
  // Current state
  let userLocation = null
  let currentTeacher = null
  let currentRequestId = null
  let isAudioEnabled = true
  let isVideoEnabled = true
  const localStream = null // Declare localStream
  
  // Mock functions (replace with actual implementations)
  function getUserLocation() {
    return new Promise((resolve, reject) => {
      // Simulate getting user location
      setTimeout(() => {
        resolve({ lat: 40.7128, lng: -74.006 })
      }, 500)
    })
  }
  
  function endCall() {
    console.log("Call ended")
  }
  
  function showToast(message, type = "info") {
    console.log(`Toast: ${message} (${type})`)
  }
  
  function playNotificationSound() {
    console.log("Playing notification sound")
  }
  
  function initializeCall(userType) {
    console.log(`Initializing call as ${userType}`)
  }
  
  // Initialize
  document.addEventListener("DOMContentLoaded", () => {
    // Get user location
    getUserLocation()
      .then((location) => {
        userLocation = location
        locationStatus.textContent = "Your location is detected"
      })
      .catch((error) => {
        console.error("Error getting location:", error)
        locationStatus.textContent = "Error getting location. Please enable location services."
      })
  
    // Load student requests
    loadStudentRequests()
  
    // Set up event listeners
    doubtForm.addEventListener("submit", handleSubmitDoubt)
    closeModalBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        callModal.style.display = "none"
        chatModal.style.display = "none"
        // End call if active
        if (callModal.style.display === "none") {
          endCall()
        }
      })
    })
  
    sendMessageBtn.addEventListener("click", sendMessage)
    messageInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        sendMessage()
      }
    })
  
    toggleAudioBtn.addEventListener("click", toggleAudio)
    toggleVideoBtn.addEventListener("click", toggleVideo)
    endCallBtn.addEventListener("click", () => {
      endCall()
      callModal.style.display = "none"
    })
  })
  
  // Load student requests
  function loadStudentRequests() {
    // Clear current requests
    requestsList.innerHTML = ""
  
    // Check if there are any requests
    if (studentRequests.length === 0) {
      requestsList.innerHTML = `
              <div class="empty-state">
                  <p>No requests yet</p>
              </div>
          `
      return
    }
  
    // Add each request to the list
    studentRequests.forEach((request) => {
      const requestElement = createRequestElement(request)
      requestsList.appendChild(requestElement)
    })
  }
  
  // Create request element
  function createRequestElement(request) {
    const requestElement = document.createElement("div")
    requestElement.className = "request-item"
    requestElement.dataset.id = request.id
  
    let statusBadge = ""
    switch (request.status) {
      case "pending":
        statusBadge = '<span class="request-badge pending">Pending</span>'
        break
      case "accepted":
        statusBadge = '<span class="request-badge accepted">Accepted</span>'
        break
      case "completed":
        statusBadge = '<span class="request-badge completed">Completed</span>'
        break
      default:
        statusBadge = '<span class="request-badge">Unknown</span>'
    }
  
    let teacherInfo = ""
    let actionButtons = ""
    if (request.status === "accepted" && request.teacher) {
      teacherInfo = `
              <div class="request-meta">
                  <i class="fas fa-user"></i>
                  <span>${request.teacher.name}</span>
              </div>
          `
      actionButtons = `
              <div class="request-actions">
                  <button class="btn btn-outline chat-btn" data-id="${request.id}">
                      <i class="fas fa-comment"></i> Chat
                  </button>
                  <button class="btn btn-outline call-btn" data-id="${request.id}">
                      <i class="fas fa-phone"></i> Call
                  </button>
              </div>
          `
    }
  
    requestElement.innerHTML = `
          <div class="request-header">
              <h3 class="request-title">${request.subject}</h3>
              ${statusBadge}
          </div>
          <p class="request-description">${request.description}</p>
          ${teacherInfo}
          ${actionButtons}
      `
  
    // Add event listeners to buttons
    setTimeout(() => {
      const chatBtn = requestElement.querySelector(".chat-btn")
      const callBtn = requestElement.querySelector(".call-btn")
  
      if (chatBtn) {
        chatBtn.addEventListener("click", () => openChat(request))
      }
  
      if (callBtn) {
        callBtn.addEventListener("click", () => startCall(request))
      }
    }, 0)
  
    return requestElement
  }
  
  // Handle submit doubt
  function handleSubmitDoubt(e) {
    e.preventDefault()
  
    const subject = subjectInput.value.trim()
    const description = descriptionInput.value.trim()
  
    if (!subject || !description) {
      showToast("Please fill in all fields", "error")
      return
    }
  
    if (!userLocation) {
      showToast("Location is required to find nearby teachers", "error")
      return
    }
  
    // Disable submit button
    submitBtn.disabled = true
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...'
  
    // Create new request
    const newRequest = {
      id: `request-${Date.now()}`,
      subject,
      description,
      studentId: currentStudent.id,
      student: currentStudent,
      status: "pending",
      createdAt: new Date().toISOString(),
      location: userLocation,
    }
  
    // Simulate API call
    setTimeout(() => {
      // Add to requests
      studentRequests.push(newRequest)
  
      // Reset form
      doubtForm.reset()
  
      // Re-enable submit button
      submitBtn.disabled = false
      submitBtn.innerHTML = "Submit Doubt"
  
      // Show success message
      showToast("Your doubt has been submitted. Nearby teachers will be notified.", "success")
  
      // Reload requests
      loadStudentRequests()
  
      // Simulate teacher accepting request after some time
      simulateTeacherAcceptance(newRequest)
    }, 1500)
  }
  
  // Simulate teacher accepting request
  function simulateTeacherAcceptance(request) {
    setTimeout(() => {
      // Find request
      const requestIndex = studentRequests.findIndex((r) => r.id === request.id)
      if (requestIndex === -1) return
  
      // Update request
      studentRequests[requestIndex].status = "accepted"
      studentRequests[requestIndex].teacher = {
        id: "teacher-123",
        name: "Prof. Anderson",
        email: "anderson@example.com",
      }
  
      // Play notification sound
      playNotificationSound()
  
      // Show notification
      showToast("A teacher has accepted your request!", "success")
  
      // Reload requests
      loadStudentRequests()
    }, 10000) // 10 seconds
  }
  
  // Open chat with teacher
  function openChat(request) {
    currentTeacher = request.teacher
    currentRequestId = request.id
  
    // Set teacher name
    chatTeacherName.textContent = currentTeacher.name
  
    // Clear previous messages
    chatMessages.innerHTML = ""
  
    // Add welcome message
    addChatMessage(
      `Hi ${currentStudent.name}, I'm ${currentTeacher.name}. How can I help you with your ${request.subject} doubt?`,
      "received",
    )
  
    // Show chat modal
    chatModal.style.display = "block"
  }
  
  // Start call with teacher
  function startCall(request) {
    currentTeacher = request.teacher
    currentRequestId = request.id
  
    // Set teacher name
    callTeacherName.textContent = currentTeacher.name
  
    // Show call modal
    callModal.style.display = "block"
  
    // Initialize WebRTC
    initializeCall("student")
  }
  
  // Send chat message
  function sendMessage() {
    const message = messageInput.value.trim()
    if (!message) return
  
    // Add message to chat
    addChatMessage(message, "sent")
  
    // Clear input
    messageInput.value = ""
  
    // Simulate teacher response
    setTimeout(() => {
      const responses = [
        "I understand your question. Let me explain...",
        "That's a good point. Have you considered...",
        "Let me help you solve this step by step.",
        "I think I see where you're getting confused. Let's clarify...",
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      addChatMessage(randomResponse, "received")
    }, 2000)
  }
  
  // Add message to chat
  function addChatMessage(message, type) {
    const messageElement = document.createElement("div")
    messageElement.className = `chat-message ${type}`
    messageElement.textContent = message
    chatMessages.appendChild(messageElement)
  
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight
  }
  
  // Toggle audio
  function toggleAudio() {
    isAudioEnabled = !isAudioEnabled
  
    // Update button icon
    toggleAudioBtn.innerHTML = isAudioEnabled
      ? '<i class="fas fa-microphone"></i>'
      : '<i class="fas fa-microphone-slash"></i>'
  
    // Update local stream
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = isAudioEnabled
      })
    }
  }
  
  // Toggle video
  function toggleVideo() {
    isVideoEnabled = !isVideoEnabled
  
    // Update button icon
    toggleVideoBtn.innerHTML = isVideoEnabled ? '<i class="fas fa-video"></i>' : '<i class="fas fa-video-slash"></i>'
  
    // Update local stream
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = isVideoEnabled
      })
    }
  }
  