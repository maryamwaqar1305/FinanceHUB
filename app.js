
// Global application state
let currentUser = null;
let currentPage = 'dashboard';
let currentTheme = 'auto'; // Will be set by initializeTheme from localStorage
let currentCurrency = 'INR';

// Secure user accounts storage with proper password hashing simulation
const userAccounts = {
    // UPDATED default profile name and email for Maryam and demo setup
    "demo@example.com": {
        password: "Demo123!",
        profile: {
            firstName: "Maryam",
            lastName: "",
            email: "maryam.waqar198@gmail.com",
            phone: "+91 98765 43210",
            dateOfBirth: "1995-06-15",
            profilePicture: ""
        },
        transactions: [
            {"id": 1, "date": "2024-12-25", "amount": 2500, "category": "Groceries", "type": "expense", "description": "Weekly groceries", "currency": "INR"},
            {"id": 2, "date": "2024-12-24", "amount": 85000, "category": "Salary", "type": "income", "description": "Monthly salary", "currency": "INR"},
            {"id": 3, "date": "2024-12-23", "amount": 12000, "category": "Rent", "type": "expense", "description": "December Rent Payment", "currency": "INR"}
        ],
        budgets: [
            {"category": "Groceries", "allocated": 15000, "spent": 2500, "remaining": 12500, "currency": "INR"}
        ],
        goals: [
            {"id": 1, "name": "Emergency Fund", "target": 500000, "current": 85000, "deadline": "2025-12-31", "priority": "high", "type": "savings"},
            {"id": 2, "name": "New Laptop", "target": 75000, "current": 15000, "deadline": "2025-06-30", "priority": "medium", "type": "other"}
        ]
    }
};

// Application data
const appData = {
    currencies: [
        {"code": "INR", "symbol": "₹", "name": "Indian Rupee"},
        {"code": "USD", "symbol": "$", "name": "US Dollar"},
        {"code": "EUR", "symbol": "€", "name": "Euro"},
        {"code": "GBP", "symbol": "£", "name": "British Pound"}
    ],
    categories: ["Groceries", "Transportation", "Entertainment", "Food", "Shopping", "Utilities", "Healthcare", "Salary", "Investment", "Rent", "Insurance", "Education", "EMI", "Miscellaneous"],
    passwordRequirements: {
        minLength: 8,
        requireNumbers: true,
        requireSpecialChars: true,
        requireUppercase: true,
        requireLowercase: true
    },
    // NEW: Feature descriptions for the landing page buttons
    featureDescriptions: {
        security: {
            title: "Bank-Level Security",
            message: "Your financial data is protected with 256-bit encryption and multi-factor authentication, ensuring complete privacy and security."
        },
        analytics: {
            title: "Smart Analytics",
            message: "Get intelligent insights into your spending habits, cash flow, and financial health with interactive charts and personalized reports."
        },
        goals: {
            title: "Goal Tracking",
            message: "Set and track custom financial goals like saving for a down payment or a vacation, with clear progress visualization and timeline estimates."
        },
        currency: {
            title: "Multi-Currency Support",
            message: "Manage accounts and transactions seamlessly in Indian Rupees (₹) and major international currencies like USD, EUR, and GBP."
        }
    }
};

// Global function declarations for immediate availability

// NEW: Feature Info Modal functions
window.showFeatureInfo = function(featureKey) {
    console.log('showFeatureInfo called for:', featureKey);
    const modal = document.getElementById('feature-info-modal');
    const title = document.getElementById('feature-info-title');
    const message = document.getElementById('feature-info-message');
    
    const feature = appData.featureDescriptions[featureKey];
    
    if (feature && modal && title && message) {
        title.textContent = feature.title;
        message.textContent = feature.message;
        modal.classList.remove('hidden');
    }
}

window.hideFeatureInfo = function() {
    console.log('hideFeatureInfo called');
    const modal = document.getElementById('feature-info-modal');
    if (modal) modal.classList.add('hidden');
}

window.toggleFaq = function(button) {
    const item = button.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const icon = button.querySelector('i');
    const isOpen = item.classList.contains('open');

    // Close all other FAQs
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) {
            openItem.classList.remove('open');
            openItem.querySelector('.faq-answer').style.maxHeight = '0';
            openItem.querySelector('.faq-question i').style.transform = 'rotate(0deg)';
        }
    });

    if (isOpen) {
        item.classList.remove('open');
        answer.style.maxHeight = '0';
        icon.style.transform = 'rotate(0deg)';
    } else {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        icon.style.transform = 'rotate(180deg)';
    }
}

window.showLogin = function() {
    console.log('showLogin called');
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.classList.remove('hidden');
        // Focus on email input after modal opens
        setTimeout(() => {
            const emailInput = document.getElementById('login-email');
            if (emailInput) emailInput.focus();
        }, 100);
    }
}

window.hideLogin = function() {
    console.log('hideLogin called');
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.classList.add('hidden');
        clearForm('login-form');
        hideError('login-error');
    }
}

window.showRegister = function() {
    console.log('showRegister called');
    const modal = document.getElementById('register-modal');
    if (modal) {
        modal.classList.remove('hidden');
        // Focus on name input after modal opens
        setTimeout(() => {
            const nameInput = document.getElementById('register-name');
            if (nameInput) nameInput.focus();
        }, 100);
    }
}

window.hideRegister = function() {
    console.log('hideRegister called');
    const modal = document.getElementById('register-modal');
    if (modal) {
        modal.classList.add('hidden');
        clearForm('register-form');
        hideError('register-error');
        resetPasswordRequirements();
    }
}

window.showForgotPassword = function() {
    console.log('showForgotPassword called');
    hideLogin();
    const modal = document.getElementById('forgot-password-modal');
    if (modal) {
        modal.classList.remove('hidden');
        setTimeout(() => {
            const emailInput = document.getElementById('forgot-email');
            if (emailInput) emailInput.focus();
        }, 100);
    }
}

window.hideForgotPassword = function() {
    console.log('hideForgotPassword called');
    const modal = document.getElementById('forgot-password-modal');
    if (modal) {
        modal.classList.add('hidden');
        clearForm('forgot-password-form');
        hideError('forgot-error');
    }
}

window.toggleTheme = function() {
    console.log('toggleTheme called, current:', currentTheme);
    const themes = ['auto', 'light', 'dark'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    
    applyTheme(nextTheme);
    updateThemeIcons();
    showToast(`Theme switched to ${nextTheme}`, 'info');
}

window.togglePasswordVisibility = function(inputId) {
    console.log('togglePasswordVisibility called for:', inputId);
    const input = document.getElementById(inputId);
    if (!input) return;
    
    const button = input.nextElementSibling;
    if (!button) return;
    
    const icon = button.querySelector('i');
    if (!icon) return;
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

window.showMyProfile = function() {
    console.log('showMyProfile called');
    const modal = document.getElementById('profile-modal');
    if (modal && currentUser) {
        populateProfileForm();
        modal.classList.remove('hidden');
    }
}

window.hideMyProfile = function() {
    console.log('hideMyProfile called');
    const modal = document.getElementById('profile-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

window.showChangePassword = function() {
    console.log('showChangePassword called');
    hideMyProfile();
    const modal = document.getElementById('change-password-modal');
    if (modal) {
        modal.classList.remove('hidden');
        clearForm('change-password-form');
        setTimeout(() => {
            const oldPasswordInput = document.getElementById('old-password');
            if (oldPasswordInput) oldPasswordInput.focus();
        }, 100);
    }
}

window.hideChangePassword = function() {
    console.log('hideChangePassword called');
    const modal = document.getElementById('change-password-modal');
    if (modal) {
        modal.classList.add('hidden');
        clearForm('change-password-form');
        hideError('password-change-error');
    }
}

window.triggerProfilePictureUpload = function() {
    console.log('triggerProfilePictureUpload called');
    const input = document.getElementById('profile-picture-input');
    if (input) input.click();
}

window.initiateLogout = function() {
    console.log('initiateLogout called');
    const modal = document.getElementById('logout-confirm-modal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

window.hideLogoutConfirm = function() {
    console.log('hideLogoutConfirm called');
    const modal = document.getElementById('logout-confirm-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

window.confirmLogout = function() {
    console.log('confirmLogout called');
    hideLogoutConfirm();
    showLoading('Logging out...');
    
    setTimeout(() => {
        performLogout();
        hideLoading();
        showToast('Logged Out Successfully', 'info');
    }, 1000);
}

window.showTransactionModal = function(transactionId = null) {
    console.log('showTransactionModal called with ID:', transactionId);
    const modal = document.getElementById('transaction-modal');
    const form = document.getElementById('transaction-form');
    const title = document.getElementById('transaction-modal-title');
    
    populateTransactionCategories();
    
    if (transactionId !== null) {
        const transaction = getUserTransactions().find(t => t.id === transactionId);
        if (transaction) {
            if (title) title.textContent = 'Edit Transaction';
            populateTransactionForm(transaction);
            if (form) form.dataset.transactionId = transactionId;
        } else {
             showToast('Transaction not found.', 'error');
             return;
        }
    } else {
        if (title) title.textContent = 'Add Transaction';
        if (form) {
            form.reset();
            delete form.dataset.transactionId;
        }
        const dateInput = document.getElementById('transaction-date');
        if (dateInput) {
            // Set default date to today
            dateInput.valueAsDate = new Date();
        }
    }
    
    if (modal) modal.classList.remove('hidden');
}

window.hideTransactionModal = function() {
    console.log('hideTransactionModal called');
    const modal = document.getElementById('transaction-modal');
    if (modal) {
        modal.classList.add('hidden');
        clearForm('transaction-form');
    }
}

window.showGoalModal = function(goalId = null) {
    console.log('showGoalModal called with ID:', goalId);
    const modal = document.getElementById('goal-modal');
    const form = document.getElementById('goal-form');
    const title = document.getElementById('goal-modal-title');
    
    if (goalId !== null) {
        const goal = getUserGoals().find(g => g.id === goalId);
        if (goal) {
            if (title) title.textContent = 'Edit Goal';
            populateGoalForm(goal);
            if (form) form.dataset.goalId = goalId;
        } else {
            showToast('Goal not found.', 'error');
            return;
        }
    } else {
        if (title) title.textContent = 'Add Goal';
        if (form) {
            form.reset();
            delete form.dataset.goalId;
        }
        const currentInput = document.getElementById('goal-current');
        if (currentInput) currentInput.value = 0;
    }
    
    if (modal) modal.classList.remove('hidden');
}

window.hideGoalModal = function() {
    console.log('hideGoalModal called');
    const modal = document.getElementById('goal-modal');
    if (modal) {
        modal.classList.add('hidden');
        clearForm('goal-form');
    }
}

window.showBudgetModal = function() {
    console.log('showBudgetModal called');
    showToast('Budget creation feature will be available soon!', 'info');
}

window.navigateTo = function(page) {
    console.log('navigateTo called with page:', page);
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === page) {
            item.classList.add('active');
        }
    });

    document.querySelectorAll('.bottom-nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === page) {
            item.classList.add('active');
        }
    });

    document.querySelectorAll('.page-content').forEach(pageEl => {
        pageEl.classList.add('hidden');
    });

    const targetPage = document.getElementById(page + '-page');
    if (targetPage) {
        targetPage.classList.remove('hidden');
    }
    
    const titles = {
        dashboard: 'Dashboard',
        transactions: 'Transactions',
        budgets: 'Budgets',
        investments: 'Investments',
        goals: 'Goals',
        insights: 'AI Insights',
        settings: 'Settings'
    };
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
        pageTitle.textContent = titles[page] || 'Dashboard';
    }

    currentPage = page;

    switch(page) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'transactions':
            loadTransactions();
            break;
        case 'budgets':
            loadBudgets();
            break;
        case 'investments':
            loadInvestments();
            break;
        case 'goals':
            loadGoals();
            break;
        case 'insights':
            loadInsights();
            break;
        case 'settings':
            loadSettings();
            break;
    }
}

window.editTransaction = function(id) {
    console.log('editTransaction called with ID:', id);
    // Convert id to number as it is stored as number in data
    showTransactionModal(parseInt(id)); 
}

window.deleteTransaction = function(id) {
    console.log('deleteTransaction called with ID:', id);
    if (confirm('Are you sure you want to delete this transaction?')) {
        const userData = getUserData();
        userData.transactions = userData.transactions.filter(t => t.id !== parseInt(id));
        saveUserData(userData);
        
        showToast('Transaction deleted successfully', 'success');
        
        // Refresh the current page view
        if (currentPage === 'transactions') {
            loadTransactions();
        }
        if (currentPage === 'dashboard') {
            loadDashboard();
        }
    }
}

window.editGoal = function(id) {
    console.log('editGoal called with ID:', id);
    // Convert id to number as it is stored as number in data
    showGoalModal(parseInt(id)); 
}

window.deleteGoal = function(id) {
    console.log('deleteGoal called with ID:', id);
    if (confirm('Are you sure you want to delete this goal?')) {
        const userData = getUserData();
        userData.goals = userData.goals.filter(g => g.id !== parseInt(id));
        saveUserData(userData);
        
        showToast('Goal deleted successfully', 'success');
        
        // Refresh the current page view
        if (currentPage === 'goals') {
            loadGoals();
        }
    }
}

window.toggleMobileMenu = function() {
    console.log('toggleMobileMenu called');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobile-overlay');
    
    if (sidebar) sidebar.classList.toggle('sidebar--open');
    if (overlay) overlay.classList.toggle('hidden');

    document.body.style.overflow = (sidebar && sidebar.classList.contains('sidebar--open')) ? 'hidden' : '';
}

window.savePreferences = function() {
    console.log('savePreferences called');
    const currencySelect = document.getElementById('currency-select');
    const themeSelect = document.getElementById('theme-select');
    
    if (currencySelect) {
        currentCurrency = currencySelect.value;
        localStorage.setItem('financeapp_currency', currentCurrency);
        // Recalculate and redisplay relevant data immediately
        calculateAndDisplayStats();
        loadRecentTransactions();
        if (currentPage === 'transactions') loadTransactions();
        if (currentPage === 'goals') loadGoals();
    }
    
    if (themeSelect) {
        applyTheme(themeSelect.value);
        updateThemeIcons();
    }
    
    showSuccess('Preferences Saved Successfully', 'Your preferences have been updated and saved.');
}

window.exportData = function() {
    console.log('exportData called');
    if (!currentUser) return;
    
    const userData = getUserData();
    const exportData = {
        profile: userData.profile,
        transactions: userData.transactions,
        budgets: userData.budgets,
        goals: userData.goals,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `financeapp_data_${currentUser.email.replace('@', '_at_')}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showToast('Data exported successfully', 'success');
}

window.importCSV = function(event) {
    const file = event.target.files[0];
    if (!file || !currentUser) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const lines = text.split('\\n');
        
        let importedCount = 0;
        const userData = getUserData();
        
        // Skip header line (assumed Date, Amount, Category, Type, Description)
        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const cols = lines[i].split(',');
            if (cols.length >= 4) {
                const date = cols[0].trim();
                const amount = parseFloat(cols[1].trim());
                const category = cols[2].trim();
                const type = cols[3].trim().toLowerCase() === 'income' ? 'income' : 'expense';
                const description = cols[4] ? cols[4].trim() : '';

                if (date && !isNaN(amount) && category) {
                    const newTransaction = {
                        id: Date.now() + i, // Unique ID
                        date: date,
                        amount: amount,
                        category: category,
                        type: type,
                        description: description,
                        currency: currentCurrency
                    };
                    userData.transactions.push(newTransaction);
                    importedCount++;
                }
            }
        }
        
        if (importedCount > 0) {
            saveUserData(userData);
            if (currentPage === 'transactions') loadTransactions();
            loadRecentTransactions();
            calculateAndDisplayStats();
            showSuccess('Import Successful', `Imported ${importedCount} transactions from your bank statement.`);
        } else {
            showToast('No valid transactions found in CSV.', 'error');
        }
        
        // Reset file input
        event.target.value = '';
    };
    reader.readAsText(file);
}

window.exportDataToPDF = function() {
    console.log('exportDataToPDF called');
    if (!currentUser) return;
    
    if (typeof window.jspdf === 'undefined') {
        showToast('PDF generator is loading... Please try again in a moment.', 'info');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const userData = getUserData();
    
    doc.setFontSize(18);
    doc.text('FinanceHub - Transaction Report', 14, 22);
    
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`User: ${currentUser.profile.firstName} ${currentUser.profile.lastName}`, 14, 36);

    const tableCols = [['Date', 'Description', 'Category', 'Type', `Amount (${currentCurrency})`]];
    const tableRows = userData.transactions.sort((a,b) => new Date(b.date) - new Date(a.date)).map(t => [
        t.date,
        t.description || '-',
        t.category,
        t.type,
        t.amount.toString()
    ]);

    doc.autoTable({
        startY: 42,
        head: tableCols,
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [52, 152, 219] }
    });

    const exportFileName = `FinanceHub_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(exportFileName);
    showToast('PDF Exported successfully', 'success');
}

window.toggleRecurringOptions = function() {
    const isRecurring = document.getElementById('transaction-recurring').checked;
    const options = document.getElementById('recurring-options');
    if (isRecurring) {
        options.classList.remove('hidden');
    } else {
        options.classList.add('hidden');
    }
}

window.processRecurringTransactions = function() {
    if (!currentUser) return;
    const userData = getUserData();
    let updated = false;
    const todayStr = new Date().toISOString().split('T')[0];
    const today = new Date(todayStr);

    userData.transactions.forEach(t => {
        if (t.isRecurring && t.frequency) {
            let lastProcessed = new Date(t.lastProcessedDate || t.date);
            while(true) {
                let nextDate = new Date(lastProcessed);
                if (t.frequency === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
                else if (t.frequency === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);
                else if (t.frequency === 'yearly') nextDate.setFullYear(nextDate.getFullYear() + 1);
                
                if (nextDate <= today) {
                    const nextDateStr = nextDate.toISOString().split('T')[0];
                    userData.transactions.push({
                        ...t,
                        id: Date.now() + Math.floor(Math.random() * 1000),
                        date: nextDateStr,
                        isRecurring: false,
                        frequency: null,
                        lastProcessedDate: null
                    });
                    lastProcessed = nextDate;
                    t.lastProcessedDate = nextDateStr;
                    updated = true;
                } else {
                    break;
                }
            }
        }
    });

    if (updated) {
        saveUserData(userData);
    }
}

window.hideSuccessModal = function() {
    console.log('hideSuccessModal called');
    const modal = document.getElementById('success-modal');
    if (modal) modal.classList.add('hidden');
}

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing app');
    initializeTheme();
    initializeApp();
    setupEventListeners();
    initScrollReveal();
    initTiltCards();
    initHeroDepth();
    initCountUp();
});

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('financeapp_theme') || 'auto';
    currentTheme = savedTheme;
    applyTheme(currentTheme);
    updateThemeIcons();
}

function applyTheme(theme) {
    console.log('Applying theme:', theme);
    const root = document.documentElement;
    
    // Remove existing theme attributes
    root.removeAttribute('data-color-scheme');
    
    if (theme === 'light') {
        root.setAttribute('data-color-scheme', 'light');
    } else if (theme === 'dark') {
        root.setAttribute('data-color-scheme', 'dark');
    }
    // 'auto' uses system preference (no attribute set)
    
    currentTheme = theme;
    localStorage.setItem('financeapp_theme', theme);
}

function updateThemeIcons() {
    const themeIcons = document.querySelectorAll('#theme-icon, #theme-icon-header');
    let iconClass = 'fas fa-adjust'; // Default for auto
    
    if (currentTheme === 'light') {
        iconClass = 'fas fa-moon';
    } else if (currentTheme === 'dark') {
        iconClass = 'fas fa-sun';
    }
    
    themeIcons.forEach(icon => {
        if (icon) icon.className = iconClass;
    });
}

function initializeApp() {
    console.log('Initializing application');
    updateGreeting();
    const savedUser = localStorage.getItem('financeapp_current_user');
    if (savedUser) {
        try {
            const sessionUser = JSON.parse(savedUser);
            const email = sessionUser.email || "demo@example.com";

            currentUser = {
                email: email,
                profile: sessionUser.profile || (userAccounts[email] && userAccounts[email].profile) || { firstName: "User", lastName: "", email: email }
            };

            if (sessionUser._id) {
                currentUser._id = sessionUser._id;
            }

            console.log('Valid user session found, showing main app');
            const savedCurrency = localStorage.getItem('financeapp_currency') || 'INR';
            currentCurrency = savedCurrency;

            showMainApp();
            refreshUserCache().catch(() => {});
            renderSpendingHeatmap();
            renderDashboardGoals();
            renderBudgetSummary();
            updateAIInsightWidget();
            return;
        } catch (e) {
            console.error('Invalid user session data', e);
            localStorage.removeItem('financeapp_current_user');
        }
    }

    console.log('No valid session, showing landing page');
    showLandingPage();

    const savedCurrency = localStorage.getItem('financeapp_currency') || 'INR';
    currentCurrency = savedCurrency;
}

function isValidUser(user) {
    return user && user.email && userAccounts[user.email];
}

function setupEventListeners() {
    console.log('Setting up event listeners');
    
    document.querySelectorAll('.menu-item[data-page]').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const page = this.dataset.page;
            console.log('Menu item clicked:', page);
            navigateTo(page);
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('mobile-overlay');
            if (window.innerWidth <= 768 && sidebar && sidebar.classList.contains('sidebar--open')) {
                sidebar.classList.remove('sidebar--open');
                if (overlay) overlay.classList.add('hidden');
                document.body.style.overflow = '';
            }
        });
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    document.querySelectorAll('.bottom-nav-item[data-page]').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const page = this.dataset.page;
            navigateTo(page);
        });
    });

    const menuToggle = document.querySelector('.sidebar-menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            window.toggleMobileMenu();
        });
    }

    const overlay = document.getElementById('mobile-overlay');
    if (overlay) {
        overlay.addEventListener('click', function() {
            window.toggleMobileMenu();
        });
    }
    
    setupFormListeners();
    
    const profilePictureInput = document.getElementById('profile-picture-input');
    if (profilePictureInput) {
        profilePictureInput.addEventListener('change', handleProfilePictureUpload);
    }

    const registerPassword = document.getElementById('register-password');
    if (registerPassword) {
        registerPassword.addEventListener('input', checkPasswordStrength);
    }

    document.querySelectorAll('.modal-content').forEach(content => {
        content.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });

    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (currentTheme === 'auto') {
                updateThemeIcons();
            }
        });
    }
}

function setupFormListeners() {
    console.log('Setting up form listeners');
    
    // Authentication forms
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const profileForm = document.getElementById('profile-form');
    const changePasswordForm = document.getElementById('change-password-form');
    const transactionForm = document.getElementById('transaction-form');
    const goalForm = document.getElementById('goal-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('Login form listener added');
    }
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
        console.log('Register form listener added');
    }
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', handleForgotPassword);
        console.log('Forgot password form listener added');
    }
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
        console.log('Profile form listener added');
    }
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', handlePasswordChange);
        console.log('Change password form listener added');
    }
    if (transactionForm) {
        transactionForm.addEventListener('submit', handleTransactionSubmit);
        console.log('Transaction form listener added');
    }
    if (goalForm) {
        goalForm.addEventListener('submit', handleGoalSubmit);
        console.log('Goal form listener added');
    }
    const holdingForm = document.getElementById('holding-form');
    if (holdingForm) {
        holdingForm.addEventListener('submit', handleAddHoldingSubmit);
        console.log('Holding form listener added');
    }

    // Filter listeners
    const transactionFilter = document.getElementById('transaction-filter');
    if (transactionFilter) {
        transactionFilter.addEventListener('change', filterTransactions);
    }

    // Global search
    const globalSearch = document.getElementById('global-search');
    if (globalSearch) {
        globalSearch.addEventListener('input', debounce(function() {
            const query = this.value.trim().toLowerCase();
            if (currentPage !== 'transactions') navigateTo('transactions');
            displayTransactions(query);
        }, 300));
    }
}

// Authentication Functions
async function handleLogin(e) {
    e.preventDefault();
    hideError('login-error');

    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;

    if (!email || !password) { showError('login-error', 'Please enter both email and password.'); return; }
    if (!isValidEmail(email)) { showError('login-error', 'Please enter a valid email address.'); return; }

    showLoading('Authenticating...');
    try {
        const data = await window.FinanceAPI.Auth.login(email, password);
        localStorage.setItem('financehub_token', data.token);
        currentUser = { email: data.user.email, profile: data.user.profile, _id: data.user._id };
        localStorage.setItem('financeapp_current_user', JSON.stringify(currentUser));
        await refreshUserCache();
        hideLoading();
        hideLogin();
        showMainApp();
        showToast(`Welcome back, ${currentUser.profile.firstName}!`, 'success');
    } catch (err) {
        hideLoading();
        showError('login-error', err.message || 'Invalid email or password.');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    hideError('register-error');

    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim().toLowerCase();
    const phone = document.getElementById('register-phone').value.trim();
    const password = document.getElementById('register-password').value;

    if (!name || !email || !phone || !password) { showError('register-error', 'Please fill in all required fields.'); return; }
    if (!isValidEmail(email)) { showError('register-error', 'Please enter a valid email address.'); return; }
    if (!isValidPassword(password)) { showError('register-error', 'Password does not meet the required criteria.'); return; }

    showLoading('Creating your secure account...');
    try {
        const data = await window.FinanceAPI.Auth.register(name, email, phone, password);
        localStorage.setItem('financehub_token', data.token);
        currentUser = { email: data.user.email, profile: data.user.profile };
        localStorage.setItem('financeapp_current_user', JSON.stringify(currentUser));
        await refreshUserCache();
        hideLoading();
        hideRegister();
        showMainApp();
        showSuccess('Account Created Successfully!', 'Welcome to FinanceHub! Your secure account has been created.');
    } catch (err) {
        hideLoading();
        showError('register-error', err.message || 'Registration failed. Please try again.');
    }
}

function handleForgotPassword(e) {
    e.preventDefault();
    console.log('handleForgotPassword called');
    hideError('forgot-error');
    
    const email = document.getElementById('forgot-email').value.trim().toLowerCase();
    
    if (!email) {
        showError('forgot-error', 'Please enter your email address.');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError('forgot-error', 'Please enter a valid email address.');
        return;
    }
    
    showLoading('Sending password reset link...');
    
    // Simulate email sending delay
    setTimeout(() => {
        const userAccount = userAccounts[email];
        
        hideLoading();
        
        if (userAccount) {
            hideForgotPassword();
            showSuccess('Password Reset Link Sent!', `A password reset link has been sent to ${email}. Please check your email and follow the instructions to reset your password.`);
        } else {
            showError('forgot-error', 'No account found with this email address. Please check your email or create a new account.');
        }
    }, 1500);
}

function handleProfileUpdate(e) {
    e.preventDefault();
    console.log('handleProfileUpdate called');
    
    if (!currentUser) return;
    
    const firstName = document.getElementById('profile-first-name').value.trim();
    const lastName = document.getElementById('profile-last-name').value.trim();
    const phone = document.getElementById('profile-phone').value.trim();
    const dateOfBirth = document.getElementById('profile-dob').value;
    const currentPassword = document.getElementById('current-password').value;
    
    // Validate required fields (First Name and Current Password are required)
    if (!firstName) {
        showToast('First Name is required.', 'error');
        return;
    }
    if (!currentPassword) {
        showToast('Please enter your Current Password to save changes.', 'error');
        return;
    }
    
    // Verify current password
    const userAccount = userAccounts[currentUser.email];
    if (userAccount.password !== currentPassword) {
        showToast('Current password is incorrect.', 'error');
        return;
    }
    
    showLoading('Updating profile...');
    
    setTimeout(() => {
        // Update profile data
        userAccount.profile.firstName = firstName;
        userAccount.profile.lastName = lastName;
        userAccount.profile.phone = phone;
        userAccount.profile.dateOfBirth = dateOfBirth;
        
        // Update current user session
        currentUser.profile = userAccount.profile;
        localStorage.setItem('financeapp_current_user', JSON.stringify(currentUser));
        
        // Update UI
        updateUserInterface();
        
        hideLoading();
        hideMyProfile();
        showSuccess('Profile Updated Successfully!', 'Your profile information has been saved and updated.');
    }, 1000);
}

function handlePasswordChange(e) {
    e.preventDefault();
    console.log('handlePasswordChange called');
    hideError('password-change-error');
    
    if (!currentUser) return;
    
    const oldPassword = document.getElementById('old-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-new-password').value;
    
    // Validate inputs
    if (!oldPassword || !newPassword || !confirmPassword) {
        showError('password-change-error', 'Please fill in all password fields.');
        return;
    }
    
    const userAccount = userAccounts[currentUser.email];
    if (userAccount.password !== oldPassword) {
        showError('password-change-error', 'Current password is incorrect.');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showError('password-change-error', 'New passwords do not match.');
        return;
    }
    
    if (!isValidPassword(newPassword)) {
        showError('password-change-error', 'New password does not meet the required criteria.');
        return;
    }
    
    if (oldPassword === newPassword) {
        showError('password-change-error', 'New password must be different from current password.');
        return;
    }
    
    showLoading('Updating password...');
    
    setTimeout(() => {
        // Update password
        userAccount.password = newPassword;
        
        hideLoading();
        hideChangePassword();
        showSuccess('Password Changed Successfully!', 'Your password has been updated. Please use your new password for future logins.');
    }, 1500);
}

async function handleTransactionSubmit(e) {
    e.preventDefault();

    if (!currentUser) return;

    const form = e.target;
    const transactionId = form.dataset.transactionId || null;

    const transactionData = {
        type: document.getElementById('transaction-type').value,
        amount: parseFloat(document.getElementById('transaction-amount').value),
        category: document.getElementById('transaction-category').value,
        description: document.getElementById('transaction-description').value.trim(),
        date: document.getElementById('transaction-date').value,
        currency: currentCurrency,
        isRecurring: document.getElementById('transaction-recurring')?.checked || false,
        frequency: document.getElementById('transaction-frequency').value,
        lastProcessedDate: document.getElementById('transaction-date').value
    };

    if (isNaN(transactionData.amount) || transactionData.amount <= 0) { showToast('Please enter a valid amount greater than 0.', 'error'); return; }
    if (!transactionData.description) { showToast('Please enter a transaction description.', 'error'); return; }

    try {
        if (transactionId) {
            await window.FinanceAPI.Transactions.update(transactionId, transactionData);
            showToast('Transaction updated successfully', 'success');
        } else {
            await window.FinanceAPI.Transactions.create(transactionData);
            showToast('Transaction added successfully', 'success');
        }
        await refreshUserCache();
        hideTransactionModal();
        if (currentPage === 'transactions') loadTransactions();
        if (currentPage === 'dashboard') loadDashboard();
    } catch (err) {
        showToast(err.message || 'Failed to save transaction.', 'error');
    }
}

async function handleGoalSubmit(e) {
    e.preventDefault();

    if (!currentUser) return;

    const form = e.target;
    const goalId = form.dataset.goalId || null;

    const goalData = {
        name: document.getElementById('goal-name').value.trim(),
        target: parseFloat(document.getElementById('goal-target').value),
        current: parseFloat(document.getElementById('goal-current').value) || 0,
        type: document.getElementById('goal-type').value,
        deadline: document.getElementById('goal-deadline').value,
        priority: 'medium',
        currency: currentCurrency
    };

    if (!goalData.name) { showToast('Please enter a goal name.', 'error'); return; }
    if (isNaN(goalData.target) || goalData.target <= 0) { showToast('Please enter a valid target amount.', 'error'); return; }
    if (goalData.current > goalData.target) { showToast('Current amount cannot exceed target.', 'error'); return; }

    try {
        if (goalId) {
            await window.FinanceAPI.Goals.update(goalId, goalData);
            showToast('Goal updated successfully', 'success');
        } else {
            await window.FinanceAPI.Goals.create(goalData);
            showToast('Goal added successfully', 'success');
        }
        await refreshUserCache();
        hideGoalModal();
        if (currentPage === 'goals') loadGoals();
    } catch (err) {
        showToast(err.message || 'Failed to save goal.', 'error');
    }
}

// Validation Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPassword(password) {
    const requirements = appData.passwordRequirements;
    
    if (password.length < requirements.minLength) return false;
    if (requirements.requireNumbers && !/\d/.test(password)) return false;
    if (requirements.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
    if (requirements.requireUppercase && !/[A-Z]/.test(password)) return false;
    if (requirements.requireLowercase && !/[a-z]/.test(password)) return false;
    
    return true;
}

// function isValidPhone(phone) {
//     // Simple phone validation - can be enhanced
//     const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
//     return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
// }

function checkPasswordStrength() {
    const password = document.getElementById('register-password').value;
    const requirements = [
        { id: 'req-length', test: password.length >= 8 },
        { id: 'req-uppercase', test: /[A-Z]/.test(password) },
        { id: 'req-lowercase', test: /[a-z]/.test(password) },
        { id: 'req-number', test: /\d/.test(password) },
        { id: 'req-special', test: /[!@#$%^&*(),.?":{}|<>]/.test(password) }
    ];
    
    requirements.forEach(req => {
        const element = document.getElementById(req.id);
        if (element) {
            const icon = element.querySelector('i');
            if (req.test) {
                element.classList.add('valid');
                if (icon) icon.className = 'fas fa-check';
            } else {
                element.classList.remove('valid');
                if (icon) icon.className = 'fas fa-times';
            }
        }
    });
}

function resetPasswordRequirements() {
    const requirements = ['req-length', 'req-uppercase', 'req-lowercase', 'req-number', 'req-special'];
    requirements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.classList.remove('valid');
            const icon = element.querySelector('i');
            if (icon) icon.className = 'fas fa-times';
        }
    });
}

// ─── In-Memory Cache for synchronous helpers ─────────────────────────────────
let userCache = { transactions: [], goals: [], holdings: [] };

async function refreshUserCache() {
    if (!window.FinanceAPI || !localStorage.getItem('financehub_token')) return;
    try {
        const [transactions, goals, holdings] = await Promise.all([
            window.FinanceAPI.Transactions.getAll(),
            window.FinanceAPI.Goals.getAll(),
            window.FinanceAPI.Holdings.getAll()
        ]);
        userCache = { transactions, goals, holdings };
    } catch (err) {
        console.warn('Cache refresh failed:', err.message);
    }
}

// Keep getUserData for legacy callers; returns cache
function getUserData() {
    return { transactions: userCache.transactions, goals: userCache.goals, holdings: userCache.holdings, profile: currentUser?.profile || {} };
}

function saveUserData() {
    // No-op – data persisted via API calls; cache refreshed after each mutation
}

function getUserTransactions() {
    return userCache.transactions || [];
}

function getUserBudgets() {
    return [];
}

function getUserGoals() {
    return userCache.goals || [];
}

// Navigation Functions
function showLandingPage() {
    console.log('Showing landing page');
    const landingPage = document.getElementById('landing-page');
    const mainApp = document.getElementById('main-app');
    
    if (landingPage) landingPage.classList.remove('hidden');
    if (mainApp) mainApp.classList.add('hidden');
}

function showMainApp() {
    console.log('Showing main app');
    const landingPage = document.getElementById('landing-page');
    const mainApp = document.getElementById('main-app');

    if (landingPage) landingPage.classList.add('hidden');
    if (mainApp) mainApp.classList.remove('hidden');

    // Fetch latest data from API then render
    refreshUserCache().then(() => {
        updateUserInterface();
        navigateTo('dashboard');
    });
}

function updateUserInterface() {
    console.log('Updating user interface');
    if (!currentUser) return;
    
    const profile = currentUser.profile;
    const fullName = `${profile.firstName} ${profile.lastName}`.trim();
    
    // Update user info throughout the app
    const elements = {
        'user-name': profile.firstName || 'User', // Use first name in header
        'sidebar-user-name': fullName || 'Demo User',
        'sidebar-user-email': profile.email
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });
    
    // Update profile pictures if available
    updateProfilePictures();
}

function updateProfilePictures() {
    if (!currentUser) return;

    const profilePictureUrl = currentUser.profile.profilePicture;
    const avatars = document.querySelectorAll('#profile-avatar, #header-avatar, #profile-picture-display');
    
    avatars.forEach(avatar => {
        if (avatar) {
            if (profilePictureUrl) {
                // If there is an image, display it
                // The CSS (object-fit: cover) handles the "zooming" issue.
                avatar.innerHTML = `<img src="${profilePictureUrl}" alt="Profile">`;
            } else {
                // Otherwise, display the default icon
                avatar.innerHTML = `<i class="fas fa-user"></i>`;
            }
        }
    });
}

function performLogout() {
    console.log('Performing logout');
    localStorage.removeItem('financeapp_current_user');
    localStorage.removeItem('financehub_token');
    currentUser = null;
    userCache = { transactions: [], goals: [], holdings: [] };

    const chartIds = ['spending-chart', 'trend-chart', 'portfolio-chart'];
    chartIds.forEach(id => {
        const chartInstance = Chart.getChart(id);
        if (chartInstance) chartInstance.destroy();
    });

    showLandingPage();
}

// Page Loading Functions
function loadDashboard() {
    console.log('Loading dashboard');
    const transactions = getUserTransactions();
    const hasData = transactions.length > 0;
    
    const welcomeMessage = document.getElementById('welcome-message');
    
    if (welcomeMessage) {
        if (!hasData) {
            welcomeMessage.classList.remove('hidden');
        } else {
            welcomeMessage.classList.add('hidden');
        }
    }
    
    updateGreeting();
    calculateAndDisplayStats();
    loadRecentTransactions();
    createCharts();
    renderSpendingHeatmap();
    renderDashboardGoals();
    renderBudgetSummary();
    updateAIInsightWidget();
}

function calculateAndDisplayStats() {
    const transactions = getUserTransactions();

    // Apply date range filter if set
    const dateFrom = document.getElementById('dashboard-date-from')?.value;
    const dateTo = document.getElementById('dashboard-date-to')?.value;
    let filtered = transactions;
    if (dateFrom) filtered = filtered.filter(t => t.date >= dateFrom);
    if (dateTo) filtered = filtered.filter(t => t.date <= dateTo);
    
    const totalIncome = filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const netSavings = totalIncome - totalExpenses;
    const investmentValue = 0; // Placeholder for investments

    // Calculate overall goals progress
    const goals = getUserGoals();
    let goalsProgress = 0;
    if (goals.length > 0) {
        const totalGoalTarget = goals.reduce((sum, g) => sum + g.target, 0);
        const totalGoalCurrent = goals.reduce((sum, g) => sum + g.current, 0);
        goalsProgress = totalGoalTarget > 0 ? Math.round((totalGoalCurrent / totalGoalTarget) * 100) : 0;
    }
    
    // Update stats display
    updateElementText('total-income', formatCurrency(totalIncome));
    updateElementText('total-expenses', formatCurrency(totalExpenses));
    updateElementText('net-savings', formatCurrency(netSavings));
    updateElementText('investment-value', formatCurrency(investmentValue));
    updateElementText('goals-progress', goalsProgress + '%');
}

function loadRecentTransactions() {
    const transactions = getUserTransactions()
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
        
    const container = document.getElementById('recent-transactions-list');
    
    if (!container) return;
    
    if (transactions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-receipt"></i>
                <p>No transactions yet</p>
                <button class="btn btn--primary btn--sm" onclick="showTransactionModal()">Add Transaction</button>
            </div>
        `;
        return;
    }
    
    renderRecentTransactionsCompact(transactions, container);
}

function renderRecentTransactionsCompact(transactions, container) {
    if (!container) return;

    const categoryConfig = {
        'Groceries': { color: '#2dd4bf', bg: 'rgba(45,212,191,0.12)', icon: 'fa-shopping-cart' },
        'Food': { color: '#2dd4bf', bg: 'rgba(45,212,191,0.12)', icon: 'fa-utensils' },
        'Transportation': { color: '#38bdf8', bg: 'rgba(56,189,248,0.12)', icon: 'fa-car' },
        'Travel': { color: '#38bdf8', bg: 'rgba(56,189,248,0.12)', icon: 'fa-plane' },
        'Shopping': { color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', icon: 'fa-bag-shopping' },
        'Utilities': { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', icon: 'fa-bolt' },
        'Bills': { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', icon: 'fa-file-invoice-dollar' },
        'Rent': { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', icon: 'fa-house' },
        'Entertainment': { color: '#f43f5e', bg: 'rgba(244,63,94,0.12)', icon: 'fa-film' },
        'Health': { color: '#22c55e', bg: 'rgba(34,197,94,0.12)', icon: 'fa-heart-pulse' },
        'Healthcare': { color: '#22c55e', bg: 'rgba(34,197,94,0.12)', icon: 'fa-heart-pulse' },
        'Salary': { color: '#22c55e', bg: 'rgba(34,197,94,0.12)', icon: 'fa-wallet' },
        'Investment': { color: '#38bdf8', bg: 'rgba(56,189,248,0.12)', icon: 'fa-chart-line' },
        'Insurance': { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', icon: 'fa-shield-halved' },
        'Education': { color: '#38bdf8', bg: 'rgba(56,189,248,0.12)', icon: 'fa-graduation-cap' },
        'EMI': { color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', icon: 'fa-credit-card' },
        'Miscellaneous': { color: '#94a3b8', bg: 'rgba(148,163,184,0.12)', icon: 'fa-ellipsis' }
    };

    const defaultConfig = { color: '#94a3b8', bg: 'rgba(148,163,184,0.12)', icon: 'fa-receipt' };

    container.innerHTML = transactions.map(t => {
        const cfg = categoryConfig[t.category] || defaultConfig;
        const prefix = t.type === 'income' ? '+' : '-';
        const amountClass = t.type === 'income' ? 'income' : 'expense';
        const amountColor = t.type === 'income' ? '#22c55e' : '#f43f5e';
        return `
            <div class="transaction-item--compact">
                <div class="transaction-icon-sm" style="background: ${cfg.bg}; color: ${cfg.color};">
                    <i class="fas ${cfg.icon}"></i>
                </div>
                <div class="transaction-details-sm">
                    <div class="transaction-desc-sm">${t.description}</div>
                    <div class="transaction-category-sm">${t.category} &middot; ${formatDate(t.date)}</div>
                </div>
                <div class="transaction-amount-sm ${amountClass}" style="color: ${amountColor};">
                    ${prefix}${formatCurrency(Math.abs(t.amount))}
                </div>
            </div>
        `;
    }).join('');
}

function renderSpendingHeatmap() {
    const container = document.getElementById('spending-heatmap');
    if (!container) return;

    const levels = ['empty', 'low', 'low', 'med', 'med', 'high', 'max'];
    let cells = '';
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 7; col++) {
            const level = levels[Math.floor(Math.random() * levels.length)];
            cells += `<div class="heatmap-cell heatmap-cell--${level}"></div>`;
        }
    }
    container.innerHTML = cells;
}

function renderDashboardGoals() {
    const container = document.getElementById('goals-progress-list');
    if (!container) return;

    const goals = getUserGoals();

    if (goals.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No goals set yet</p></div>';
        return;
    }

    container.innerHTML = goals.map(goal => {
        const pct = Math.min(Math.round((goal.current / goal.target) * 100), 100);
        return `
            <div class="goal-progress-item">
                <div class="goal-progress-header">
                    <span class="goal-progress-name">${goal.name}</span>
                    <span class="goal-progress-pct">${pct}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${pct}%"></div>
                </div>
                <div class="goal-progress-meta">
                    <span>${formatCurrency(goal.current)} / ${formatCurrency(goal.target)}</span>
                    <span>${formatDate(goal.deadline)}</span>
                </div>
            </div>
        `;
    }).join('');
}

function renderBudgetSummary() {
    const container = document.getElementById('budget-summary-list');
    if (!container) return;

    const budgets = getUserBudgets();

    if (budgets.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No budgets created yet</p></div>';
        return;
    }

    container.innerHTML = budgets.map(budget => {
        const pct = budget.allocated > 0 ? Math.min(Math.round((budget.spent / budget.allocated) * 100), 100) : 0;
        const barColor = pct >= 90 ? '#f43f5e' : pct >= 70 ? '#fbbf24' : '#2dd4bf';
        return `
            <div class="budget-summary-item">
                <div class="budget-summary-header">
                    <span class="budget-summary-name">${budget.category}</span>
                    <span class="budget-summary-pct">${pct}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${pct}%; background: ${barColor};"></div>
                </div>
                <div class="budget-summary-meta">
                    <span>${formatCurrency(budget.spent)} spent</span>
                    <span>${formatCurrency(budget.remaining)} left</span>
                </div>
            </div>
        `;
    }).join('');
}

function updateAIInsightWidget() {
    const widget = document.getElementById('ai-insight-widget');
    if (!widget) return;

    const transactions = getUserTransactions();
    if (transactions.length === 0) {
        widget.innerHTML = '<p class="ai-insight-placeholder">Add transactions to receive AI insights.</p>';
        return;
    }

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) : 0;

    let insight;
    if (savingsRate >= 30) {
        insight = { icon: 'fas fa-piggy-bank', color: '#22c55e', title: 'Savings Rate: ' + savingsRate + '%', message: 'Excellent! You\'re saving over 30% of your income. Keep up the great work!' };
    } else if (savingsRate >= 15) {
        insight = { icon: 'fas fa-chart-line', color: '#fbbf24', title: 'Savings Rate: ' + savingsRate + '%', message: 'Good progress. Try to increase your savings to 30% for stronger financial health.' };
    } else {
        insight = { icon: 'fas fa-triangle-exclamation', color: '#f43f5e', title: 'Savings Rate: ' + savingsRate + '%', message: 'Your savings rate is low. Consider reducing expenses to build a safety net.' };
    }

    widget.innerHTML = `
        <div class="ai-insight-card">
            <div class="ai-insight-icon" style="color: ${insight.color};">
                <i class="${insight.icon}"></i>
            </div>
            <div class="ai-insight-body">
                <div class="ai-insight-title">${insight.title}</div>
                <div class="ai-insight-message">${insight.message}</div>
            </div>
        </div>
    `;
}

function updateGreeting() {
    const greetingEl = document.getElementById('greeting-text');
    if (!greetingEl) return;

    const hour = new Date().getHours();
    let greeting;
    if (hour < 12) {
        greeting = 'Good Morning';
    } else if (hour < 17) {
        greeting = 'Good Afternoon';
    } else {
        greeting = 'Good Evening';
    }

    if (currentUser && currentUser.profile && currentUser.profile.firstName) {
        greeting += ', ' + currentUser.profile.firstName;
    }

    greetingEl.textContent = greeting;
}

function loadTransactions() {
    console.log('Loading transactions page');
    populateTransactionCategories();
    displayTransactions();
}

function displayTransactions(searchQuery = '') {
    const transactions = getUserTransactions()
        .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
        
    const filterValue = document.getElementById('transaction-filter')?.value || 'all';
    let filteredTransactions = filterValue === 'all' ? transactions : transactions.filter(t => t.type === filterValue);

    // Apply search filter
    if (searchQuery) {
        filteredTransactions = filteredTransactions.filter(t =>
            t.description.toLowerCase().includes(searchQuery) ||
            t.category.toLowerCase().includes(searchQuery) ||
            t.amount.toString().includes(searchQuery)
        );
    }
    
    const container = document.getElementById('transactions-table');
    if (!container) return;
    
    if (filteredTransactions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-receipt"></i>
                <p>No transactions found</p>
                <button class="btn btn--primary btn--sm" onclick="showTransactionModal()">Add Your First Transaction</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredTransactions.map(transaction => `
        <div class="table-row">
            <div>${formatDate(transaction.date)}</div>
            <div>${transaction.description}</div>
            <div>${transaction.category}</div>
            <div class="text-right transaction-amount ${transaction.type}">
                ${transaction.type === 'income' ? '+' : '-'}${formatCurrency(Math.abs(transaction.amount))}
            </div>
            <div class="table-actions">
                <button class="btn-icon" onclick="editTransaction(${transaction.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon danger" onclick="deleteTransaction(${transaction.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function filterTransactions() {
    console.log('Filtering transactions');
    displayTransactions();
}

function loadBudgets() {
    console.log('Loading budgets page');
    const budgets = getUserBudgets();
    const container = document.getElementById('budgets-grid');
    
    if (!container) return;
    
    if (budgets.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calculator"></i>
                <p>No budgets created yet</p>
                <button class="btn btn--primary btn--sm" onclick="showBudgetModal()">Create Your First Budget</button>
            </div>
        `;
        return;
    }
    
    // Display budgets (implementation would go here)
    // Since the full implementation is outside the scope, display a coming soon message
    container.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-calculator"></i>
            <p>Budget Management is coming soon!</p>
        </div>
    `;
}

function loadGoals() {
    console.log('Loading goals page');
    const goals = getUserGoals();
    const container = document.getElementById('goals-grid');
    
    if (!container) return;
    
    if (goals.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-bullseye"></i>
                <p>No financial goals set yet</p>
                <button class="btn btn--primary btn--sm" onclick="showGoalModal()">Set Your First Goal</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = goals.map(goal => {
        const percentage = Math.min((goal.current / goal.target) * 100, 100);
        const deadline = new Date(goal.deadline + 'T00:00:00'); // Ensure date is treated consistently
        const today = new Date();
        const isOverdue = deadline < today && percentage < 100;
        
        // Calculate remaining months/days
        let timeRemainingText;
        if (percentage >= 100) {
            timeRemainingText = "Goal Achieved!";
        } else if (isOverdue) {
            timeRemainingText = "Overdue";
        } else {
            const diffTime = deadline.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays > 30) {
                const diffMonths = Math.ceil(diffDays / 30.44); // Average days in a month
                timeRemainingText = `${diffMonths} months left`;
            } else if (diffDays > 0) {
                timeRemainingText = `${diffDays} days left`;
            } else {
                 timeRemainingText = "Deadline Today";
            }
        }
        
        // Circular progress bar calculations (r=32, C=201.06)
        const circumference = 2 * Math.PI * 32;
        const offset = circumference * (1 - percentage / 100);
        
        return `
            <div class="goal-card">
                <div class="goal-header">
                    <div class="goal-name">${goal.name}</div>
                    <div class="goal-target">Target: ${formatCurrency(goal.target)}</div>
                </div>
                <div class="circular-progress">
                    <svg viewBox="0 0 80 80">
                        <circle class="progress-bg" cx="40" cy="40" r="32"></circle>
                        <circle class="progress-value" cx="40" cy="40" r="32" 
                                stroke-dasharray="${circumference}" 
                                stroke-dashoffset="${offset}"></circle>
                    </svg>
                    <div class="progress-text">${percentage.toFixed(0)}%</div>
                </div>
                <div class="goal-progress">
                    <div class="goal-amount">
                        <div class="goal-current">Saved: ${formatCurrency(goal.current)}</div>
                        <div class="goal-percentage">${timeRemainingText}</div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percentage}%"></div>
                    </div>
                </div>
                <div class="goal-deadline ${isOverdue ? 'overdue' : ''}">
                    Target Date: ${formatDate(goal.deadline)}
                </div>
                <div class="goal-actions" style="margin-top: var(--space-12); display: flex; justify-content: flex-end; gap: var(--space-8);">
                    <button class="btn-icon" onclick="editGoal(${goal.id})" title="Edit Goal">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon danger" onclick="deleteGoal(${goal.id})" title="Delete Goal">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

async function loadInvestments() {
    console.log('Loading investments page');
    const container = document.getElementById('investments-list');
    
    // Destroy existing chart instance to prevent conflicts
    const portfolioChart = Chart.getChart("portfolio-chart");
    if (portfolioChart) {
        portfolioChart.destroy();
    }
    
    const userData = getUserData();
    const holdings = userData.holdings || [];
    
    if (holdings.length === 0) {
        if (container) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-chart-line"></i>
                    <p>No investments tracked yet</p>
                    <small>Add your crypto holdings to track performance</small>
                </div>
            `;
        }
        return;
    }

    try {
        const ids = [...new Set(holdings.map(h => h.asset))].join(',');
        const currencyKey = currentCurrency.toLowerCase();
        const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=${currencyKey}`);
        const prices = await res.json();
        
        let totalValue = 0;
        let totalCost = 0;
        
        const labels = [];
        const values = [];

        container.innerHTML = holdings.map(holding => {
            const currentPrice = prices[holding.asset] ? prices[holding.asset][currencyKey] : 0;
            const currentValue = currentPrice * holding.quantity;
            const costBasis = holding.buyPrice * holding.quantity;
            const returnPct = ((currentValue - costBasis) / costBasis) * 100;
            
            totalValue += currentValue;
            totalCost += costBasis;
            
            labels.push(holding.asset.charAt(0).toUpperCase() + holding.asset.slice(1));
            values.push(currentValue);
            
            return `
                <div class="table-row">
                    <div style="text-transform: capitalize;">${holding.asset}</div>
                    <div>${holding.quantity.toFixed(4)}</div>
                    <div>Buy: ${formatCurrency(holding.buyPrice)}</div>
                    <div class="text-right">
                        <div>${formatCurrency(currentValue)}</div>
                        <div style="color: ${returnPct >= 0 ? 'var(--color-success)' : 'var(--color-danger)'}">
                            ${returnPct >= 0 ? '+' : ''}${returnPct.toFixed(2)}%
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        const overallReturn = totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0;
        
        // Update stats
        const statValues = document.querySelectorAll('#investments-page .stat-value');
        if (statValues.length >= 3) {
            statValues[0].textContent = formatCurrency(totalValue);
            statValues[1].textContent = `${overallReturn >= 0 ? '+' : ''}${overallReturn.toFixed(2)}%`;
            statValues[1].style.color = overallReturn >= 0 ? 'var(--color-success)' : 'var(--color-danger)';
            statValues[2].textContent = holdings.length;
        }

        // Render Chart
        const canvas = document.getElementById('portfolio-chart');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        data: values,
                        backgroundColor: ['#2dd4bf', '#38bdf8', '#a78bfa', '#fbbf24', '#34d399'],
                    }]
                },
                    options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: '#f1f5f9',
                                usePointStyle: true,
                                pointStyle: 'circle',
                                padding: 14
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(15, 20, 32, 0.92)',
                            borderColor: 'rgba(255, 255, 255, 0.08)',
                            borderWidth: 1,
                            titleColor: '#f1f5f9',
                            bodyColor: '#94a3b8',
                            padding: 12,
                            cornerRadius: 8,
                            callbacks: {
                                label: function(context) { return context.label + ': ' + formatCurrency(context.parsed); }
                            }
                        }
                    }
                }
            });
        }
        
    } catch (err) {
        console.error('Failed to fetch crypto prices', err);
        showToast('Error connecting to market data', 'error');
    }
}

window.showAddHoldingModal = function() {
    console.log('showAddHoldingModal called');
    const modal = document.getElementById('add-holding-modal');
    if (modal) modal.classList.remove('hidden');
}

window.hideAddHoldingModal = function() {
    console.log('hideAddHoldingModal called');
    const modal = document.getElementById('add-holding-modal');
    if (modal) {
        modal.classList.add('hidden');
        clearForm('holding-form');
    }
}

function handleAddHoldingSubmit(e) {
    e.preventDefault();
    console.log('handleAddHoldingSubmit called');
    
    if (!currentUser) return;
    
    const holdingData = {
        asset: document.getElementById('holding-asset').value,
        quantity: parseFloat(document.getElementById('holding-quantity').value),
        buyPrice: parseFloat(document.getElementById('holding-buy-price').value),
        currency: currentCurrency
    };
    
    if (isNaN(holdingData.quantity) || holdingData.quantity <= 0) {
        showToast('Please enter a valid quantity.', 'error');
        return;
    }
    
    if (isNaN(holdingData.buyPrice) || holdingData.buyPrice <= 0) {
        showToast('Please enter a valid buy price.', 'error');
        return;
    }
    
    const userData = getUserData();
    if (!userData.holdings) userData.holdings = [];
    
    const newDoc = {
        id: Date.now(),
        ...holdingData
    };
    userData.holdings.push(newDoc);
    showToast('Holding added successfully', 'success');
    
    saveUserData(userData);
    hideAddHoldingModal();
    
    if (currentPage === 'investments') {
        loadInvestments();
    }
}

function loadInsights() {
    console.log('Loading insights page');
    const container = document.getElementById('insights-grid');
    if (!container) return;

    const transactions = getUserTransactions();
    const goals = getUserGoals();

    if (transactions.length === 0 && goals.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-lightbulb"></i>
                <p>Build your financial profile to get personalized insights</p>
                <small>Add transactions and set goals to unlock AI recommendations</small>
            </div>
        `;
        return;
    }

    const insights = [];

    if (transactions.length > 0) {
        const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) : 0;

        // Savings rate insight
        const srColor = savingsRate >= 30 ? 'emerald' : savingsRate >= 15 ? 'gold' : 'danger';
        const srMsg = savingsRate >= 30 ? 'Excellent! You\'re saving over 30% of your income.' :
                      savingsRate >= 15 ? 'Good progress. Try to increase your savings to 30%.' :
                      'Your savings rate is low. Consider reducing expenses.';
        insights.push({
            icon: 'fas fa-piggy-bank', iconClass: srColor,
            title: 'Savings Rate', value: savingsRate + '%',
            message: srMsg
        });

        // Top spending category
        const expensesByCategory = {};
        transactions.filter(t => t.type === 'expense').forEach(t => {
            expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
        });
        const topCat = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1])[0];
        if (topCat) {
            const pct = totalExpenses > 0 ? (topCat[1] / totalExpenses * 100).toFixed(1) : 0;
            insights.push({
                icon: 'fas fa-fire', iconClass: 'danger',
                title: 'Top Spending Category', value: formatCurrency(topCat[1]),
                message: `${topCat[0]} accounts for ${pct}% of your total expenses. Consider if this aligns with your priorities.`
            });
        }

        // Monthly average
        const monthMap = {};
        transactions.forEach(t => {
            const m = t.date.substring(0, 7);
            if (!monthMap[m]) monthMap[m] = { income: 0, expense: 0 };
            if (t.type === 'income') monthMap[m].income += t.amount;
            else monthMap[m].expense += t.amount;
        });
        const months = Object.keys(monthMap).length || 1;
        const avgIncome = totalIncome / months;
        const avgExpense = totalExpenses / months;

        insights.push({
            icon: 'fas fa-calendar', iconClass: 'sky',
            title: 'Monthly Average Income', value: formatCurrency(avgIncome),
            message: `You average ${formatCurrency(avgIncome)} in income per month across ${months} month(s).`
        });

        insights.push({
            icon: 'fas fa-receipt', iconClass: 'violet',
            title: 'Monthly Average Expense', value: formatCurrency(avgExpense),
            message: `You spend an average of ${formatCurrency(avgExpense)} per month. Tracking this helps optimize your budget.`
        });

        // Transaction count
        insights.push({
            icon: 'fas fa-list-check', iconClass: 'teal',
            title: 'Total Transactions', value: transactions.length.toString(),
            message: `You've logged ${transactions.length} transaction(s). Keep tracking for better insights!`
        });
    }

    if (goals.length > 0) {
        const totalTarget = goals.reduce((s, g) => s + g.target, 0);
        const totalSaved = goals.reduce((s, g) => s + g.current, 0);
        const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget * 100).toFixed(1) : 0;

        insights.push({
            icon: 'fas fa-bullseye', iconClass: 'gold',
            title: 'Goals Progress', value: overallProgress + '%',
            message: `You're ${overallProgress}% of the way to achieving all ${goals.length} goal(s). Total saved: ${formatCurrency(totalSaved)}.`
        });

        // Overdue goals
        const today = new Date();
        const overdue = goals.filter(g => new Date(g.deadline + 'T00:00:00') < today && g.current < g.target);
        if (overdue.length > 0) {
            insights.push({
                icon: 'fas fa-triangle-exclamation', iconClass: 'danger',
                title: 'Overdue Goals', value: overdue.length.toString(),
                message: `${overdue.length} goal(s) have passed their deadline. Consider adjusting targets or timelines.`
            });
        }
    }

    container.innerHTML = insights.map(i => `
        <div class="insight-card">
            <div class="insight-icon ${i.iconClass}"><i class="${i.icon}"></i></div>
            <h4>${i.title}</h4>
            <div class="insight-value">${i.value}</div>
            <p>${i.message}</p>
        </div>
    `).join('');
}

function loadSettings() {
    console.log('Loading settings page');
    const currencySelect = document.getElementById('currency-select');
    const themeSelect = document.getElementById('theme-select');
    
    if (currencySelect) {
        currencySelect.value = currentCurrency;
    }
    
    if (themeSelect) {
        themeSelect.value = currentTheme;
    }
}

// Chart Functions
function createCharts() {
    createSpendingChart();
    createTrendChart();
}

function createSpendingChart() {
    const canvas = document.getElementById('spending-chart');
    const emptyState = document.getElementById('no-expense-data');
    
    if (!canvas) return;
    
    let chartInstance = Chart.getChart(canvas);
    if (chartInstance) {
        chartInstance.destroy();
    }
    
    const transactions = getUserTransactions();
    
    if (transactions.length === 0) {
        canvas.style.display = 'none';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }
    
    canvas.style.display = 'block';
    if (emptyState) emptyState.classList.add('hidden');
    
    const ctx = canvas.getContext('2d');
    
    const trendData = {};
    const labels = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthYear = d.toLocaleString('en-US', { month: 'short', year: '2-digit' });
        labels.push(monthYear);
        trendData[monthYear] = { income: 0, expense: 0 };
    }
    
    transactions.forEach(t => {
        const tDate = new Date(t.date + 'T00:00:00');
        const monthYear = tDate.toLocaleString('en-US', { month: 'short', year: '2-digit' });
        
        if (trendData[monthYear]) {
            if (t.type === 'income') {
                trendData[monthYear].income += t.amount;
            } else if (t.type === 'expense') {
                trendData[monthYear].expense += t.amount;
            }
        }
    });
    
    const incomeData = labels.map(label => trendData[label] ? trendData[label].income : 0);
    const expenseData = labels.map(label => trendData[label] ? trendData[label].expense : 0);
    
    const incomeGradient = ctx.createLinearGradient(0, 0, 0, 300);
    incomeGradient.addColorStop(0, 'rgba(45, 212, 191, 0.3)');
    incomeGradient.addColorStop(1, 'rgba(45, 212, 191, 0.0)');
    
    const expenseGradient = ctx.createLinearGradient(0, 0, 0, 300);
    expenseGradient.addColorStop(0, 'rgba(248, 113, 113, 0.35)');
    expenseGradient.addColorStop(1, 'rgba(248, 113, 113, 0.0)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Income',
                    data: incomeData,
                    fill: true,
                    borderColor: '#2dd4bf',
                    backgroundColor: incomeGradient,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6
                },
                {
                    label: 'Expenses',
                    data: expenseData,
                    fill: true,
                    borderColor: '#f87171',
                    backgroundColor: expenseGradient,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) { return formatCurrency(value); },
                        color: '#94a3b8'
                    },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                },
                x: {
                    ticks: { color: '#94a3b8' },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: { color: '#f1f5f9', usePointStyle: true, pointStyle: 'circle', padding: 16 }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(15, 20, 32, 0.92)',
                    borderColor: 'rgba(255, 255, 255, 0.08)',
                    borderWidth: 1,
                    titleColor: '#f1f5f9',
                    bodyColor: '#94a3b8',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + formatCurrency(context.parsed.y);
                        }
                    }
                }
            },
            hover: { mode: 'nearest', intersect: true },
            animation: { duration: 1200, easing: 'easeOutQuart' }
        }
    });
}

function createTrendChart() {
    const canvas = document.getElementById('trend-chart');
    const emptyState = document.getElementById('no-trend-data');
    
    if (!canvas) return;
    
    let chartInstance = Chart.getChart(canvas);
    if (chartInstance) {
        chartInstance.destroy();
    }
    
    const transactions = getUserTransactions();
    const expenses = transactions.filter(t => t.type === 'expense');
    
    if (expenses.length === 0) {
        canvas.style.display = 'none';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }
    
    canvas.style.display = 'block';
    if (emptyState) emptyState.classList.add('hidden');
    
    const ctx = canvas.getContext('2d');
    const expensesByCategory = {};
    
    expenses.forEach(transaction => {
        expensesByCategory[transaction.category] = (expensesByCategory[transaction.category] || 0) + transaction.amount;
    });

    const categoryColors = {
        'Food': '#2dd4bf',
        'Groceries': '#2dd4bf',
        'Travel': '#38bdf8',
        'Transportation': '#38bdf8',
        'Shopping': '#a78bfa',
        'Bills': '#fbbf24',
        'Utilities': '#fbbf24',
        'Rent': '#fbbf24',
        'Entertainment': '#f43f5e',
        'Health': '#22c55e',
        'Healthcare': '#22c55e',
        'Salary': '#22c55e',
        'Insurance': '#fbbf24',
        'Education': '#38bdf8',
        'EMI': '#a78bfa',
        'Miscellaneous': '#94a3b8',
        'Investment': '#38bdf8'
    };

    const fallbackColors = ['#2dd4bf', '#38bdf8', '#a78bfa', '#fbbf24', '#f43f5e', '#22c55e'];
    const categoryKeys = Object.keys(expensesByCategory);
    const bgColors = categoryKeys.map((cat, i) => categoryColors[cat] || fallbackColors[i % fallbackColors.length]);

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categoryKeys,
            datasets: [{
                data: Object.values(expensesByCategory),
                backgroundColor: bgColors,
                borderColor: '#0f1420',
                borderWidth: 2,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#f1f5f9',
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 14,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 20, 32, 0.92)',
                    borderColor: 'rgba(255, 255, 255, 0.08)',
                    borderWidth: 1,
                    titleColor: '#f1f5f9',
                    bodyColor: '#94a3b8',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const pct = ((context.parsed / total) * 100).toFixed(1);
                            return context.label + ': ' + formatCurrency(context.parsed) + ' (' + pct + '%)';
                        }
                    }
                }
            },
            animation: { duration: 1200, easing: 'easeOutQuart' }
        }
    });
}

// Helper Functions
function populateTransactionCategories() {
    const select = document.getElementById('transaction-category');
    if (select) {
        // Clear existing options first (important for edit mode)
        select.innerHTML = ''; 
        appData.categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            select.appendChild(option);
        });
    }
}

function populateTransactionForm(transaction) {
    const elements = {
        'transaction-type': transaction.type,
        'transaction-amount': transaction.amount,
        'transaction-category': transaction.category,
        'transaction-description': transaction.description,
        'transaction-date': transaction.date
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.value = value;
    });
}

function populateGoalForm(goal) {
    const elements = {
        'goal-name': goal.name,
        'goal-target': goal.target,
        'goal-current': goal.current,
        'goal-type': goal.type,
        'goal-deadline': goal.deadline
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.value = value;
    });
}

function populateProfileForm() {
    if (!currentUser) return;
    
    const profile = currentUser.profile;
    const elements = {
        'profile-first-name': profile.firstName,
        'profile-last-name': profile.lastName,
        'profile-email': profile.email,
        'profile-phone': profile.phone,
        'profile-dob': profile.dateOfBirth
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.value = value || '';
    });
    
    // Update profile picture placeholder in modal
    updateProfilePictures(); 
}

function handleProfilePictureUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file.', 'error');
        return;
    }
    
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
        showToast('Image file must be smaller than 5MB.', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = e.target.result;
        
        // Update profile picture in current user data
        if (currentUser) {
            const userAccount = userAccounts[currentUser.email];
            
            // CRITICAL FIX: Save the new image data to both the main userAccount and currentUser session
            userAccount.profile.profilePicture = imageData;
            currentUser.profile.profilePicture = imageData;
            
            // Update session
            localStorage.setItem('financeapp_current_user', JSON.stringify(currentUser));
            
            // Update UI (The image will be displayed with object-fit: cover due to CSS, fixing the visual "zooming" issue)
            updateProfilePictures();
            
            showToast('Profile picture updated successfully!', 'success');
        }
    };
    
    reader.readAsDataURL(file);
}

// UI Helper Functions
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.classList.remove('hidden');
    }
}

function hideError(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add('hidden');
    }
}

function clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
        // Clear any error messages
        form.querySelectorAll('.error-message').forEach(error => {
            error.classList.add('hidden');
        });
        // Remove data attributes for editing
        delete form.dataset.transactionId;
        delete form.dataset.goalId;
    }
}

function updateElementText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) element.textContent = text;
}

function showLoading(message = 'Processing...') {
    const modal = document.getElementById('loading-modal');
    const messageEl = document.getElementById('loading-message');
    
    if (messageEl) messageEl.textContent = message;
    if (modal) modal.classList.remove('hidden');
}

function hideLoading() {
    const modal = document.getElementById('loading-modal');
    if (modal) modal.classList.add('hidden');
}

function showSuccess(title, message) {
    const modal = document.getElementById('success-modal');
    const titleEl = document.getElementById('success-title');
    const messageEl = document.getElementById('success-message');
    
    if (titleEl) titleEl.textContent = title;
    if (messageEl) messageEl.textContent = message;
    if (modal) modal.classList.remove('hidden');
}

function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 4000);
}

// Utility Functions
function formatCurrency(amount) {
    const currencies = {
        INR: { symbol: '₹', locale: 'en-IN' },
        USD: { symbol: '$', locale: 'en-US' },
        EUR: { symbol: '€', locale: 'de-DE' },
        GBP: { symbol: '£', locale: 'en-GB' }
    };
    
    const currency = currencies[currentCurrency] || currencies.INR;
    const absAmount = Math.abs(amount); // Use absolute value for formatting
    
    if (currentCurrency === 'INR') {
        // Indian number formatting with lakhs and crores
        if (absAmount >= 10000000) {
            return `${currency.symbol}${new Intl.NumberFormat(currency.locale, { maximumFractionDigits: 2 }).format(absAmount / 10000000)} Cr`;
        } else if (absAmount >= 100000) {
            return `${currency.symbol}${new Intl.NumberFormat(currency.locale, { maximumFractionDigits: 2 }).format(absAmount / 100000)} L`;
        } else {
            // Use standard formatting for smaller amounts
            return new Intl.NumberFormat(currency.locale, {
                style: 'currency',
                currency: currentCurrency,
                maximumFractionDigits: 0
            }).format(absAmount);
        }
    } else {
        return new Intl.NumberFormat(currency.locale, {
            style: 'currency',
            currency: currentCurrency
        }).format(absAmount);
    }
}

function formatDate(dateString) {
    // Ensures date is consistently treated as local (start-of-day) for accurate display
    const date = new Date(dateString + 'T00:00:00'); 
    
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function debounce(fn, delay) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

/* ══════════════════════════════════════════════════════════════════════════
   SCROLL REVEAL — IntersectionObserver for all .reveal elements
   ══════════════════════════════════════════════════════════════════════════ */
function initScrollReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════════════════════════════════════
   3D TILT CARD — Mouse-tracking perspective transform on .tilt-card
   ══════════════════════════════════════════════════════════════════════════ */
function initTiltCards() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if ('ontouchstart' in window) return; // skip on touch devices

    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

            // Update shine gradient position
            const shine = card.querySelector('.tilt-shine');
            if (shine) {
                shine.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
                shine.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

/* ══════════════════════════════════════════════════════════════════════════
   HERO 3D DEPTH — Mouse parallax on the hero visual (unified handler)
   ══════════════════════════════════════════════════════════════════════════ */
function initHeroDepth() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if ('ontouchstart' in window) return;

    const heroSection = document.querySelector('.landing-hero');
    const heroVisual = document.querySelector('.hero-visual');
    if (!heroSection || !heroVisual) return;

    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        heroVisual.style.transform = `
            translateX(${x * 20}px)
            translateY(${y * 15}px)
            rotateY(${x * 5}deg)
            rotateX(${-y * 5}deg)
        `;
    });

    heroSection.addEventListener('mouseleave', () => {
        heroVisual.style.transform = '';
    });
}

/* ══════════════════════════════════════════════════════════════════════════
   TRUST STAT COUNTER — Animate numbers counting up on scroll
   ══════════════════════════════════════════════════════════════════════════ */
function initCountUp() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const statValues = document.querySelectorAll('.trust-stat-value');
    if (!statValues.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('counting');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statValues.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════════════════════════════════════
   INITIALIZE ALL 3D & SCROLL EFFECTS — Called from main DOMContentLoaded
   ══════════════════════════════════════════════════════════════════════════ */