// Dashboard Module
class DashboardManager {
    constructor() {
        this.charts = {};
        this.init();
    }

    init() {
        // Wait a bit to ensure DOM is ready and data is loaded
        setTimeout(() => {
            this.renderDashboard();
            this.initializeCharts();
            this.setupEventListeners();
        }, 100);
    }

    renderDashboard() {
        const contentArea = document.getElementById('contentArea');
        contentArea.innerHTML = `
            <div class="dashboard-content fade-in">
                <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 class="h2">Dashboard</h1>
                    <div class="btn-toolbar mb-2 mb-md-0">
                        <div class="btn-group me-2">
                            <button type="button" class="btn btn-sm btn-outline-secondary" onclick="dashboardManager.refreshData()">
                                <i class="fas fa-sync-alt"></i> Refresh
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-secondary" onclick="dashboardManager.exportReport()">
                                <i class="fas fa-download"></i> Export
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Statistics Cards -->
                <div class="row mb-4">
                    <div class="col-xl-3 col-md-6 mb-4">
                        <div class="stat-card books">
                            <div class="stat-icon">
                                <i class="fas fa-book"></i>
                            </div>
                            <h3 class="stat-number">${libraryData.getTotalBooks()}</h3>
                            <p class="stat-label">Total Books</p>
                            <div class="stat-change">
                                <small class="text-success">
                                    <i class="fas fa-arrow-up"></i> 12% from last month
                                </small>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-md-6 mb-4">
                        <div class="stat-card users">
                            <div class="stat-icon">
                                <i class="fas fa-users"></i>
                            </div>
                            <h3 class="stat-number">${libraryData.getTotalUsers()}</h3>
                            <p class="stat-label">Total Users</p>
                            <div class="stat-change">
                                <small class="text-success">
                                    <i class="fas fa-arrow-up"></i> 8% from last month
                                </small>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-md-6 mb-4">
                        <div class="stat-card loans">
                            <div class="stat-icon">
                                <i class="fas fa-hand-holding"></i>
                            </div>
                            <h3 class="stat-number">${libraryData.getTotalActiveLoans()}</h3>
                            <p class="stat-label">Active Loans</p>
                            <div class="stat-change">
                                <small class="text-warning">
                                    <i class="fas fa-minus"></i> Same as last week
                                </small>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-md-6 mb-4">
                        <div class="stat-card authors">
                            <div class="stat-icon">
                                <i class="fas fa-user-edit"></i>
                            </div>
                            <h3 class="stat-number">${libraryData.getTotalAuthors()}</h3>
                            <p class="stat-label">Total Authors</p>
                            <div class="stat-change">
                                <small class="text-success">
                                    <i class="fas fa-arrow-up"></i> 2 new this month
                                </small>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Charts Section -->
                <div class="row">
                    <div class="col-lg-6 mb-4">
                        <div class="chart-container">
                            <h5 class="chart-title">Books by Category</h5>
                            <canvas id="booksByCategoryChart"></canvas>
                        </div>
                    </div>
                    <div class="col-lg-6 mb-4">
                        <div class="chart-container">
                            <h5 class="chart-title">Monthly Loans Trend</h5>
                            <canvas id="loansTrendChart"></canvas>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-lg-4 mb-4">
                        <div class="chart-container">
                            <h5 class="chart-title">Loan Status Distribution</h5>
                            <canvas id="loanStatusChart"></canvas>
                        </div>
                    </div>
                    <div class="col-lg-8 mb-4">
                        <div class="chart-container">
                            <h5 class="chart-title">Recent Activities</h5>
                            <div class="activity-list">
                                ${this.renderRecentActivities()}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-12">
                        <div class="chart-container">
                            <h5 class="chart-title">Quick Actions</h5>
                            <div class="row">
                                <div class="col-md-3 mb-3">
                                    <button class="btn btn-primary w-100" onclick="window.app.loadPage('books')">
                                        <i class="fas fa-plus-circle me-2"></i>Add New Book
                                    </button>
                                </div>
                                <div class="col-md-3 mb-3">
                                    <button class="btn btn-success w-100" onclick="window.app.loadPage('loans')">
                                        <i class="fas fa-hand-holding me-2"></i>New Loan
                                    </button>
                                </div>
                                <div class="col-md-3 mb-3">
                                    <button class="btn btn-info w-100" onclick="window.app.loadPage('users')">
                                        <i class="fas fa-user-plus me-2"></i>Add User
                                    </button>
                                </div>
                                <div class="col-md-3 mb-3">
                                    <button class="btn btn-warning w-100" onclick="dashboardManager.showOverdueBooks()">
                                        <i class="fas fa-exclamation-triangle me-2"></i>Overdue Books
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderRecentActivities() {
        const recentLoans = libraryData.getLoans().slice(-5).reverse();
        
        return recentLoans.map(loan => {
            const statusClass = loan.status === 'active' ? 'success' : 
                              loan.status === 'overdue' ? 'danger' : 'info';
            const statusIcon = loan.status === 'active' ? 'hand-holding' : 
                              loan.status === 'overdue' ? 'exclamation-triangle' : 'check-circle';
            
            return `
                <div class="activity-item d-flex align-items-center p-3 border-bottom">
                    <div class="activity-icon me-3">
                        <i class="fas fa-${statusIcon} text-${statusClass}"></i>
                    </div>
                    <div class="activity-content flex-grow-1">
                        <div class="activity-title">${loan.bookTitle}</div>
                        <div class="activity-subtitle text-muted">
                            ${loan.userName} - ${new Date(loan.loanDate).toLocaleDateString()}
                        </div>
                    </div>
                    <div class="activity-status">
                        <span class="status-badge ${loan.status}">${loan.status}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    initializeCharts() {
        // Books by Category Chart
        const booksByCategoryCtx = document.getElementById('booksByCategoryChart');
        if (booksByCategoryCtx) {
            const categoryData = libraryData.getBooksByCategory();
            
            this.charts.booksByCategory = new Chart(booksByCategoryCtx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(categoryData),
                    datasets: [{
                        data: Object.values(categoryData),
                        backgroundColor: [
                            '#007bff',
                            '#dc3545',
                            '#e91e63',
                            '#9c27b0',
                            '#ff9800',
                            '#795548'
                        ],
                        borderWidth: 2,
                        borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        // Loans Trend Chart
        const loansTrendCtx = document.getElementById('loansTrendChart');
        if (loansTrendCtx) {
            const monthlyData = libraryData.getLoansByMonth();
            
            this.charts.loansTrend = new Chart(loansTrendCtx, {
                type: 'line',
                data: {
                    labels: Object.keys(monthlyData),
                    datasets: [{
                        label: 'Number of Loans',
                        data: Object.values(monthlyData),
                        borderColor: '#007bff',
                        backgroundColor: 'rgba(0, 123, 255, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
        }

        // Loan Status Chart
        const loanStatusCtx = document.getElementById('loanStatusChart');
        if (loanStatusCtx) {
            const loans = libraryData.getLoans();
            const statusCount = {
                active: loans.filter(l => l.status === 'active').length,
                overdue: loans.filter(l => l.status === 'overdue').length,
                returned: loans.filter(l => l.status === 'returned').length
            };
            
            this.charts.loanStatus = new Chart(loanStatusCtx, {
                type: 'pie',
                data: {
                    labels: ['Active', 'Overdue', 'Returned'],
                    datasets: [{
                        data: Object.values(statusCount),
                        backgroundColor: [
                            '#28a745',
                            '#dc3545',
                            '#17a2b8'
                        ],
                        borderWidth: 2,
                        borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    }

    setupEventListeners() {
        // Auto-refresh every 30 seconds
        setInterval(() => {
            this.refreshData();
        }, 30000);
    }

    refreshData() {
        // Show loading state
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(element => {
            element.style.opacity = '0.5';
        });

        // Simulate data refresh
        setTimeout(() => {
            // Update statistics
            document.querySelector('.books .stat-number').textContent = libraryData.getTotalBooks();
            document.querySelector('.users .stat-number').textContent = libraryData.getTotalUsers();
            document.querySelector('.loans .stat-number').textContent = libraryData.getTotalActiveLoans();
            document.querySelector('.authors .stat-number').textContent = libraryData.getTotalAuthors();

            // Restore opacity
            statNumbers.forEach(element => {
                element.style.opacity = '1';
            });

            // Update charts
            this.updateCharts();
            
            // Show notification
            authManager.showNotification('Dashboard data refreshed successfully', 'success');
        }, 500);
    }

    updateCharts() {
        // Update books by category chart
        if (this.charts.booksByCategory) {
            const categoryData = libraryData.getBooksByCategory();
            this.charts.booksByCategory.data.datasets[0].data = Object.values(categoryData);
            this.charts.booksByCategory.update();
        }

        // Update loans trend chart
        if (this.charts.loansTrend) {
            const monthlyData = libraryData.getLoansByMonth();
            this.charts.loansTrend.data.datasets[0].data = Object.values(monthlyData);
            this.charts.loansTrend.update();
        }

        // Update loan status chart
        if (this.charts.loanStatus) {
            const loans = libraryData.getLoans();
            const statusCount = {
                active: loans.filter(l => l.status === 'active').length,
                overdue: loans.filter(l => l.status === 'overdue').length,
                returned: loans.filter(l => l.status === 'returned').length
            };
            this.charts.loanStatus.data.datasets[0].data = Object.values(statusCount);
            this.charts.loanStatus.update();
        }
    }

    exportReport() {
        // Create CSV content
        const csvContent = this.generateCSVReport();
        
        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `library_report_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        authManager.showNotification('Report exported successfully', 'success');
    }

    generateCSVReport() {
        let csv = 'Library Management System Report\n';
        csv += `Generated on: ${new Date().toLocaleString()}\n\n`;
        
        csv += 'Statistics\n';
        csv += `Total Books,${libraryData.getTotalBooks()}\n`;
        csv += `Total Authors,${libraryData.getTotalAuthors()}\n`;
        csv += `Total Users,${libraryData.getTotalUsers()}\n`;
        csv += `Active Loans,${libraryData.getTotalActiveLoans()}\n`;
        csv += `Overdue Loans,${libraryData.getTotalOverdueLoans()}\n\n`;
        
        csv += 'Books by Category\n';
        const categoryData = libraryData.getBooksByCategory();
        Object.entries(categoryData).forEach(([category, count]) => {
            csv += `${category},${count}\n`;
        });
        
        return csv;
    }

    showOverdueBooks() {
        const overdueLoans = libraryData.getLoans().filter(loan => loan.status === 'overdue');
        
        if (overdueLoans.length === 0) {
            authManager.showNotification('No overdue books at the moment', 'info');
            return;
        }

        let modalContent = `
            <div class="overdue-list">
                <h6>Overdue Books (${overdueLoans.length})</h6>
                <div class="table-responsive">
                    <table class="table table-sm">
                        <thead>
                            <tr>
                                <th>Book</th>
                                <th>User</th>
                                <th>Due Date</th>
                                <th>Fine</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        overdueLoans.forEach(loan => {
            modalContent += `
                <tr>
                    <td>${loan.bookTitle}</td>
                    <td>${loan.userName}</td>
                    <td>${new Date(loan.dueDate).toLocaleDateString()}</td>
                    <td>$${loan.fine.toFixed(2)}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="dashboardManager.sendReminder(${loan.id})">
                            <i class="fas fa-bell"></i> Remind
                        </button>
                    </td>
                </tr>
            `;
        });

        modalContent += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('commonModal'));
        document.getElementById('modalTitle').textContent = 'Overdue Books';
        document.getElementById('modalBody').innerHTML = modalContent;
        modal.show();
    }

    sendReminder(loanId) {
        const loan = libraryData.findLoan(loanId);
        if (loan) {
            authManager.showNotification(`Reminder sent to ${loan.userName} for "${loan.bookTitle}"`, 'success');
        }
    }
}

// Initialize dashboard manager when needed
let dashboardManager;
