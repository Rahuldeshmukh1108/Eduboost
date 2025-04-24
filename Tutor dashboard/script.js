// DOM Elements
const sidebar = document.querySelector('.sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const mobileToggle = document.getElementById('mobile-toggle');
const mainContent = document.querySelector('.main-content');
const themeToggle = document.getElementById('theme-toggle');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Toggle sidebar on desktop
sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
});

// Toggle sidebar on mobile
mobileToggle.addEventListener('click', () => {
    sidebar.classList.toggle('mobile-open');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
            sidebar.classList.remove('mobile-open');
        }
    }
});

// Toggle dark/light theme
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    
    // Update icon
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('dark-theme')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
    
    // Save theme preference
    const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
});

// Load saved theme
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        const icon = themeToggle.querySelector('i');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
});

// Tab functionality
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        const tabId = button.getAttribute('data-tab');
        document.getElementById(`${tabId}-tab`).classList.add('active');
    });
});

// Simple Calendar Implementation
class Calendar {
    constructor(container) {
        this.container = container;
        this.date = new Date();
        this.render();
    }
    
    render() {
        const year = this.date.getFullYear();
        const month = this.date.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        let html = `
            <div class="calendar-header">
                <button class="prev-month"><i class="fas fa-chevron-left"></i></button>
                <h3>${monthNames[month]} ${year}</h3>
                <button class="next-month"><i class="fas fa-chevron-right"></i></button>
            </div>
            <div class="calendar-body">
                <div class="weekdays">
                    <div>Sun</div>
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>
                </div>
                <div class="days">
        `;
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDay; i++) {
            html += `<div class="day empty"></div>`;
        }
        
        // Add days of the month
        const today = new Date();
        const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;
        
        for (let i = 1; i <= daysInMonth; i++) {
            const isToday = isCurrentMonth && i === today.getDate();
            const hasEvent = this.hasEvent(year, month, i);
            
            html += `
                <div class="day ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''}">
                    ${i}
                    ${hasEvent ? '<span class="event-indicator"></span>' : ''}
                </div>
            `;
        }
        
        html += `
                </div>
            </div>
        `;
        
        this.container.innerHTML = html;
        
        // Add event listeners for navigation
        this.container.querySelector('.prev-month').addEventListener('click', () => {
            this.date.setMonth(this.date.getMonth() - 1);
            this.render();
        });
        
        this.container.querySelector('.next-month').addEventListener('click', () => {
            this.date.setMonth(this.date.getMonth() + 1);
            this.render();
        });
    }
    
    hasEvent(year, month, day) {
        // Sample events data - in a real app, this would come from a database
        const events = [
            { date: new Date(2023, 3, 15) }, // April 15, 2023
            { date: new Date(2023, 3, 18) }, // April 18, 2023
            { date: new Date(2023, 3, 20) }, // April 20, 2023
            { date: new Date(2023, 3, 25) }, // April 25, 2023
            { date: new Date(2023, 4, 5) },  // May 5, 2023
            { date: new Date(2023, 4, 10) }, // May 10, 2023
        ];
        
        // Check if the current date has an event
        return events.some(event => {
            return event.date.getFullYear() === year && 
                   event.date.getMonth() === month && 
                   event.date.getDate() === day;
        });
    }
}

// Initialize calendar
document.addEventListener('DOMContentLoaded', () => {
    const calendarContainer = document.getElementById('calendar');
    if (calendarContainer) {
        new Calendar(calendarContainer);
    }
});

// Add CSS for calendar
const calendarStyles = `
.calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-md);
}

.calendar-header button {
    color: var(--text-secondary);
    padding: var(--spacing-xs);
    border-radius: var(--border-radius-sm);
}

.calendar-header button:hover {
    background-color: var(--bg-secondary);
}

.weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    font-weight: 500;
    color: var(--text-secondary);
    margin-bottom: var(--spacing-sm);
}

.days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: var(--spacing-xs);
}

.day {
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border-radius: var(--border-radius-sm);
    cursor: pointer;
}

.day:not(.empty):hover {
    background-color: var(--bg-secondary);
}

.day.empty {
    cursor: default;
}

.day.today {
    background-color: var(--primary-light);
    color: var(--primary-color);
    font-weight: 500;
}

.day.has-event::after {
    content: '';
    position: absolute;
    bottom: 4px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: var(--primary-color);
}
`;

// Add calendar styles to the document
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = calendarStyles;
document.head.appendChild(styleSheet);

// Navigation functionality
document.querySelectorAll('.sidebar-menu a').forEach(link => {
    link.addEventListener('click', (e) => {
        // Prevent default only for demo purposes
        e.preventDefault();
        
        // Remove active class from all links
        document.querySelectorAll('.sidebar-menu li').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to clicked link's parent
        link.parentElement.classList.add('active');
        
        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('mobile-open');
        }
    });
});
