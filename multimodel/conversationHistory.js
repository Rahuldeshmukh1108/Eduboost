// Conversation History Manager
class ConversationHistoryManager {
    constructor() {
      this.historyList = document.getElementById("history-list");
      this.conversations = [];
      this.init();
    }
  
    init() {
      // Load conversations from localStorage
      this.loadConversations();
      
      // Render conversation history
      this.renderConversationHistory();
      
      console.log("ConversationHistoryManager initialized");
    }
  
    loadConversations() {
      const savedConversations = localStorage.getItem("conversations");
      if (savedConversations) {
        try {
          this.conversations = JSON.parse(savedConversations);
        } catch (error) {
          console.error("Error parsing saved conversations:", error);
          this.conversations = [];
        }
      }
    }
  
    saveConversations() {
      localStorage.setItem("conversations", JSON.stringify(this.conversations));
    }
  
    renderConversationHistory() {
      if (!this.historyList) return;
      
      // Clear current history
      this.historyList.innerHTML = "";
  
      // Sort conversations by timestamp (newest first)
      const sortedConversations = [...this.conversations].sort((a, b) => b.timestamp - a.timestamp);
  
      // Add conversations to history list
      sortedConversations.forEach((conversation) => {
        const listItem = document.createElement("div");
        listItem.className = "history-item";
        
        // Create conversation title
        const titleSpan = document.createElement("span");
        titleSpan.className = "history-item-title";
        titleSpan.textContent = conversation.title;
        titleSpan.dataset.id = conversation.id;
        
        // Create actions container
        const actionsContainer = document.createElement("div");
        actionsContainer.className = "history-item-actions";
        
        // Create favorite button
        const favoriteBtn = document.createElement("button");
        favoriteBtn.className = "history-action-btn" + (conversation.favorite ? " active" : "");
        favoriteBtn.innerHTML = '<i class="fas fa-star"></i>';
        favoriteBtn.title = "Favorite";
        favoriteBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.toggleFavorite(conversation.id);
        });
        
        // Create share button
        const shareBtn = document.createElement("button");
        shareBtn.className = "history-action-btn";
        shareBtn.innerHTML = '<i class="fas fa-share-alt"></i>';
        shareBtn.title = "Share";
        shareBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.shareConversation(conversation);
        });
        
        // Create delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "history-action-btn";
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.title = "Delete";
        deleteBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.deleteConversation(conversation.id);
        });
        
        // Add buttons to actions container
        actionsContainer.appendChild(favoriteBtn);
        actionsContainer.appendChild(shareBtn);
        actionsContainer.appendChild(deleteBtn);
        
        // Add title and actions to list item
        listItem.appendChild(titleSpan);
        listItem.appendChild(actionsContainer);
        
        // Highlight current conversation if needed
        if (window.chatApp && window.chatApp.currentConversation && 
            conversation.id === window.chatApp.currentConversation.id) {
          listItem.classList.add("active");
        }
  
        // Add click event to load conversation
        listItem.addEventListener("click", () => {
          if (window.chatApp) {
            window.chatApp.loadConversation(conversation.id);
          }
        });
  
        this.historyList.appendChild(listItem);
      });
    }
  
    toggleFavorite(conversationId) {
      const index = this.conversations.findIndex(c => c.id === conversationId);
      if (index !== -1) {
        this.conversations[index].favorite = !this.conversations[index].favorite;
        this.saveConversations();
        this.renderConversationHistory();
      }
    }
  
    shareConversation(conversation) {
      // Create a shareable text version of the conversation
      let shareText = `Conversation: ${conversation.title}\n\n`;
      
      conversation.messages.forEach(msg => {
        const role = msg.role === "user" ? "You" : "AI";
        const content = typeof msg.content === "string" ? msg.content : msg.content.text;
        shareText += `${role}: ${content}\n\n`;
      });
      
      // Try to use Web Share API if available
      if (navigator.share) {
        navigator.share({
          title: conversation.title,
          text: shareText
        }).catch(err => {
          console.error("Error sharing:", err);
          this.copyToClipboard(shareText);
        });
      } else {
        this.copyToClipboard(shareText);
      }
    }
  
    copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
        alert("Conversation copied to clipboard!");
      }).catch(err => {
        console.error("Failed to copy text:", err);
        
        // Fallback method
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        alert("Conversation copied to clipboard!");
      });
    }
  
    deleteConversation(conversationId) {
      if (confirm("Are you sure you want to delete this conversation?")) {
        this.conversations = this.conversations.filter(c => c.id !== conversationId);
        this.saveConversations();
        this.renderConversationHistory();
        
        // If the current conversation was deleted, start a new one
        if (window.chatApp && window.chatApp.currentConversation && 
            window.chatApp.currentConversation.id === conversationId) {
          window.chatApp.clearChat();
        }
      }
    }
  
    addConversation(conversation) {
      // Check if conversation already exists
      const existingIndex = this.conversations.findIndex(c => c.id === conversation.id);
      
      if (existingIndex !== -1) {
        // Update existing conversation
        this.conversations[existingIndex] = conversation;
      } else {
        // Add new conversation
        this.conversations.push(conversation);
      }
      
      this.saveConversations();
      this.renderConversationHistory();
    }
  }
  
  // Initialize conversation history manager
  document.addEventListener("DOMContentLoaded", () => {
    console.log("Initializing ConversationHistoryManager");
    window.conversationHistoryManager = new ConversationHistoryManager();
  });