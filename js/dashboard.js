// Dashboard Module
class DashboardManager {
    constructor() {
        this.charts = {};
        window.dashboardManager = this; // Make globally accessible
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

                <!-- Charts Section - Row 2 -->
                <div class="row">
                    <div class="col-lg-4 mb-4">
                        <div class="card shadow-sm h-100">
                            <div class="card-body">
                                <h5 class="card-title text-muted mb-3">Books by Category</h5>
                                <div class="chart-container" style="position: relative; height: 350px;">
                                    <canvas id="booksByCategoryChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-8 mb-4">
                        <div class="card shadow-sm h-100">
                            <div class="card-body">
                                <h5 class="card-title text-muted mb-3">Monthly Loans Trend</h5>
                                <div class="chart-container" style="position: relative; height: 350px;">
                                    <canvas id="loansTrendChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Charts Section - Row 3 -->
                <div class="row">
                    <div class="col-lg-4 mb-4">
                        <div class="card shadow-sm h-100">
                            <div class="card-body">
                                <h5 class="card-title text-muted mb-3">Loan Status</h5>
                                <div class="chart-container" style="position: relative; height: 300px;">
                                    <canvas id="loanStatusChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 mb-4">
                        <div class="card shadow-sm h-100">
                            <div class="card-body">
                                <h5 class="card-title text-muted mb-3">Users by Membership</h5>
                                <div class="chart-container" style="position: relative; height: 300px;">
                                    <canvas id="userMembershipChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 mb-4">
                        <div class="card shadow-sm h-100">
                            <div class="card-body">
                                <h5 class="card-title text-muted mb-3">Top 5 Authors</h5>
                                <div class="chart-container" style="position: relative; height: 300px;">
                                    <canvas id="topAuthorsChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-12 mb-4">
                        <div class="card shadow-sm">
                            <div class="card-body">
                                <h5 class="card-title text-muted mb-3">Recent Activities</h5>
                                <div class="activity-list">
                                    ${this.renderRecentActivities()}
                                </div>
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
        const commonOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        };

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
                            '#007bff', '#dc3545', '#e91e63', '#9c27b0', '#ff9800', '#795548'
                        ],
                        borderWidth: 2,
                        borderColor: '#fff'
                    }]
                },
                options: commonOptions
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
                    ...commonOptions,
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
                        backgroundColor: ['#28a745', '#dc3545', '#17a2b8'],
                        borderWidth: 2,
                        borderColor: '#fff'
                    }]
                },
                options: commonOptions
            });
        }

        // 4. User Membership Chart (Polar Area)
        const userMembershipCtx = document.getElementById('userMembershipChart');
        if (userMembershipCtx) {
            const membershipData = libraryData.getUsersByMembership();

            this.charts.userMembership = new Chart(userMembershipCtx, {
                type: 'polarArea',
                data: {
                    labels: Object.keys(membershipData),
                    datasets: [{
                        data: Object.values(membershipData),
                        backgroundColor: ['rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(255, 206, 86, 0.7)'],
                        borderWidth: 1
                    }]
                },
                options: commonOptions
            });
        }

        // 5. Top Authors Chart (Bar)
        const topAuthorsCtx = document.getElementById('topAuthorsChart');
        if (topAuthorsCtx) {
            const authors = libraryData.getAuthors()
                .sort((a, b) => (b.booksCount || 0) - (a.booksCount || 0))
                .slice(0, 5);

            this.charts.topAuthors = new Chart(topAuthorsCtx, {
                type: 'bar',
                data: {
                    labels: authors.map(a => a.name),
                    datasets: [{
                        label: 'Books Count',
                        data: authors.map(a => a.booksCount || 0),
                        backgroundColor: '#20c997',
                        borderColor: '#20c997',
                        borderWidth: 1
                    }]
                },
                options: {
                    ...commonOptions,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { stepSize: 1 }
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
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(element => element.style.opacity = '0.5');

        setTimeout(() => {
            document.querySelector('.books .stat-number').textContent = libraryData.getTotalBooks();
            document.querySelector('.users .stat-number').textContent = libraryData.getTotalUsers();
            document.querySelector('.loans .stat-number').textContent = libraryData.getTotalActiveLoans();
            document.querySelector('.authors .stat-number').textContent = libraryData.getTotalAuthors();

            statNumbers.forEach(element => element.style.opacity = '1');
            this.updateCharts();

            authManager.showNotification('Dashboard data refreshed successfully', 'success');
        }, 500);
    }

    updateCharts() {
        // Simple full re-render for simplicity as data might change structure
        if (this.charts.booksByCategory) this.charts.booksByCategory.destroy();
        if (this.charts.loansTrend) this.charts.loansTrend.destroy();
        if (this.charts.loanStatus) this.charts.loanStatus.destroy();
        if (this.charts.userMembership) this.charts.userMembership.destroy();
        if (this.charts.topAuthors) this.charts.topAuthors.destroy();

        this.initializeCharts();
    }

    exportReport() {
        const csvContent = this.generateCSVReport();
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
        return csv;
    }

    showOverdueBooks() {
        const overdueLoans = libraryData.getLoans().filter(loan => loan.status === 'overdue');
        if (overdueLoans.length === 0) {
            authManager.showNotification('No overdue books at the moment', 'info');
            return;
        }
        // ... (existing modal logic)
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
        modalContent += '</tbody></table></div></div>';
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

let dashboardManager;
