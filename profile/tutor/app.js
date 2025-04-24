const API_BASE_URL = 'http://localhost:3000/api';

import { tutorService } from './tprofile/services/api.js';

// State management
const state = {
    tutor: null,
    activeDoubts: [],
    resolvedDoubts: [],
    currentTab: 'dashboard',
    isLoading: false,
    error: null
};

// Initialize app
async function initialize() {
    showLoading();
    try {
        console.log('Fetching initial data...');
        const [tutorData, activeDoubts, resolvedDoubts] = await Promise.all([
            tutorService.getTutorProfile('TEB12345'),
            tutorService.getActiveDoubts(),
            tutorService.getResolvedDoubts()
        ]);

        console.log('Data fetched successfully:', { tutorData, activeDoubts, resolvedDoubts });

        // Update state
        state.tutor = tutorData;
        state.activeDoubts = activeDoubts;
        state.resolvedDoubts = resolvedDoubts;

        // Render UI
        renderProfile();
        renderActiveDoubts();
        renderResolvedDoubts();
    } catch (error) {
        showError('Failed to initialize application');
        console.error('Initialization error:', error);
    } finally {
        hideLoading();
    }
}

// UI Rendering Functions
function renderProfile() {
    if (!state.tutor) return;
    document.getElementById('tutorName').textContent = state.tutor.name;
    document.getElementById('tutorId').textContent = state.tutor.id;
    document.getElementById('profileAvatar').src = state.tutor.avatar;
    document.getElementById('doubtsSolved').textContent = state.tutor.doubtsResolved;
    document.getElementById('toggleAvailability').textContent = state.tutor.status === 'online' ? 'Go Offline' : 'Go Online';
}

function renderActiveDoubts() {
    if (!state.activeDoubts) return;
    const activeDoubtsContainer = document.querySelector('#active-doubts .doubts-container');
    activeDoubtsContainer.innerHTML = state.activeDoubts.map(doubt => `
        <div class="doubt-card ${doubt.status === 'active' ? 'active-doubt' : 'pending-doubt'}">
            <div class="doubt-status-badge ${doubt.status === 'active' ? 'urgent' : 'new'}">
                ${doubt.status === 'active' ? 'Live' : 'New'}
            </div>
            <div class="doubt-content">
                <div class="student-info">
                    <img src="${doubt.studentAvatar}" alt="Student" class="student-avatar">
                    <div class="student-details">
                        <h4>${doubt.studentName}</h4>
                        <span class="language-tag">${doubt.language}</span>
                    </div>
                </div>
                <h4>${doubt.topic}</h4>
                <p>${doubt.question}</p>
                ${renderAttachments(doubt.attachments)}
                <div class="doubt-meta">
                    <span><i class="fas fa-book"></i> ${doubt.subject} • Class ${doubt.class}</span>
                    <span><i class="fas fa-clock"></i> ${formatTime(doubt.startTime)}</span>
                </div>
                <div class="doubt-actions">
                    ${doubt.status === 'active'
                        ? `<button class="btn btn-primary" onclick="continueDoubt('${doubt.id}')">Continue Solving</button>
                           <button class="btn btn-outline" onclick="endDoubt('${doubt.id}')">End Session</button>`
                        : `<button class="btn btn-primary" onclick="acceptDoubt('${doubt.id}')">Accept Doubt</button>
                           <button class="btn btn-outline" onclick="viewDoubtDetails('${doubt.id}')">View Details</button>`
                    }
                </div>
            </div>
        </div>
    `).join('');
}

// Helper functions
function renderAttachments(attachments) {
    if (!attachments || attachments.length === 0) return '';
    return attachments.map(attachment => `
        <div class="attachment-preview">
            <span class="attachment-icon">${getAttachmentIcon(attachment.type)}</span>
            <span class="attachment-name">${attachment.name}</span>
        </div>
    `).join('');
}

function getAttachmentIcon(type) {
    const icons = {
        image: '📷',
        audio: '🎤',
        video: '🎥',
        document: '📄'
    };
    return icons[type] || '📎';
}

// Event Handlers
async function toggleAvailability() {
    showLoading();
    try {
        const newStatus = state.tutor.status === 'online' ? 'offline' : 'online';
        const response = await tutorService.updateTutorStatus(newStatus);
        state.tutor.status = response.status;
        renderProfile();
    } catch (error) {
        showError('Failed to update availability');
    } finally {
        hideLoading();
    }
}

async function acceptDoubt(doubtId) {
    showLoading();
    try {
        const response = await tutorService.acceptDoubt(doubtId);
        const updatedDoubts = await tutorService.getActiveDoubts();
        state.activeDoubts = updatedDoubts;
        renderActiveDoubts();
    } catch (error) {
        showError('Failed to accept doubt');
    } finally {
        hideLoading();
    }
}

// Utility Functions
function showLoading() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'block';
    }
}

function hideLoading() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
}

function showError(message) {
    const errorContainer = document.getElementById('errorContainer');
    if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
        setTimeout(() => {
            errorContainer.style.display = 'none';
        }, 5000);
    }
}

// Format time relative to now
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return date.toLocaleDateString();
}

// Event Listeners
document.getElementById('toggleAvailability').addEventListener('click', toggleAvailability);
document.querySelectorAll('.tab').forEach(button => {
    button.addEventListener('click', () => {
        const tabName = button.dataset.tab;
        switchTab(tabName);
    });
});

// Real-time updates (polling)
setInterval(async () => {
    if (state.currentTab === 'active-doubts') {
        const updatedDoubts = await tutorService.getActiveDoubts();
        if (JSON.stringify(updatedDoubts) !== JSON.stringify(state.activeDoubts)) {
            state.activeDoubts = updatedDoubts;
            renderActiveDoubts();
        }
    }
}, 30000); // Update every 30 seconds

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initialize);
