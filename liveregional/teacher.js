// Teacher dashboard functionality

// Mock data for teachers and requests
const currentTeacher = {
    id: "teacher-123",
    name: "Prof. Anderson",
    email: "anderson@example.com",
    subjects: ["Mathematics", "Physics"],
  }
  
  let nearbyRequests = []
  let acceptedRequests = []
  
  // DOM elements
  const availabilityToggle = document.getElementById("availability-toggle")
  const availabilityStatus = document.getElementById("availability-status")
  const nearbyRequestsContainer = document.getElementById("nearby-requests")
  const nearbyEmptyState = document.getElementById("nearby-empty-state")
  const acceptedRequestsContainer = document.getElementById("accepted-requests")
  const notificationBell = document.getElementById("notification-bell")
  const notificationBadge = document.getElementById("notification-badge")
  const callModal = document.getElementById("call-modal")
  const chatModal = document.getElementById("chat-modal")
  const callStudentName = document.getElementById("call-student-name")
  const chatStudentName = document.getElementById("chat-student-name")
  const chatMessages = document.getElementById("chat-messages")
  const messageInput = document.getElementById("message-input")
  const sendMessageBtn = document.getElementById("send-message")
  const closeModalBtns = document.querySelectorAll(".close-modal")
  const toggleAudioBtn = document.getElementById("toggle-audio")
  const toggleVideoBtn = document.getElementById("toggle-video")
  const endCallBtn = document.getElementById("end-call")
  
  // Current state
  let isAvailable = false
  let userLocation = null
  let hasNewRequests = false
  let pollingInterval = null
  let currentStudent = null
  let currentRequestId = null
  let isAudioEnabled = true
  let isVideoEnabled = true
  const localStream = null // Declare localStream
  
  // Mock functions (replace with actual implementations)
  function getUserLocation() {
    return new Promise((resolve, reject) => {
      // Simulate getting user location
      setTimeout(() => {
        resolve({ lat: 34.0522, lng: -118.2437 }) // Example location: Los Angeles
      }, 500)
    })
  }
  
  function showToast(message, type) {
    console.log(`Toast: ${message} (Type: ${type})`)
    // Implement your toast notification logic here
  }
  
  function endCall() {
    console.log("Call ended")
    // Implement your end call logic here (e.g., hang up, disconnect)
  }
  
  function playNotificationSound() {
    console.log("Playing notification sound")
    // Implement your notification sound logic here
  }
  
  function initializeCall(userType) {
    console.log(`Initializing call as ${userType}`)
    // Implement your WebRTC initialization logic here
  }
  
  // Initialize
  document.addEventListener("DOMContentLoaded", () => {
    // Get user location
    getUserLocation()
      .then((location) => {
        userLocation = location
      })
      .catch((error) => {
        console.error("Error getting location:", error)
        showToast("Please enable location services to use this app.", "error")
      })
  
    // Set up event listeners
    availabilityToggle.addEventListener("change", handleAvailabilityToggle)
    notificationBell.addEventListener("click", () => {
      notificationBadge.classList.add("hidden")
      hasNewRequests = false
    })
  
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
  
    // Load initial data
    loadAcceptedRequests()
  })
  
  // Handle availability toggle
  function handleAvailabilityToggle(e) {
    isAvailable = e.target.checked
  
    // Update UI
    availabilityStatus.textContent = isAvailable ? "Available" : "Offline"
    availabilityStatus.className = `availability-status ${isAvailable ? "online" : "offline"}`
  
    // Show toast
    showToast(
      isAvailable
        ? "You're now available. You'll receive notifications for nearby student doubts."
        : "You're now offline. You won't receive any new requests.",
      "info",
    )
  
    // Update empty state message
    nearbyEmptyState.innerHTML = isAvailable
      ? "<p>No nearby requests at the moment.</p><p>New requests will appear here.</p>"
      : "<p>You're currently offline.</p><p>Toggle availability to see nearby requests.</p>"
  
    if (isAvailable) {
      // Start polling for nearby requests
      fetchNearbyRequests()
      pollingInterval = setInterval(fetchNearbyRequests, 10000) // Poll every 10 seconds
    } else {
      // Stop polling
      clearInterval(pollingInterval)
      // Clear nearby requests
      nearbyRequests = []
      renderNearbyRequests()
    }
  }
  
  // Fetch nearby requests
  function fetchNearbyRequests() {
    if (!isAvailable || !userLocation) return
  
    // Simulate API call
    setTimeout(() => {
      // Generate random requests
      const mockRequests = generateMockRequests()
  
      // Check if there are new requests
      if (mockRequests.length > nearbyRequests.length) {
        hasNewRequests = true
        notificationBadge.classList.remove("hidden")
        playNotificationSound()
      }
  
      nearbyRequests = mockRequests
      renderNearbyRequests()
    }, 1000)
  }
  
  // Generate mock requests
  function generateMockRequests() {
    // For demo purposes, generate 0-3 random requests
    const count = Math.floor(Math.random() * 4)
    const requests = []
  
    for (let i = 0; i < count; i++) {
      const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science"]
      const randomSubject = subjects[Math.floor(Math.random() * subjects.length)]
  
      const descriptions = [
        "I need help understanding derivatives in calculus.",
        "Can someone explain quantum mechanics concepts?",
        "Having trouble with organic chemistry reactions.",
        "Need help with data structures and algorithms.",
        "Struggling with cell biology concepts.",
      ]
      const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)]
  
      const students = [
        { id: "student-1", name: "John Doe", email: "john@example.com" },
        { id: "student-2", name: "Jane Smith", email: "jane@example.com" },
        { id: "student-3", name: "Alex Johnson", email: "alex@example.com" },
      ]
      const randomStudent = students[Math.floor(Math.random() * students.length)]
  
      requests.push({
        id: `request-${Date.now()}-${i}`,
        subject: randomSubject,
        description: randomDescription,
        studentId: randomStudent.id,
        student: randomStudent,
        status: "pending",
        createdAt: new Date().toISOString(),
        location: {
          lat: userLocation.lat + (Math.random() * 0.02 - 0.01),
          lng: userLocation.lng + (Math.random() * 0.02 - 0.01),
        },
        distance: (Math.random() * 5).toFixed(1), // Random distance between 0-5km
      })
    }
  
    return requests
  }
  
  // Render nearby requests
  function renderNearbyRequests() {
    // Clear current requests
    nearbyRequestsContainer.innerHTML = ""
  
    // Check if there are any requests
    if (nearbyRequests.length === 0) {
      nearbyRequestsContainer.appendChild(nearbyEmptyState)
      return
    }
  
    // Add each request to the list
    nearbyRequests.forEach((request) => {
      const requestElement = createNearbyRequestElement(request)
      nearbyRequestsContainer.appendChild(requestElement)
    })
  }
  
  // Create nearby request element
  function createNearbyRequestElement(request) {
    const requestElement = document.createElement("div")
    requestElement.className = "request-item"
    requestElement.dataset.id = request.id
  
    requestElement.innerHTML = `
          <div class="request-header">
              <h3 class="request-title">${request.subject}</h3>
          </div>
          <p class="request-description">${request.description}</p>
          <div class="request-meta">
              <i class="fas fa-map-marker-alt"></i>
              <span>${request.distance} km away</span>
          </div>
          <div class="request-meta">
              <i class="fas fa-user"></i>
              <span>${request.student.name}</span>
          </div>
          <div class="request-actions">
              <button class="btn btn-outline accept-btn" data-id="${request.id}">
                  <i class="fas fa-check"></i> Accept
              </button>
              <button class="btn btn-outline decline-btn" data-id="${request.id}">
                  <i class="fas fa-times"></i> Decline
              </button>
          </div>
      `
  
    // Add event listeners to buttons
    setTimeout(() => {
      const acceptBtn = requestElement.querySelector(".accept-btn")
      const declineBtn = requestElement.querySelector(".decline-btn")
  
      acceptBtn.addEventListener("click", () => acceptRequest(request))
      declineBtn.addEventListener("click", () => declineRequest(request))
    }, 0)
  
    return requestElement
  }
  
  // Accept request
  function acceptRequest(request) {
    // Update request status
    request.status = "accepted"
    request.teacher = currentTeacher
  
    // Remove from nearby requests
    nearbyRequests = nearbyRequests.filter((r) => r.id !== request.id)
  
    // Add to accepted requests
    acceptedRequests.push(request)
  
    // Update UI
    renderNearbyRequests()
    loadAcceptedRequests()
  
    // Show toast
    showToast("You've accepted the student's request.", "success")
  }
  
  // Decline request
  function declineRequest(request) {
    // Remove from nearby requests
    nearbyRequests = nearbyRequests.filter((r) => r.id !== request.id)
  
    // Update UI
    renderNearbyRequests()
  
    // Show toast
    showToast("You've declined the student's request.", "info")
  }
  
  // Load accepted requests
  function loadAcceptedRequests() {
    // Clear current requests
    acceptedRequestsContainer.innerHTML = ""
  
    // Check if there are any requests
    if (acceptedRequests.length === 0) {
      acceptedRequestsContainer.innerHTML = `
              <div class="empty-state">
                  <p>No accepted requests yet.</p>
                  <p>Accepted requests will appear here.</p>
              </div>
          `
      return
    }
  
    // Add each request to the list
    acceptedRequests.forEach((request) => {
      const requestElement = createAcceptedRequestElement(request)
      acceptedRequestsContainer.appendChild(requestElement)
    })
  }
  
  // Create accepted request element
  function createAcceptedRequestElement(request) {
    const requestElement = document.createElement("div")
    requestElement.className = "request-item"
    requestElement.dataset.id = request.id
  
    requestElement.innerHTML = `
          <div class="request-header">
              <h3 class="request-title">${request.subject}</h3>
              <span class="request-badge accepted">Accepted</span>
          </div>
          <p class="request-description">${request.description}</p>
          <div class="request-meta">
              <i class="fas fa-user"></i>
              <span>${request.student.name}</span>
          </div>
          <div class="request-actions">
              <button class="btn btn-outline chat-btn" data-id="${request.id}">
                  <i class="fas fa-comment"></i> Chat
              </button>
              <button class="btn btn-outline call-btn" data-id="${request.id}">
                  <i class="fas fa-phone"></i> Call
              </button>
          </div>
          <button class="btn btn-outline btn-block complete-btn" data-id="${request.id}">
              <i class="fas fa-check"></i> Mark as Completed
          </button>
      `
  
    // Add event listeners to buttons
    setTimeout(() => {
      const chatBtn = requestElement.querySelector(".chat-btn")
      const callBtn = requestElement.querySelector(".call-btn")
      const completeBtn = requestElement.querySelector(".complete-btn")
  
      chatBtn.addEventListener("click", () => openChat(request))
      callBtn.addEventListener("click", () => startCall(request))
      completeBtn.addEventListener("click", () => completeRequest(request))
    }, 0)
  
    return requestElement
  }
  
  // Complete request
  function completeRequest(request) {
    // Remove from accepted requests
    acceptedRequests = acceptedRequests.filter((r) => r.id !== request.id)
  
    // Update UI
    loadAcceptedRequests()
  
    // Show toast
    showToast("You've marked this request as completed.", "success")
  }
  
  // Open chat with student
  function openChat(request) {
    currentStudent = request.student
    currentRequestId = request.id
  
    // Set student name
    chatStudentName.textContent = currentStudent.name
  
    // Clear previous messages
    chatMessages.innerHTML = ""
  
    // Add welcome message
    addChatMessage(`Hello ${currentStudent.name}, I'm here to help with your ${request.subject} doubt.`, "sent")
  
    // Show chat modal
    chatModal.style.display = "block"
  }
  
  // Start call with student
  function startCall(request) {
    currentStudent = request.student
    currentRequestId = request.id
  
    // Set student name
    callStudentName.textContent = currentStudent.name
  
    // Show call modal
    callModal.style.display = "block"
  
    // Initialize WebRTC
    initializeCall("teacher")
  }
  
  // Send chat message
  function sendMessage() {
    const message = messageInput.value.trim()
    if (!message) return
  
    // Add message to chat
    addChatMessage(message, "sent")
  
    // Clear input
    messageInput.value = ""
  
    // Simulate student response
    setTimeout(() => {
      const responses = [
        "Thank you for explaining that!",
        "I'm still a bit confused about one part...",
        "That makes sense now, thanks!",
        "Could you explain that in a different way?",
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
  