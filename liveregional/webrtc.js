// WebRTC functionality for audio and video calls

// Global variables for WebRTC
let localStream = null
let peerConnection = null
let remoteStream = null
let callRole = null // 'student' or 'teacher'

// DOM elements
const localVideo = document.getElementById("local-video")
const remoteVideo = document.getElementById("remote-video")
const callStatusMessage = document.getElementById("call-status-message")

// Configuration for WebRTC
const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
}

// Initialize call
async function initializeCall(role) {
  callRole = role

  try {
    // Get local media stream
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })

    // Display local video
    localVideo.srcObject = localStream

    // Create peer connection
    createPeerConnection()

    // Add local stream to peer connection
    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream)
    })

    // Create and send offer if student, wait for offer if teacher
    if (role === "student") {
      createAndSendOffer()
    } else {
      // In a real app, this would wait for signaling from the server
      // For demo, we'll simulate receiving an offer
      simulateReceiveOffer()
    }

    updateCallStatus("Connecting...")
  } catch (error) {
    console.error("Error initializing call:", error)
    updateCallStatus("Failed to access camera and microphone")
  }
}

// Create peer connection
function createPeerConnection() {
  peerConnection = new RTCPeerConnection(configuration)

  // Set up event handlers
  peerConnection.onicecandidate = handleICECandidate
  peerConnection.ontrack = handleTrackEvent
  peerConnection.oniceconnectionstatechange = handleICEConnectionStateChange
}

// Handle ICE candidate event
function handleICECandidate(event) {
  if (event.candidate) {
    // In a real app, send this candidate to the peer via signaling server
    console.log("ICE candidate:", event.candidate)
  }
}

// Handle track event
function handleTrackEvent(event) {
  if (event.streams && event.streams[0]) {
    remoteStream = event.streams[0]
    remoteVideo.srcObject = remoteStream
    updateCallStatus("Connected")
  }
}

// Handle ICE connection state change
function handleICEConnectionStateChange() {
  console.log("ICE connection state:", peerConnection.iceConnectionState)

  switch (peerConnection.iceConnectionState) {
    case "connected":
    case "completed":
      updateCallStatus("Connected")
      break
    case "disconnected":
    case "failed":
      updateCallStatus("Connection lost")
      break
    case "closed":
      updateCallStatus("Call ended")
      break
  }
}

// Create and send offer
async function createAndSendOffer() {
  try {
    const offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)

    // In a real app, send this offer to the peer via signaling server
    console.log("Offer created:", offer)

    // For demo purposes, simulate receiving an answer
    simulateReceiveAnswer()
  } catch (error) {
    console.error("Error creating offer:", error)
    updateCallStatus("Failed to create offer")
  }
}

// Simulate receiving an offer (for teacher)
function simulateReceiveOffer() {
  // In a real app, this would come from the signaling server
  setTimeout(async () => {
    try {
      // Create a simulated offer
      const simulatedOffer = {
        type: "offer",
        sdp: "v=0\r\no=- 123456789 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0 1\r\na=msid-semantic: WMS\r\nm=audio 9 UDP/TLS/RTP/SAVPF 111\r\nc=IN IP4 0.0.0.0\r\na=rtcp:9 IN IP4 0.0.0.0\r\na=ice-ufrag:someufrag\r\na=ice-pwd:someicepwd\r\na=fingerprint:sha-256 00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00\r\na=setup:actpass\r\na=mid:0\r\na=sendrecv\r\na=rtcp-mux\r\na=rtpmap:111 opus/48000/2\r\na=fmtp:111 minptime=10;useinbandfec=1\r\nm=video 9 UDP/TLS/RTP/SAVPF 96\r\nc=IN IP4 0.0.0.0\r\na=rtcp:9 IN IP4 0.0.0.0\r\na=ice-ufrag:someufrag\r\na=ice-pwd:someicepwd\r\na=fingerprint:sha-256 00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00\r\na=setup:actpass\r\na=mid:1\r\na=sendrecv\r\na=rtcp-mux\r\na=rtpmap:96 VP8/90000\r\na=rtcp-fb:96 nack\r\na=rtcp-fb:96 nack pli\r\na=rtcp-fb:96 goog-remb\r\n",
      }

      await peerConnection.setRemoteDescription(simulatedOffer)

      // Create answer
      const answer = await peerConnection.createAnswer()
      await peerConnection.setLocalDescription(answer)

      // In a real app, send this answer to the peer via signaling server
      console.log("Answer created:", answer)

      updateCallStatus("Connecting...")

      // Simulate connection established
      setTimeout(() => {
        updateCallStatus("Connected")
      }, 2000)
    } catch (error) {
      console.error("Error handling offer:", error)
      updateCallStatus("Failed to process offer")
    }
  }, 1500)
}

// Simulate receiving an answer (for student)
function simulateReceiveAnswer() {
  // In a real app, this would come from the signaling server
  setTimeout(async () => {
    try {
      // Create a simulated answer
      const simulatedAnswer = {
        type: "answer",
        sdp: "v=0\r\no=- 123456789 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0 1\r\na=msid-semantic: WMS\r\nm=audio 9 UDP/TLS/RTP/SAVPF 111\r\nc=IN IP4 0.0.0.0\r\na=rtcp:9 IN IP4 0.0.0.0\r\na=ice-ufrag:someufrag\r\na=ice-pwd:someicepwd\r\na=fingerprint:sha-256 00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00\r\na=setup:active\r\na=mid:0\r\na=sendrecv\r\na=rtcp-mux\r\na=rtpmap:111 opus/48000/2\r\na=fmtp:111 minptime=10;useinbandfec=1\r\nm=video 9 UDP/TLS/RTP/SAVPF 96\r\nc=IN IP4 0.0.0.0\r\na=rtcp:9 IN IP4 0.0.0.0\r\na=ice-ufrag:someufrag\r\na=ice-pwd:someicepwd\r\na=fingerprint:sha-256 00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00\r\na=setup:active\r\na=mid:1\r\na=sendrecv\r\na=rtcp-mux\r\na=rtpmap:96 VP8/90000\r\na=rtcp-fb:96 nack\r\na=rtcp-fb:96 nack pli\r\na=rtcp-fb:96 goog-remb\r\n",
      }

      await peerConnection.setRemoteDescription(simulatedAnswer)

      updateCallStatus("Connecting...")

      // Simulate connection established
      setTimeout(() => {
        updateCallStatus("Connected")
      }, 2000)
    } catch (error) {
      console.error("Error handling answer:", error)
      updateCallStatus("Failed to process answer")
    }
  }, 1500)
}

// Update call status
function updateCallStatus(message) {
  if (callStatusMessage) {
    callStatusMessage.textContent = message
  }
}

// End call
function endCall() {
  // Close peer connection
  if (peerConnection) {
    peerConnection.close()
    peerConnection = null
  }

  // Stop local stream
  if (localStream) {
    localStream.getTracks().forEach((track) => track.stop())
    localStream = null
  }

  // Clear video elements
  if (localVideo) localVideo.srcObject = null
  if (remoteVideo) remoteVideo.srcObject = null

  // Update status
  updateCallStatus("Call ended")
}

// Simulate ICE candidates
function simulateICECandidates() {
  // In a real app, these would come from the STUN/TURN server
  const simulatedCandidates = [
    { candidate: "candidate:1 1 UDP 2122252543 192.168.1.100 12345 typ host", sdpMid: "0", sdpMLineIndex: 0 },
    {
      candidate: "candidate:2 1 UDP 2122252542 10.0.0.1 12346 typ srflx raddr 192.168.1.100 rport 12345",
      sdpMid: "0",
      sdpMLineIndex: 0,
    },
  ]

  // Add candidates after a delay
  setTimeout(() => {
    simulatedCandidates.forEach((candidate) => {
      try {
        peerConnection.addIceCandidate(candidate)
      } catch (error) {
        console.error("Error adding ICE candidate:", error)
      }
    })
  }, 1000)
}
