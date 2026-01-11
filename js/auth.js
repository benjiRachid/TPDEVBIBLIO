// Authentication Module
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.init();
    }

    init() {
        // Check if user is already logged in
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.isAuthenticated = true;
            this.showMainApp();
        } else {
            this.showLoginPage();
        }

        // Setup event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Login form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }

        // Language dropdown
        const languageLinks = document.querySelectorAll('[data-lang]');
        languageLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.changeLanguage(link.dataset.lang);
            });
        });
    }

    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Simple authentication (in real app, this would be server-side)
        if (username === 'admin' && password === 'admin') {
            this.currentUser = {
                username: username,
                role: 'admin',
                loginTime: new Date().toISOString()
            };
            this.isAuthenticated = true;

            // Save to localStorage
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

            // Show main app
            this.showMainApp();
            
            // Show success message
            this.showNotification('Login successful! Welcome back.', 'success');
        } else {
            this.showNotification('Invalid credentials. Please try again.', 'danger');
            // Shake the form
            const loginCard = document.querySelector('.login-card');
            loginCard.classList.add('shake');
            setTimeout(() => {
                loginCard.classList.remove('shake');
            }, 500);
        }
    }

    handleLogout() {
        this.currentUser = null;
        this.isAuthenticated = false;
        localStorage.removeItem('currentUser');
        this.showLoginPage();
        this.showNotification('You have been logged out successfully.', 'info');
    }

    showLoginPage() {
        document.getElementById('loginPage').classList.remove('d-none');
        document.getElementById('mainApp').classList.add('d-none');
        document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }

    showMainApp() {
        document.getElementById('loginPage').classList.add('d-none');
        document.getElementById('mainApp').classList.remove('d-none');
        document.body.style.background = '#f5f5f5';
        
        // Load dashboard by default
        if (window.app) {
            window.app.loadPage('dashboard');
        }
    }

    changeLanguage(lang) {
        const currentLangSpan = document.getElementById('currentLang');
        const langMap = {
            'en': 'EN',
            'fr': 'FR',
            'ar': 'AR'
        };
        
        currentLangSpan.textContent = langMap[lang];
        
        // Save language preference
        localStorage.setItem('preferredLanguage', lang);
        
        // Apply RTL for Arabic
        if (lang === 'ar') {
            document.documentElement.setAttribute('dir', 'rtl');
            document.body.classList.add('rtl');
        } else {
            document.documentElement.removeAttribute('dir');
            document.body.classList.remove('rtl');
        }
        
        // Update translations (simplified for demo)
        this.updateTranslations(lang);
        
        this.showNotification(`Language changed to ${langMap[lang]}`, 'info');
    }

    updateTranslations(lang) {
        const translations = {
            'en': {
                'dashboard': 'Dashboard',
                'books': 'Books',
                'users': 'Users',
                'authors': 'Authors',
                'loans': 'Loans',
                'categories': 'Categories'
            },
            'fr': {
                'dashboard': 'Tableau de bord',
                'books': 'Livres',
                'users': 'Utilisateurs',
                'authors': 'Auteurs',
                'loans': 'Emprunts',
                'categories': 'Catégories'
            },
            'ar': {
                'dashboard': 'لوحة القيادة',
                'books': 'الكتب',
                'users': 'المستخدمون',
                'authors': 'المؤلفون',
                'loans': 'الإعارات',
                'categories': 'الفئات'
            }
        };

        // Update navigation links
        const navLinks = document.querySelectorAll('.sidebar .nav-link[data-page]');
        navLinks.forEach(link => {
            const page = link.dataset.page;
            if (translations[lang] && translations[lang][page]) {
                const icon = link.querySelector('i');
                link.innerHTML = `${icon.outerHTML} ${translations[lang][page]}`;
            }
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
        notification.style.zIndex = '9999';
        notification.style.minWidth = '300px';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    // Check if user is authenticated
    isLoggedIn() {
        return this.isAuthenticated;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user has specific role
    hasRole(role) {
        return this.currentUser && this.currentUser.role === role;
    }
}

// Initialize auth manager
const authManager = new AuthManager();
