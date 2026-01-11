// Main Application Controller
class LibraryApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.managers = {};
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupApp());
        } else {
            this.setupApp();
        }
    }

    setupApp() {
        // Wait a bit to ensure all scripts are loaded
        setTimeout(() => {
            // Setup navigation
            this.setupNavigation();

            // Initialize managers
            this.initializeManagers();

            // Setup global event listeners
            this.setupGlobalEventListeners();

            // Load initial page if authenticated
            if (authManager.isLoggedIn()) {
                this.loadPage('dashboard');
            }
        }, 200);
    }

    setupNavigation() {
        // Sidebar navigation
        const navLinks = document.querySelectorAll('.sidebar .nav-link[data-page]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.loadPage(page);

                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    initializeManagers() {
        // Initialize all module managers
        // Note: Don't initialize immediately, wait for page load
        this.managers = {
            dashboard: null,
            books: null,
            users: null,
            authors: null,
            loans: null,
            categories: null
        };
    }

    setupGlobalEventListeners() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.loadPage(e.state.page, false);
            }
        });

        // Handle keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'b':
                        e.preventDefault();
                        this.loadPage('books');
                        break;
                    case 'u':
                        e.preventDefault();
                        this.loadPage('users');
                        break;
                    case 'd':
                        e.preventDefault();
                        this.loadPage('dashboard');
                        break;
                }
            }
        });

        // Handle window resize for responsive charts
        window.addEventListener('resize', () => {
            if (this.managers.dashboard && this.managers.dashboard.charts) {
                Object.values(this.managers.dashboard.charts).forEach(chart => {
                    chart.resize();
                });
            }
        });
    }

    loadPage(page, updateHistory = true) {
        if (!authManager.isLoggedIn()) {
            authManager.showLoginPage();
            return;
        }

        // Show loading state
        this.showLoadingState();

        // Update current page
        this.currentPage = page;

        // Update browser history
        if (updateHistory) {
            history.pushState({ page }, '', `#${page}`);
        }

        // Update navigation active state
        this.updateNavigation(page);

        // Load page content
        setTimeout(() => {
            try {
                switch (page) {
                    case 'dashboard':
                        if (!this.managers.dashboard) {
                            this.managers.dashboard = new DashboardManager();
                            window.dashboardManager = this.managers.dashboard;
                        } else {
                            this.managers.dashboard.renderDashboard();
                            this.managers.dashboard.initializeCharts();
                        }
                        break;
                    case 'books':
                        if (!this.managers.books) {
                            this.managers.books = new BooksManager();
                            window.booksManager = this.managers.books;
                        } else {
                            this.managers.books.renderBooks();
                        }
                        break;
                    case 'users':
                        if (!this.managers.users) {
                            this.managers.users = new UsersManager();
                            window.usersManager = this.managers.users;
                        } else {
                            this.managers.users.renderUsers();
                        }
                        break;
                    case 'authors':
                        if (!this.managers.authors) {
                            this.managers.authors = new AuthorsManager();
                            window.authorsManager = this.managers.authors;
                        } else {
                            this.managers.authors.renderAuthors();
                        }
                        break;
                    case 'loans':
                        if (!this.managers.loans) {
                            this.managers.loans = new LoansManager();
                            window.loansManager = this.managers.loans;
                        } else {
                            this.managers.loans.renderLoans();
                        }
                        break;
                    case 'categories':
                        if (!this.managers.categories) {
                            this.managers.categories = new CategoriesManager();
                            window.categoriesManager = this.managers.categories;
                        } else {
                            this.managers.categories.renderCategories();
                        }
                        break;
                    default:
                        console.warn(`Unknown page: ${page}`);
                        this.loadPage('dashboard');
                        return;
                }

                this.hideLoadingState();
            } catch (error) {
                console.error('Error loading page:', error);
                this.hideLoadingState();
                authManager.showNotification('Error loading page. Please try again.', 'danger');
            }
        }, 300);
    }

    updateNavigation(page) {
        const navLinks = document.querySelectorAll('.sidebar .nav-link[data-page]');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === page) {
                link.classList.add('active');
            }
        });
    }

    showLoadingState() {
        const contentArea = document.getElementById('contentArea');
        contentArea.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `;
    }

    hideLoadingState() {
        // Loading state is hidden when page content is rendered
    }

    // Utility methods
    getCurrentPage() {
        return this.currentPage;
    }

    getManager(page) {
        return this.managers[page];
    }

    // Global search functionality
    performGlobalSearch(query) {
        if (!query || query.length < 2) return;

        const results = {
            books: libraryData.getBooks().filter(book =>
                book.title.toLowerCase().includes(query.toLowerCase()) ||
                book.author.toLowerCase().includes(query.toLowerCase())
            ),
            authors: libraryData.getAuthors().filter(author =>
                author.name.toLowerCase().includes(query.toLowerCase())
            ),
            users: libraryData.getUsers().filter(user =>
                user.firstName.toLowerCase().includes(query.toLowerCase()) ||
                user.lastName.toLowerCase().includes(query.toLowerCase()) ||
                user.email.toLowerCase().includes(query.toLowerCase())
            )
        };

        this.displayGlobalSearchResults(results, query);
    }

    displayGlobalSearchResults(results, query) {
        let modalContent = `
            <div class="search-results">
                <h6>Search Results for "${query}"</h6>
        `;

        // Books results
        if (results.books.length > 0) {
            modalContent += `
                <div class="mb-4">
                    <h6>Books (${results.books.length})</h6>
                    <div class="list-group">
                        ${results.books.slice(0, 5).map(book => `
                            <a href="#" class="list-group-item list-group-item-action" onclick="app.loadPage('books'); booksManager.viewBookDetails(${book.id})">
                                <div class="d-flex w-100 justify-content-between">
                                    <h6 class="mb-1">${book.title}</h6>
                                    <small>${book.author}</small>
                                </div>
                                <small>${book.category} • ${book.publicationYear}</small>
                            </a>
                        `).join('')}
                        ${results.books.length > 5 ? `<small class="text-muted">...and ${results.books.length - 5} more</small>` : ''}
                    </div>
                </div>
            `;
        }

        // Authors results
        if (results.authors.length > 0) {
            modalContent += `
                <div class="mb-4">
                    <h6>Authors (${results.authors.length})</h6>
                    <div class="list-group">
                        ${results.authors.slice(0, 5).map(author => `
                            <a href="#" class="list-group-item list-group-item-action" onclick="app.loadPage('authors'); authorsManager.viewAuthorDetails(${author.id})">
                                <div class="d-flex w-100 justify-content-between">
                                    <h6 class="mb-1">${author.name}</h6>
                                    <small>${author.nationality}</small>
                                </div>
                                <small>${author.birthYear} - ${author.deathYear || 'Present'}</small>
                            </a>
                        `).join('')}
                        ${results.authors.length > 5 ? `<small class="text-muted">...and ${results.authors.length - 5} more</small>` : ''}
                    </div>
                </div>
            `;
        }

        // Users results
        if (results.users.length > 0) {
            modalContent += `
                <div class="mb-4">
                    <h6>Users (${results.users.length})</h6>
                    <div class="list-group">
                        ${results.users.slice(0, 5).map(user => `
                            <a href="#" class="list-group-item list-group-item-action" onclick="app.loadPage('users'); usersManager.viewUserDetails(${user.id})">
                                <div class="d-flex w-100 justify-content-between">
                                    <h6 class="mb-1">${user.firstName} ${user.lastName}</h6>
                                    <small>${user.membershipType}</small>
                                </div>
                                <small>${user.email}</small>
                            </a>
                        `).join('')}
                        ${results.users.length > 5 ? `<small class="text-muted">...and ${results.users.length - 5} more</small>` : ''}
                    </div>
                </div>
            `;
        }

        if (results.books.length === 0 && results.authors.length === 0 && results.users.length === 0) {
            modalContent += '<p class="text-muted">No results found.</p>';
        }

        modalContent += '</div>';

        const modal = new bootstrap.Modal(document.getElementById('commonModal'));
        document.getElementById('modalTitle').textContent = 'Search Results';
        document.getElementById('modalBody').innerHTML = modalContent;
        modal.show();
    }

    // System information
    getSystemInfo() {
        return {
            version: '1.0.0',
            totalBooks: libraryData.getTotalBooks(),
            totalAuthors: libraryData.getTotalAuthors(),
            totalUsers: libraryData.getTotalUsers(),
            activeLoans: libraryData.getTotalActiveLoans(),
            overdueLoans: libraryData.getTotalOverdueLoans(),
            currentUser: authManager.getCurrentUser(),
            lastUpdated: new Date().toISOString()
        };
    }

    // Export all data
    exportAllData() {
        const data = this.getSystemInfo();
        const exportData = {
            system: data,
            books: libraryData.getBooks(),
            authors: libraryData.getAuthors(),
            categories: libraryData.getCategories(),
            users: libraryData.getUsers(),
            loans: libraryData.getLoans()
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `library_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        authManager.showNotification('System data exported successfully', 'success');
    }
}

// Initialize the application
let app;
window.addEventListener('DOMContentLoaded', () => {
    app = new LibraryApp();
    window.app = app; // Make it globally accessible
});

// Add shake animation for login form
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
    .shake {
        animation: shake 0.5s;
    }
`;
document.head.appendChild(style);
