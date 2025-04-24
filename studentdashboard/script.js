document.addEventListener('DOMContentLoaded', function() {
    // Mobile sidebar toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const mobileToggle = document.getElementById('mobile-toggle');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
      });
    }
    
    if (mobileToggle) {
      mobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
      });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 && 
          sidebar.classList.contains('active') && 
          !sidebar.contains(e.target) && 
          e.target !== sidebarToggle &&
          e.target !== mobileToggle) {
        sidebar.classList.remove('active');
      }
    });
  
    // Tab switching
    const tabTriggers = document.querySelectorAll('.tab-trigger');
    tabTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const tabId = trigger.getAttribute('data-tab');
        
        // Remove active class from all triggers and content
        document.querySelectorAll('.tab-trigger').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked trigger and corresponding content
        trigger.classList.add('active');
        document.getElementById(tabId).classList.add('active');
      });
    });
    
    // Modal functionality - Generic modal handler
    function setupModal(triggerSelector, modalSelector, closeSelector) {
      const trigger = document.querySelector(triggerSelector);
      const modal = document.querySelector(modalSelector);
      const closeBtn = modal.querySelector(closeSelector || '.close-modal');
      
      if (trigger && modal) {
        trigger.addEventListener('click', () => {
          modal.classList.add('active');
        });
        
        if (closeBtn) {
          closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
          });
        }
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
          if (e.target === modal) {
            modal.classList.remove('active');
          }
        });
      }
      
      return { trigger, modal, closeBtn };
    }
    
    // Setup all modals
    const addFundsModalElements = setupModal('#addFundsBtn', '#addFundsModal');
    const settingsModalElements = setupModal('#settings-link', '#settingsModal');
    const feedbackFormModalElements = setupModal('#request-feedback-btn', '#feedbackFormModal');
    
    // Payment method selection
    const paymentRadios = document.querySelectorAll('input[name="payment-method"]');
    const newCardForm = document.getElementById('new-card-form');
    
    paymentRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.value === 'new-card') {
          newCardForm.style.display = 'block';
        } else {
          newCardForm.style.display = 'none';
        }
        
        // Update payment method in summary
        updatePaymentMethodSummary();
      });
    });
    
    // Card number formatting
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
      cardNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = '';
        
        for (let i = 0; i < value.length; i++) {
          if (i > 0 && i % 4 === 0) {
            formattedValue += ' ';
          }
          formattedValue += value[i];
        }
        
        e.target.value = formattedValue;
      });
    }
    
    // Expiry date formatting
    const expiryInput = document.getElementById('expiry');
    if (expiryInput) {
      expiryInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        
        if (value.length > 2) {
          value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        
        e.target.value = value;
      });
    }
    
    // Multi-step payment process
    const nextStepBtns = document.querySelectorAll('.next-step');
    const prevStepBtns = document.querySelectorAll('.prev-step');
    const paymentSteps = document.querySelectorAll('.payment-steps .step');
    const stepContents = document.querySelectorAll('.step-content');
    
    nextStepBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const nextStepNum = parseInt(btn.getAttribute('data-next'));
        
        // Validate current step
        if (nextStepNum === 2) {
          const amount = parseFloat(document.getElementById('amount').value);
          if (!amount || isNaN(amount) || amount < 10) {
            alert('Please enter a valid amount (minimum $10)');
            return;
          }
          
          // Update summary amount
          document.getElementById('summary-amount').textContent = '$' + amount.toFixed(2);
          document.getElementById('summary-total').textContent = '$' + amount.toFixed(2);
        } else if (nextStepNum === 3) {
          const selectedPayment = document.querySelector('input[name="payment-method"]:checked');
          if (!selectedPayment) {
            alert('Please select a payment method');
            return;
          }
          
          // If new card is selected, validate card details
          if (selectedPayment.value === 'new-card') {
            const cardNumber = document.getElementById('card-number').value;
            const expiry = document.getElementById('expiry').value;
            const cvv = document.getElementById('cvv').value;
            const cardName = document.getElementById('card-name').value;
            
            if (!cardNumber || !expiry || !cvv || !cardName) {
              alert('Please fill in all card details');
              return;
            }
            
            // Simple validation
            if (cardNumber.replace(/\s/g, '').length !== 16) {
              alert('Please enter a valid 16-digit card number');
              return;
            }
            
            if (!/^\d{2}\/\d{2}$/.test(expiry)) {
              alert('Please enter expiry date in MM/YY format');
              return;
            }
            
            if (!/^\d{3}$/.test(cvv)) {
              alert('Please enter a valid 3-digit CVV');
              return;
            }
          }
        }
        
        // Move to next step
        paymentSteps.forEach(step => {
          const stepNum = parseInt(step.getAttribute('data-step'));
          if (stepNum < nextStepNum) {
            step.classList.add('completed');
            step.classList.remove('active');
          } else if (stepNum === nextStepNum) {
            step.classList.add('active');
          } else {
            step.classList.remove('active', 'completed');
          }
        });
        
        stepContents.forEach(content => content.classList.remove('active'));
        document.getElementById(`step-${nextStepNum}`).classList.add('active');
      });
    });
    
    prevStepBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const prevStepNum = parseInt(btn.getAttribute('data-prev'));
        
        paymentSteps.forEach(step => {
          const stepNum = parseInt(step.getAttribute('data-step'));
          if (stepNum < prevStepNum) {
            step.classList.add('completed');
            step.classList.remove('active');
          } else if (stepNum === prevStepNum) {
            step.classList.add('active');
          } else {
            step.classList.remove('active', 'completed');
          }
        });
        
        stepContents.forEach(content => content.classList.remove('active'));
        document.getElementById(`step-${prevStepNum}`).classList.add('active');
      });
    });
    
    // Quick amount selection
    const quickAmountBtns = document.querySelectorAll('.quick-amount');
    const amountInput = document.getElementById('amount');
    
    quickAmountBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const amount = parseInt(btn.getAttribute('data-amount'));
        amountInput.value = amount;
      });
    });
    
    // Update payment method summary
    function updatePaymentMethodSummary() {
      const selectedPayment = document.querySelector('input[name="payment-method"]:checked');
      const summaryPaymentMethod = document.getElementById('summary-payment-method');
      
      if (selectedPayment && summaryPaymentMethod) {
        let methodText = '';
        
        switch (selectedPayment.value) {
          case 'card-1':
            methodText = 'Visa ending in 4242';
            break;
          case 'card-2':
            methodText = 'Mastercard ending in 5678';
            break;
          case 'paypal':
            methodText = 'PayPal';
            break;
          case 'new-card':
            methodText = 'New card';
            break;
        }
        
        summaryPaymentMethod.textContent = methodText;
      }
    }
    
    // Initialize payment method summary
    updatePaymentMethodSummary();
    
    // Add funds functionality
    const confirmAddFunds = document.getElementById('confirmAddFunds');
    
    confirmAddFunds.addEventListener('click', () => {
      const amount = parseFloat(document.getElementById('amount').value);
      
      if (!amount || isNaN(amount)) {
        alert('Please enter a valid amount');
        return;
      }
      
      // Get selected payment method
      const selectedPayment = document.querySelector('input[name="payment-method"]:checked');
      if (!selectedPayment) {
        alert('Please select a payment method');
        return;
      }
      
      // Show loading state
      confirmAddFunds.disabled = true;
      confirmAddFunds.innerHTML = `
        <div class="spinner-small"></div>
        Processing...
      `;
      
      // Simulate payment processing
      setTimeout(() => {
        // Get current balance
        const balanceElement = document.querySelector('.balance-amount');
        let currentBalance = parseFloat(balanceElement.textContent.replace('$', ''));
        
        // Update balance
        currentBalance += amount;
        balanceElement.textContent = '$' + currentBalance.toFixed(2);
        
        // Add to transactions
        const transactionsList = document.querySelector('.transactions-list');
        const now = new Date();
        const dateString = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        
        const newTransaction = document.createElement('div');
        newTransaction.className = 'transaction-item';
        newTransaction.innerHTML = `
          <div>
            <p class="transaction-title">Added Funds</p>
            <p class="transaction-date">${dateString}</p>
          </div>
          <p class="transaction-amount positive">+$${amount.toFixed(2)}</p>
        `;
        
        transactionsList.insertBefore(newTransaction, transactionsList.firstChild);
        
        // Reset form and close modal
        amountInput.value = '50';
        if (selectedPayment.value === 'new-card') {
          document.getElementById('card-number').value = '';
          document.getElementById('expiry').value = '';
          document.getElementById('cvv').value = '';
          document.getElementById('card-name').value = '';
          newCardForm.style.display = 'none';
          document.getElementById('card-1').checked = true;
        }
        
        // Reset payment steps
        paymentSteps.forEach(step => {
          const stepNum = parseInt(step.getAttribute('data-step'));
          if (stepNum === 1) {
            step.classList.add('active');
          } else {
            step.classList.remove('active', 'completed');
          }
        });
        
        stepContents.forEach(content => content.classList.remove('active'));
        document.getElementById('step-1').classList.add('active');
        
        // Reset button state
        confirmAddFunds.disabled = false;
        confirmAddFunds.textContent = 'Confirm Payment';
        
        // Close modal
        addFundsModalElements.modal.classList.remove('active');
        
        // Show success message
        showNotification(`Successfully added $${amount.toFixed(2)} to your wallet!`, 'success');
      }, 2000);
    });
    
    // Initialize charts
    const problemsChartCtx = document.getElementById('problemsChart').getContext('2d');
    
    const problemsData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Problems Solved',
        data: [5, 8, 12, 7, 10, 15, 9],
        fill: true,
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        tension: 0.4
      }]
    };
    
    new Chart(problemsChartCtx, {
      type: 'line',
      data: problemsData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: true,
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
    
    // Feedback carousel scrolling
    const carousel = document.getElementById('feedback-carousel');
    const scrollLeftBtn = document.getElementById('scroll-left');
    const scrollRightBtn = document.getElementById('scroll-right');
    
    scrollLeftBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: -320, behavior: 'smooth' });
    });
    
    scrollRightBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: 320, behavior: 'smooth' });
    });
    
    // Groq AI Integration for Analysis and Summaries
    const refreshAnalysisBtn = document.getElementById('refresh-analysis');
    const refreshSummaryBtn = document.getElementById('refresh-summary');
    const analysisLoading = document.getElementById('analysis-loading');
    const analysisContent = document.getElementById('analysis-content');
    const summaryLoading = document.getElementById('summary-loading');
    const summaryContent = document.getElementById('summary-content');
    const questionInput = document.getElementById('question-input');
    const askQuestionBtn = document.getElementById('ask-question');
    const historyList = document.querySelector('.history-list');
    
    // Store question history
    let questionHistory = [];
    
    // Function to simulate Groq AI analysis
    function generateGroqAnalysis() {
      // Show loading state
      analysisLoading.style.display = 'flex';
      analysisContent.style.display = 'none';
      
      // Simulate API call delay
      setTimeout(() => {
        // Hide loading state
        analysisLoading.style.display = 'none';
        analysisContent.style.display = 'block';
        
        // Update content with "new" AI analysis
        const analysisText = getRandomConciseAnalysis();
        document.querySelector('.ai-analysis .ai-content .section-text').textContent = analysisText;
      }, 2000);
    }
    
    // Function to simulate Groq AI summary generation
    function generateGroqSummary() {
      // Show loading state
      summaryLoading.style.display = 'flex';
      summaryContent.style.display = 'none';
      
      // Simulate API call delay
      setTimeout(() => {
        // Hide loading state
        summaryLoading.style.display = 'none';
        summaryContent.style.display = 'block';
        
        // Update content with "new" AI summary
        const summaryData = getRandomSummary();
        updateSummaryContent(summaryData);
      }, 2000);
    }
    
    // Function to ask a question to Groq AI
    function askGroqQuestion(question) {
      // Disable button and show loading
      askQuestionBtn.disabled = true;
      askQuestionBtn.innerHTML = `<div class="spinner-small"></div>`;
      
      // Simulate API call delay
      setTimeout(() => {
        // Generate a response
        const answer = getRandomAnswer(question);
        
        // Add to history
        addQuestionToHistory(question, answer);
        
        // Reset input and button
        questionInput.value = '';
        askQuestionBtn.disabled = false;
        askQuestionBtn.textContent = 'Ask';
      }, 2000);
    }
    
    // Function to add a question to history
    function addQuestionToHistory(question, answer) {
      const now = new Date();
      const dateString = now.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      // Add to history array
      questionHistory.unshift({
        question,
        answer,
        date: dateString
      });
      
      // Limit history to 10 items
      if (questionHistory.length > 10) {
        questionHistory.pop();
      }
      
      // Update UI
      updateHistoryUI();
    }
    
    // Function to update history UI
    function updateHistoryUI() {
      if (!historyList) return;
      
      historyList.innerHTML = '';
      
      questionHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
          <div class="history-question">${item.question}</div>
          <div class="history-answer">${item.answer}</div>
          <div class="history-date">${item.date}</div>
        `;
        historyList.appendChild(historyItem);
      });
    }
    
    // Update summary content with new data
    function updateSummaryContent(data) {
      const container = document.querySelector('.ai-summary .ai-content');
      
      // Clear existing sections
      container.innerHTML = '';
      
      // Add new sections
      data.forEach(item => {
        const section = document.createElement('div');
        section.className = 'summary-section';
        
        const title = document.createElement('h3');
        title.className = 'section-title';
        title.textContent = item.title;
        section.appendChild(title);
        
        const text = document.createElement('p');
        text.className = 'section-text';
        text.textContent = item.content;
        section.appendChild(text);
        
        if (item.formula) {
          const formula = document.createElement('div');
          formula.className = 'formula';
          formula.textContent = item.formula;
          section.appendChild(formula);
        }
        
        if (item.conclusion) {
          const conclusion = document.createElement('p');
          conclusion.className = 'section-text';
          conclusion.textContent = item.conclusion;
          section.appendChild(conclusion);
        }
        
        container.appendChild(section);
      });
    }
    
    // Sample data for concise analysis (around 150 words)
    function getRandomConciseAnalysis() {
      const analyses = [
        "Your weekly performance shows remarkable progress with a 23% increase in problem-solving rate. You've completed 66 problems this week, placing you in the top 15% of students. Math remains your strongest subject with 85% completion, while Science needs more attention at 65%. Your critical thinking skills have improved significantly, particularly in algebraic reasoning and data analysis. Focus on strengthening geometry concepts and scientific writing to achieve more balanced results. Consider scheduling a tutoring session for these areas while maintaining your excellent progress in other subjects.",
        
        "This week's data reveals significant improvement in your problem-solving efficiency, with a 17% increase in completion speed. You've tackled 66 problems across all subjects, showing particular strength in English (92% completion) and Math (85%). Your analytical skills in literary interpretation are exceptional, though physics concepts still present challenges (65% mastery). The consistency in your daily study routine has placed you among the top performers. To maximize your progress, consider allocating more time to scientific subjects and requesting additional practice materials for wave mechanics and thermodynamics.",
        
        "Analysis of your recent performance indicates substantial growth in critical thinking skills. With 66 problems solved this week, you've demonstrated excellent progress in mathematical reasoning and literary analysis. Your strengths lie in algebraic manipulation, essay structure, and data interpretation. Areas needing improvement include geometry proofs and scientific methodology. Your consistent study pattern has yielded positive results, particularly in subjects requiring abstract thinking. To continue this upward trajectory, focus on connecting theoretical concepts with practical applications and consider joining the advanced study group for collaborative learning opportunities."
      ];
      
      return analyses[Math.floor(Math.random() * analyses.length)];
    }
    
    // Sample data for summaries
    function getRandomSummary() {
      const summaries = [
        [
          {
            title: "Quadratic Equations",
            content: "A quadratic equation is a second-degree polynomial equation of the form ax² + bx + c = 0, where a ≠ 0. The solutions to this equation are given by the quadratic formula:",
            formula: "x = (-b ± √(b² - 4ac)) / 2a",
            conclusion: "You've successfully solved 15 problems involving quadratic equations this week, showing good understanding of the discriminant and its implications for the number of solutions."
          },
          {
            title: "Literary Analysis",
            content: "In your recent essay on \"The Great Gatsby,\" you effectively analyzed the symbolism of the green light, representing Gatsby's hopes and dreams. Your tutor suggested expanding on how this symbol evolves throughout the novel to strengthen your argument."
          }
        ],
        [
          {
            title: "Calculus: Integration Techniques",
            content: "You've mastered basic integration techniques including substitution and integration by parts. Your recent work on improper integrals shows good conceptual understanding.",
            formula: "∫u dv = uv - ∫v du",
            conclusion: "Continue practicing with more complex functions, particularly those requiring multiple techniques in sequence."
          },
          {
            title: "Physics: Wave Mechanics",
            content: "Your understanding of wave interference and diffraction has improved significantly. You correctly applied the principles to solve the double-slit experiment problems.",
            formula: "d sin θ = mλ",
            conclusion: "Focus next on understanding wave-particle duality and its implications in quantum mechanics."
          }
        ],
        [
          {
            title: "Statistics: Hypothesis Testing",
            content: "You've correctly applied hypothesis testing procedures in your recent assignments. Your understanding of p-values and significance levels is solid.",
            formula: "z = (x̄ - μ) / (σ/√n)",
            conclusion: "Practice more with Type I and Type II errors to strengthen your statistical decision-making skills."
          },
          {
            title: "World History: Industrial Revolution",
            content: "Your essay on the social impacts of the Industrial Revolution showed excellent analysis of primary sources and strong argumentation. Consider exploring the economic factors in more depth."
          }
        ]
      ];
      
      return summaries[Math.floor(Math.random() * summaries.length)];
    }
    
    // Sample answers for questions
    function getRandomAnswer(question) {
      const answers = [
        "Based on your recent work, I'd recommend focusing on the underlying principles rather than memorizing formulas. Try to understand why the equations work the way they do, and practice applying them to different scenarios.",
        "Your question touches on an important concept. The key is to break down complex problems into smaller, manageable parts. Start by identifying the known variables and what you're trying to solve for, then apply the appropriate formulas step by step.",
        "That's an excellent question! The concept you're asking about connects to several areas we've studied. Remember that mathematical principles often have real-world applications - try to visualize the problem in a practical context to better understand it.",
        "Looking at your recent assignments, I notice you're making good progress in this area. To improve further, focus on the relationships between different concepts rather than treating them as isolated topics. This will help you develop a more integrated understanding.",
        "Based on your performance data, I'd suggest approaching this from a different angle. Try working through some practice problems that gradually increase in difficulty, and pay attention to patterns in how they're solved. This incremental approach often leads to better understanding."
      ];
      
      return answers[Math.floor(Math.random() * answers.length)];
    }
    
    // Event listeners for refresh buttons
    refreshAnalysisBtn.addEventListener('click', generateGroqAnalysis);
    refreshSummaryBtn.addEventListener('click', generateGroqSummary);
    
    // Event listener for ask question button
    if (askQuestionBtn) {
      askQuestionBtn.addEventListener('click', () => {
        const question = questionInput.value.trim();
        
        if (!question) {
          alert('Please enter a question');
          return;
        }
        
        askGroqQuestion(question);
      });
    }
    
    // Enter key for question input
    if (questionInput) {
      questionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !askQuestionBtn.disabled) {
          askQuestionBtn.click();
        }
      });
    }
    
    // Settings functionality
    const themeSelect = document.getElementById('theme-select');
    const fontSizeRange = document.getElementById('font-size');
    const fontSizeValue = document.getElementById('font-size-value');
    const fontFamilySelect = document.getElementById('font-family');
    const languageSelect = document.getElementById('language-select');
    const resetSettingsBtn = document.getElementById('reset-settings');
    const saveSettingsBtn = document.getElementById('save-settings');
    
    // Load saved settings
    function loadSettings() {
      // Theme
      const savedTheme = localStorage.getItem('theme') || 'light';
      if (themeSelect) themeSelect.value = savedTheme;
      document.documentElement.setAttribute('data-theme', savedTheme);
      
      // Font size
      const savedFontSize = localStorage.getItem('fontSize') || '100';
      if (fontSizeRange) fontSizeRange.value = savedFontSize;
      if (fontSizeValue) fontSizeValue.textContent = savedFontSize + '%';
      document.documentElement.style.fontSize = (parseInt(savedFontSize) / 100) * 16 + 'px';
      
      // Font family
      const savedFontFamily = localStorage.getItem('fontFamily') || 'system-ui';
      if (fontFamilySelect) fontFamilySelect.value = savedFontFamily;
      document.documentElement.setAttribute('data-font', savedFontFamily);
      
      // Language
      const savedLanguage = localStorage.getItem('language') || 'en';
      if (languageSelect) languageSelect.value = savedLanguage;
    }
    
    // Save settings
    function saveSettings() {
      // Theme
      const theme = themeSelect ? themeSelect.value : 'light';
      localStorage.setItem('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
      
      // Font size
      const fontSize = fontSizeRange ? fontSizeRange.value : '100';
      localStorage.setItem('fontSize', fontSize);
      document.documentElement.style.fontSize = (parseInt(fontSize) / 100) * 16 + 'px';
      
      // Font family
      const fontFamily = fontFamilySelect ? fontFamilySelect.value : 'system-ui';
      localStorage.setItem('fontFamily', fontFamily);
      document.documentElement.setAttribute('data-font', fontFamily);
      
      // Language
      const language = languageSelect ? languageSelect.value : 'en';
      localStorage.setItem('language', language);
      
      // Close modal
      if (settingsModalElements.modal) {
        settingsModalElements.modal.classList.remove('active');
      }
      
      // Show notification
      showNotification('Settings saved successfully!', 'success');
    }
    
    // Reset settings
    function resetSettings() {
      localStorage.removeItem('theme');
      localStorage.removeItem('fontSize');
      localStorage.removeItem('fontFamily');
      localStorage.removeItem('language');
      
      if (themeSelect) themeSelect.value = 'light';
      if (fontSizeRange) fontSizeRange.value = '100';
      if (fontSizeValue) fontSizeValue.textContent = '100%';
      if (fontFamilySelect) fontFamilySelect.value = 'system-ui';
      if (languageSelect) languageSelect.value = 'en';
      
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.style.fontSize = '16px';
      document.documentElement.removeAttribute('data-font');
      
      showNotification('Settings reset to default', 'info');
    }
    
    // Update font size value display
    if (fontSizeRange) {
      fontSizeRange.addEventListener('input', () => {
        if (fontSizeValue) fontSizeValue.textContent = fontSizeRange.value + '%';
      });
    }
    
    // Save settings button
    if (saveSettingsBtn) {
      saveSettingsBtn.addEventListener('click', saveSettings);
    }
    
    // Reset settings button
    if (resetSettingsBtn) {
      resetSettingsBtn.addEventListener('click', resetSettings);
    }
    
    // Tutor feedback form submission
    const submitFeedbackRequestBtn = document.getElementById('submit-feedback-request');
    const tutorFeedbackForm = document.getElementById('tutor-feedback-form');
    
    if (submitFeedbackRequestBtn && tutorFeedbackForm) {
      submitFeedbackRequestBtn.addEventListener('click', () => {
        // Check if form is valid
        const tutorSelect = document.getElementById('tutor-select');
        const subject = document.getElementById('subject');
        const sessionDate = document.getElementById('session-date');
        const feedbackRequest = document.getElementById('feedback-request');
        
        if (!tutorSelect.value) {
          alert('Please select a tutor');
          return;
        }
        
        if (!subject.value) {
          alert('Please enter a subject');
          return;
        }
        
        if (!sessionDate.value) {
          alert('Please select a session date');
          return;
        }
        
        if (!feedbackRequest.value) {
          alert('Please describe what you would like feedback on');
          return;
        }
        
        // Show loading state
        submitFeedbackRequestBtn.disabled = true;
        submitFeedbackRequestBtn.innerHTML = `
          <div class="spinner-small"></div>
          Submitting...
        `;
        
        // Simulate form submission
        setTimeout(() => {
          // Reset form
          tutorFeedbackForm.reset();
          
          // Reset button state
          submitFeedbackRequestBtn.disabled = false;
          submitFeedbackRequestBtn.textContent = 'Submit Request';
          
          // Close modal
          feedbackFormModalElements.modal.classList.remove('active');
          
          // Show success message
          showNotification('Feedback request submitted successfully!', 'success');
        }, 2000);
      });
    }
    
    // Notification system
    function showNotification(message, type) {
      const notification = document.createElement('div');
      notification.className = `notification ${type}`;
      notification.textContent = message;
      document.body.appendChild(notification);
      
      // Auto-remove notification after 3 seconds
      setTimeout(() => {
        notification.remove();
      }, 3000);
    }
  });