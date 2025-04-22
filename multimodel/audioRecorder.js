// Improved Audio Recorder Module
class AudioRecorder {
    constructor() {
      // DOM Elements
      this.voiceInputButton = document.getElementById("voice-input-button");
      this.audioRecordingContainer = document.getElementById("audio-recording-container");
      this.closeAudioRecording = document.getElementById("close-audio-recording");
      this.startRecordingButton = document.getElementById("start-recording");
      this.stopRecordingButton = document.getElementById("stop-recording");
      this.sendAudioButton = document.getElementById("send-audio");
      this.audioTimer = document.querySelector(".audio-timer");
      this.audioVisualizer = document.getElementById("audio-visualizer");
      this.audioPlaybackContainer = document.getElementById("audio-playback-container");
      this.audioPlayback = document.getElementById("audio-playback");
  
      // Recording state
      this.mediaRecorder = null;
      this.audioChunks = [];
      this.audioBlob = null;
      this.audioUrl = null;
      this.recordingStartTime = null;
      this.timerInterval = null;
      this.visualizerContext = null;
      this.stream = null;
  
      this.init();
      console.log("AudioRecorder initialized");
    }
  
    init() {
      // Set up event listeners
      if (this.voiceInputButton) {
        this.voiceInputButton.addEventListener("click", () => this.showAudioRecorder());
      }
      
      if (this.closeAudioRecording) {
        this.closeAudioRecording.addEventListener("click", () => this.hideAudioRecorder());
      }
      
      if (this.startRecordingButton) {
        this.startRecordingButton.addEventListener("click", () => this.startRecording());
      }
      
      if (this.stopRecordingButton) {
        this.stopRecordingButton.addEventListener("click", () => this.stopRecording());
      }
      
      if (this.sendAudioButton) {
        this.sendAudioButton.addEventListener("click", () => this.sendAudioToChat());
      }
  
      // Set up visualizer
      if (this.audioVisualizer) {
        this.setupVisualizer();
      }
  
      console.log("AudioRecorder event listeners set up");
    }
  
    showAudioRecorder() {
      if (this.audioRecordingContainer) {
        this.audioRecordingContainer.classList.remove("hidden");
        this.resetRecorder();
      }
    }
  
    hideAudioRecorder() {
      if (this.audioRecordingContainer) {
        this.audioRecordingContainer.classList.add("hidden");
        this.stopRecording();
        this.resetRecorder();
      }
    }
  
    resetRecorder() {
      this.audioChunks = [];
      this.audioBlob = null;
      this.audioUrl = null;
      
      if (this.audioTimer) {
        this.audioTimer.textContent = "00:00";
      }
      
      if (this.startRecordingButton) {
        this.startRecordingButton.disabled = false;
      }
      
      if (this.stopRecordingButton) {
        this.stopRecordingButton.disabled = true;
      }
      
      if (this.sendAudioButton) {
        this.sendAudioButton.disabled = true;
      }
      
      if (this.audioPlaybackContainer) {
        this.audioPlaybackContainer.classList.add("hidden");
      }
  
      // Clear the visualizer
      if (this.audioVisualizer) {
        const ctx = this.audioVisualizer.getContext("2d");
        ctx.clearRect(0, 0, this.audioVisualizer.width, this.audioVisualizer.height);
      }
  
      // Stop any ongoing timer
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    }
  
    async startRecording() {
      try {
        // Request microphone access
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  
        // Create media recorder
        this.mediaRecorder = new MediaRecorder(this.stream);
        this.audioChunks = [];
  
        // Set up event handlers
        this.mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            this.audioChunks.push(e.data);
          }
        };
  
        this.mediaRecorder.onstop = () => {
          // Create audio blob
          this.audioBlob = new Blob(this.audioChunks, { type: "audio/wav" });
          this.audioUrl = URL.createObjectURL(this.audioBlob);
  
          // Set up audio playback
          if (this.audioPlayback) {
            this.audioPlayback.src = this.audioUrl;
          }
          
          if (this.audioPlaybackContainer) {
            this.audioPlaybackContainer.classList.remove("hidden");
          }
  
          // Enable send button
          if (this.sendAudioButton) {
            this.sendAudioButton.disabled = false;
          }
  
          // Stop the timer
          if (this.timerInterval) {
            clearInterval(this.timerInterval);
          }
  
          // Stop the visualizer
          this.stopVisualizer();
        };
  
        // Start recording
        this.mediaRecorder.start();
        this.recordingStartTime = Date.now();
  
        // Update UI
        if (this.startRecordingButton) {
          this.startRecordingButton.disabled = true;
        }
        
        if (this.stopRecordingButton) {
          this.stopRecordingButton.disabled = false;
        }
  
        // Start timer
        this.startTimer();
  
        // Start visualizer
        this.startVisualizer(this.stream);
  
        console.log("Recording started");
      } catch (error) {
        console.error("Error starting recording:", error);
        alert("Could not access microphone. Please check your permissions and try again.");
      }
    }
  
    stopRecording() {
      if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
        this.mediaRecorder.stop();
        console.log("Recording stopped");
      }
  
      // Stop all tracks in the stream
      if (this.stream) {
        this.stream.getTracks().forEach((track) => track.stop());
      }
    }
  
    startTimer() {
      this.timerInterval = setInterval(() => {
        const elapsedTime = Date.now() - this.recordingStartTime;
        const seconds = Math.floor((elapsedTime / 1000) % 60)
          .toString()
          .padStart(2, "0");
        const minutes = Math.floor((elapsedTime / 1000 / 60) % 60)
          .toString()
          .padStart(2, "0");
          
        if (this.audioTimer) {
          this.audioTimer.textContent = `${minutes}:${seconds}`;
        }
      }, 1000);
    }
  
    setupVisualizer() {
      if (this.audioVisualizer) {
        this.visualizerContext = this.audioVisualizer.getContext("2d");
      }
    }
  
    startVisualizer(stream) {
      if (!this.audioVisualizer || !this.visualizerContext) return;
  
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
  
        source.connect(analyser);
        // Don't connect to audioContext.destination to avoid feedback
  
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
  
        const draw = () => {
          if (!this.visualizerContext) return;
  
          requestAnimationFrame(draw);
  
          analyser.getByteFrequencyData(dataArray);
  
          this.visualizerContext.fillStyle = "rgb(200, 200, 200)";
          this.visualizerContext.fillRect(0, 0, this.audioVisualizer.width, this.audioVisualizer.height);
  
          const barWidth = (this.audioVisualizer.width / bufferLength) * 2.5;
          let barHeight;
          let x = 0;
  
          for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2;
  
            this.visualizerContext.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
            this.visualizerContext.fillRect(
              x,
              this.audioVisualizer.height - barHeight,
              barWidth,
              barHeight
            );
  
            x += barWidth + 1;
          }
        };
  
        draw();
      } catch (error) {
        console.error("Error starting visualizer:", error);
      }
    }
  
    stopVisualizer() {
      // Nothing to do here, the visualizer will stop when the animation frame is no longer called
    }
  
    async sendAudioToChat() {
      if (!this.audioBlob) return;
  
      try {
        // Show loading overlay
        const loadingOverlay = document.getElementById("loading-overlay");
        const loadingText = document.getElementById("loading-text");
        
        if (loadingOverlay) {
          loadingOverlay.classList.remove("hidden");
        }
        
        if (loadingText) {
          loadingText.textContent = "Processing audio...";
        }
  
        // Simulate transcription (in a real app, you'd use a speech-to-text service)
        const transcription = await this.simulateTranscription();
  
        // Create file content object
        const fileContent = {
          text: transcription,
          audioUrl: this.audioUrl,
          metadata: {
            fileName: `recording_${new Date().toISOString()}.wav`,
            fileSize: this.formatFileSize(this.audioBlob.size),
            duration: this.formatDuration((Date.now() - this.recordingStartTime) / 1000),
          },
        };
  
        // Set the transcription in the input field
        const userInput = document.getElementById("user-input");
        if (userInput) {
          userInput.value = transcription;
        }
  
        // Store the processed content in fileProcessor
        if (window.fileProcessor) {
          window.fileProcessor.processedContent = fileContent;
        }
  
        // Hide audio recorder
        this.hideAudioRecorder();
  
        // Hide loading overlay
        if (loadingOverlay) {
          loadingOverlay.classList.add("hidden");
        }
  
        // Send the message if there's text
        if (transcription.trim() && window.chatApp) {
          window.chatApp.sendMessage();
        }
      } catch (error) {
        console.error("Error sending audio to chat:", error);
        
        const loadingOverlay = document.getElementById("loading-overlay");
        if (loadingOverlay) {
          loadingOverlay.classList.add("hidden");
        }
        
        alert("Error processing audio. Please try again.");
      }
    }
  
    async simulateTranscription() {
      // Simulate a delay to mimic processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Return a simulated transcription
      return "This is a simulated transcription of your audio. In a real implementation, you would use a speech-to-text service like Google Speech-to-Text or Web Speech API.";
    }
  
    formatFileSize(bytes) {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    }
  
    formatDuration(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }
  }
  
  // Initialize audio recorder
  document.addEventListener("DOMContentLoaded", () => {
    console.log("Initializing AudioRecorder");
    window.audioRecorder = new AudioRecorder();
  });