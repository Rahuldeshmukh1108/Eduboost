// Message Actions Module
class MessageActions {
    constructor() {
      this.activeDropdown = null
      this.init()
    }
  
    init() {
      // Close dropdown when clicking outside
      document.addEventListener("click", (e) => {
        if (
          this.activeDropdown &&
          !e.target.closest(".message-actions-dropdown") &&
          !e.target.closest(".message-actions-button")
        ) {
          this.closeAllDropdowns()
        }
      })
  
      console.log("MessageActions initialized")
    }
  
    addActionsToMessage(messageElement, isUserMessage = false) {
      // Create actions button
      const actionsButton = document.createElement("button")
      actionsButton.className = "message-actions-button"
      actionsButton.innerHTML = '<i class="fas fa-ellipsis-v"></i>'
      actionsButton.title = "Message actions"
  
      // Create dropdown
      const dropdown = document.createElement("div")
      dropdown.className = "message-actions-dropdown hidden"
  
      // Add actions to dropdown
      const actions = [
        { icon: "fa-share-alt", text: "Share", action: () => this.shareMessage(messageElement) },
        { icon: "fa-edit", text: "Rename", action: () => this.renameMessage(messageElement), userOnly: true },
        { icon: "fa-star", text: "Favorite", action: () => this.favoriteMessage(messageElement) },
        { icon: "fa-trash", text: "Delete", action: () => this.deleteMessage(messageElement) },
      ]
  
      actions.forEach((action) => {
        if (action.userOnly && !isUserMessage) return
  
        const actionItem = document.createElement("div")
        actionItem.className = "dropdown-item"
        actionItem.innerHTML = `<i class="fas ${action.icon}"></i> ${action.text}`
        actionItem.addEventListener("click", (e) => {
          e.stopPropagation()
          action.action()
          this.closeAllDropdowns()
        })
  
        dropdown.appendChild(actionItem)
      })
  
      // Add event listener to button
      actionsButton.addEventListener("click", (e) => {
        e.stopPropagation()
        this.toggleDropdown(dropdown)
      })
  
      // Add button and dropdown to message
      const contentDiv = messageElement.querySelector(".message-content")
      contentDiv.appendChild(actionsButton)
      contentDiv.appendChild(dropdown)
    }
  
    toggleDropdown(dropdown) {
      // Close any open dropdown
      this.closeAllDropdowns()
  
      // Open this dropdown
      dropdown.classList.remove("hidden")
      this.activeDropdown = dropdown
    }
  
    closeAllDropdowns() {
      document.querySelectorAll(".message-actions-dropdown").forEach((dropdown) => {
        dropdown.classList.add("hidden")
      })
      this.activeDropdown = null
    }
  
    shareMessage(messageElement) {
      const messageText = messageElement.querySelector(".message-content p").textContent
  
      // Check if the Web Share API is available
      if (navigator.share) {
        navigator.share({
          title: "AI Tutor Chat",
          text: messageText,
        }).catch((err) => {
          console.error("Error sharing:", err)
          this.copyToClipboard(messageText)
        })
      } else {
        this.copyToClipboard(messageText)
      }
    }
  
    copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
        alert("Message copied to clipboard!")
      }).catch((err) => {
        console.error("Failed to copy text:", err)
      })
    }
  
    renameMessage(messageElement) {
      // This would typically rename a saved message or conversation
      alert("Rename functionality would be implemented here")
    }
  
    favoriteMessage(messageElement) {
      messageElement.classList.toggle("favorited")
  
      if (messageElement.classList.contains("favorited")) {
        const star = document.createElement("i")
        star.className = "fas fa-star favorite-star"
        messageElement.appendChild(star)
      } else {
        const star = messageElement.querySelector(".favorite-star")
        if (star) star.remove()
      }
    }
  
    deleteMessage(messageElement) {
      if (confirm("Are you sure you want to delete this message?")) {
        // Add fade-out animation
        messageElement.style.animation = "fadeOut 0.3s ease forwards"
  
        // Remove after animation completes
        setTimeout(() => {
          messageElement.remove()
  
          // Update conversation in chat app
          if (window.chatApp) {
            window.chatApp.removeMessageFromConversation(messageElement.dataset.messageId)
          }
        }, 300)
      }
    }
  }
  
  // Initialize message actions
  document.addEventListener("DOMContentLoaded", () => {
    console.log("Initializing MessageActions")
    window.messageActions = new MessageActions()
  })