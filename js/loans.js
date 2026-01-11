// Loans CRUD Module
class LoansManager {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.searchTerm = '';
        this.sortBy = 'loanDate';
        this.sortOrder = 'desc';
        this.searchTimeout = null;
        window.loansManager = this; // Make globally accessible
        this.init();
    }

    init() {
        this.renderLoans();
        this.setupEventListeners();
    }

    renderLoans() {
        const contentArea = document.getElementById('contentArea');
        const loans = this.getFilteredAndSortedLoans();
        const totalPages = Math.ceil(loans.length / this.itemsPerPage);
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const paginatedLoans = loans.slice(startIndex, endIndex);

        contentArea.innerHTML = `
            <div class="loans-content fade-in">
                <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 class="h2">Loans Management</h1>
                    <div class="btn-toolbar mb-2 mb-md-0">
                        <div class="btn-group me-2">
                            <button type="button" class="btn btn-sm btn-primary" id="addLoanBtn">
                                <i class="fas fa-plus"></i> New Loan
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-secondary" id="exportLoansBtn">
                                <i class="fas fa-download"></i> Export CSV
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Search and Filter -->
                <div class="search-filter-container">
                    <div class="row">
                        <div class="col-md-3">
                            <div class="input-group">
                                <span class="input-group-text"><i class="fas fa-search"></i></span>
                                <input type="text" class="form-control search-input" id="loanSearchInput" placeholder="Search loans..." autocomplete="off">
                            </div>
                        </div>
                        <div class="col-md-2">
                            <select class="form-select" id="statusFilter">
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="overdue">Overdue</option>
                                <option value="returned">Returned</option>
                            </select>
                        </div>
                        <div class="col-md-2">
                            <select class="form-select" id="sortBySelect">
                                <option value="loanDate">Sort by Loan Date</option>
                                <option value="dueDate">Sort by Due Date</option>
                                <option value="bookTitle">Sort by Book</option>
                                <option value="userName">Sort by User</option>
                            </select>
                        </div>
                        <div class="col-md-2">
                            <select class="form-select" id="overdueFilter">
                                <option value="">All Loans</option>
                                <option value="overdue">Overdue Only</option>
                                <option value="due-soon">Due Soon (3 days)</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <button class="btn btn-outline-secondary w-100" onclick="loansManager.resetFilters()">
                                <i class="fas fa-redo"></i> Reset Filters
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Loans Table -->
                <div class="table-container">
                    <div class="table-header">
                        <h5 class="table-title">Loans List (${loans.length} loans)</h5>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Book</th>
                                    <th>User</th>
                                    <th>Loan Date</th>
                                    <th>Due Date</th>
                                    <th>Return Date</th>
                                    <th>Status</th>
                                    <th>Fine</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${paginatedLoans.map(loan => this.renderLoanRow(loan)).join('')}
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- Pagination -->
                    ${totalPages > 1 ? this.renderPagination(totalPages) : ''}
                </div>
            </div>
        `;

        this.attachTableEventListeners();
    }

    renderLoanRow(loan) {
        const today = new Date();
        const dueDate = new Date(loan.dueDate);
        const daysOverdue = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
        const isOverdue = today > dueDate && loan.status === 'active';

        let statusClass = 'info';
        let statusIcon = 'clock';

        if (loan.status === 'returned') {
            statusClass = 'success';
            statusIcon = 'check-circle';
        } else if (isOverdue) {
            statusClass = 'danger';
            statusIcon = 'exclamation-triangle';
        } else if (daysOverdue <= 3 && daysOverdue >= 0) {
            statusClass = 'warning';
            statusIcon = 'exclamation-circle';
        }

        return `
            <tr class="${isOverdue ? 'table-danger' : ''}">
                <td>
                    <div class="fw-bold">${loan.bookTitle}</div>
                </td>
                <td>
                    <div class="d-flex align-items-center">
                        <i class="fas fa-user text-primary me-2"></i>
                        ${loan.userName}
                    </div>
                </td>
                <td>
                    <small>${new Date(loan.loanDate).toLocaleDateString()}</small>
                </td>
                <td>
                    <small class="${isOverdue ? 'text-danger fw-bold' : ''}">${new Date(loan.dueDate).toLocaleDateString()}</small>
                    ${isOverdue ? `<br><small class="text-danger">${daysOverdue} days overdue</small>` : ''}
                </td>
                <td>
                    <small>${loan.returnDate ? new Date(loan.returnDate).toLocaleDateString() : '-'}</small>
                </td>
                <td>
                    <span class="status-badge ${loan.status}">${loan.status}</span>
                </td>
                <td>
                    <div class="d-flex align-items-center">
                        <i class="fas fa-dollar-sign text-${loan.fine > 0 ? 'danger' : 'success'} me-1"></i>
                        <span class="${loan.fine > 0 ? 'text-danger fw-bold' : ''}">$${loan.fine.toFixed(2)}</span>
                    </div>
                </td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary action-btn" data-action="view" data-id="${loan.id}" title="View Details">
                            <i class="fas fa-eye pointer-events-none"></i>
                        </button>
                        ${loan.status === 'active' ? `
                            <button class="btn btn-outline-success action-btn" data-action="return" data-id="${loan.id}" title="Return Book">
                                <i class="fas fa-undo pointer-events-none"></i>
                            </button>
                            <button class="btn btn-outline-info action-btn" data-action="renew" data-id="${loan.id}" title="Renew Loan">
                                <i class="fas fa-sync-alt pointer-events-none"></i>
                            </button>
                        ` : ''}
                        <button class="btn btn-outline-danger action-btn" data-action="delete" data-id="${loan.id}" title="Delete">
                            <i class="fas fa-trash pointer-events-none"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    renderPagination(totalPages) {
        let pagination = '<div class="pagination-container"><nav><ul class="pagination">';

        pagination += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="loansManager.goToPage(${this.currentPage - 1})">Previous</a>
            </li>
        `;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                pagination += `
                    <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                        <a class="page-link" href="#" onclick="loansManager.goToPage(${i})">${i}</a>
                    </li>
                `;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                pagination += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
        }

        pagination += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="loansManager.goToPage(${this.currentPage + 1})">Next</a>
            </li>
        `;

        pagination += '</ul></nav></div>';
        return pagination;
    }

    getFilteredAndSortedLoans() {
        let loans = [...libraryData.getLoans()];

        if (this.searchTerm) {
            loans = loans.filter(loan =>
                loan.bookTitle.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                loan.userName.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        }

        const statusFilter = document.getElementById('statusFilter')?.value;
        if (statusFilter) {
            loans = loans.filter(loan => loan.status === statusFilter);
        }

        const overdueFilter = document.getElementById('overdueFilter')?.value;
        if (overdueFilter) {
            const today = new Date();
            loans = loans.filter(loan => {
                const dueDate = new Date(loan.dueDate);
                const daysOverdue = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));

                if (overdueFilter === 'overdue') {
                    return today > dueDate && loan.status === 'active';
                } else if (overdueFilter === 'due-soon') {
                    return daysOverdue <= 3 && daysOverdue >= 0 && loan.status === 'active';
                }
                return true;
            });
        }

        loans.sort((a, b) => {
            let aValue = a[this.sortBy];
            let bValue = b[this.sortBy];

            if (this.sortBy.includes('Date')) {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            } else if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (this.sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return loans;
    }

    setupEventListeners() {
        document.addEventListener('input', (e) => {
            if (e.target.id === 'loanSearchInput') {
                if (this.searchTimeout) {
                    clearTimeout(this.searchTimeout);
                }

                this.showSearchLoading();

                this.searchTimeout = setTimeout(() => {
                    this.searchTerm = e.target.value;
                    this.currentPage = 1;
                    this.renderLoans();
                    this.hideSearchLoading();
                }, 300);
            }
        });

        ['statusFilter', 'overdueFilter'].forEach(id => {
            document.addEventListener('change', (e) => {
                if (e.target.id === id) {
                    this.currentPage = 1;
                    this.renderLoans();
                }
            });
        });

        document.addEventListener('change', (e) => {
            if (e.target.id === 'sortBySelect') {
                this.sortBy = e.target.value;
                this.renderLoans();
            }
        });
    }

    attachTableEventListeners() {
        // Add Loan Button
        const addLoanBtn = document.getElementById('addLoanBtn');
        if (addLoanBtn) {
            addLoanBtn.addEventListener('click', () => this.showAddLoanModal());
        }

        // Export Button
        const exportBtn = document.getElementById('exportLoansBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportLoans());
        }

        // Table Action Buttons
        const tableBody = document.querySelector('tbody');
        if (tableBody) {
            tableBody.addEventListener('click', (e) => {
                const btn = e.target.closest('.action-btn');
                if (!btn) return;

                const action = btn.dataset.action;
                const id = parseInt(btn.dataset.id);

                switch (action) {
                    case 'view':
                        this.viewLoanDetails(id);
                        break;
                    case 'return':
                        this.returnBook(id);
                        break;
                    case 'renew':
                        this.renewLoan(id);
                        break;
                    case 'delete':
                        this.deleteLoan(id);
                        break;
                }
            });
        }

        const searchInput = document.getElementById('loanSearchInput');
        const statusFilter = document.getElementById('statusFilter');
        const sortBySelect = document.getElementById('sortBySelect');
        const overdueFilter = document.getElementById('overdueFilter');

        if (searchInput) searchInput.value = this.searchTerm;
        if (statusFilter) statusFilter.value = document.getElementById('statusFilter')?.value || '';
        if (sortBySelect) sortBySelect.value = this.sortBy;
        if (overdueFilter) overdueFilter.value = document.getElementById('overdueFilter')?.value || '';
    }

    showSearchLoading() {
        const searchInput = document.getElementById('loanSearchInput');
        if (searchInput) {
            searchInput.classList.add('search-loading');
        }
    }

    hideSearchLoading() {
        const searchInput = document.getElementById('loanSearchInput');
        if (searchInput) {
            searchInput.classList.remove('search-loading');
        }
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderLoans();
    }

    resetFilters() {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        this.searchTerm = '';
        this.currentPage = 1;
        this.sortBy = 'loanDate';
        this.sortOrder = 'desc';

        document.getElementById('loanSearchInput').value = '';
        document.getElementById('statusFilter').value = '';
        document.getElementById('overdueFilter').value = '';
        document.getElementById('sortBySelect').value = 'loanDate';

        this.renderLoans();
    }

    showAddLoanModal() {
        const modalContent = this.renderLoanForm();

        const modal = new bootstrap.Modal(document.getElementById('commonModal'));
        document.getElementById('modalTitle').textContent = 'Create New Loan';
        document.getElementById('modalBody').innerHTML = modalContent;
        modal.show();

        document.getElementById('loanForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addLoan();
        });
    }

    renderLoanForm(loan = null) {
        const books = libraryData.getBooks().filter(book => book.availableCopies > 0);
        const users = libraryData.getUsers().filter(user => user.status === 'active');

        return `
            <form id="loanForm">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="bookId" class="form-label">Book *</label>
                        <select class="form-select" id="bookId" required>
                            <option value="">Select a book...</option>
                            ${books.map(book =>
            `<option value="${book.id}" ${loan?.bookId == book.id ? 'selected' : ''}>
                                    ${book.title} (${book.availableCopies} available)
                                </option>`
        ).join('')}
                        </select>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="userId" class="form-label">User *</label>
                        <select class="form-select" id="userId" required>
                            <option value="">Select a user...</option>
                            ${users.map(user =>
            `<option value="${user.id}" ${loan?.userId == user.id ? 'selected' : ''}>
                                    ${user.firstName} ${user.lastName} (${user.booksBorrowed} books borrowed)
                                </option>`
        ).join('')}
                        </select>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="loanDate" class="form-label">Loan Date *</label>
                        <input type="date" class="form-control" id="loanDate" value="${loan?.loanDate || new Date().toISOString().split('T')[0]}" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="dueDate" class="form-label">Due Date *</label>
                        <input type="date" class="form-control" id="dueDate" value="${loan?.dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}" required>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label for="notes" class="form-label">Notes</label>
                    <textarea class="form-control" id="notes" rows="3">${loan?.notes || ''}</textarea>
                </div>
                
                <div class="d-flex justify-content-end gap-2">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save me-2"></i>Create Loan
                    </button>
                </div>
            </form>
        `;
    }

    addLoan() {
        const bookId = parseInt(document.getElementById('bookId').value);
        const userId = parseInt(document.getElementById('userId').value);
        const book = libraryData.findBook(bookId);
        const user = libraryData.findUser(userId);

        if (!book || !user) return;

        const loan = {
            bookId: bookId,
            bookTitle: book.title,
            userId: userId,
            userName: `${user.firstName} ${user.lastName}`,
            loanDate: document.getElementById('loanDate').value,
            dueDate: document.getElementById('dueDate').value,
            notes: document.getElementById('notes').value,
            status: 'active',
            renewalCount: 0,
            fine: 0
        };

        const newLoan = libraryData.addLoan(loan);

        // Update book availability
        book.availableCopies -= 1;
        book.borrowedCopies += 1;

        // Update user's borrowed books count
        user.booksBorrowed = (user.booksBorrowed || 0) + 1;

        bootstrap.Modal.getInstance(document.getElementById('commonModal')).hide();
        authManager.showNotification(`Loan created successfully! "${book.title}" loaned to ${user.firstName} ${user.lastName}`, 'success');
        this.renderLoans();
    }

    viewLoanDetails(loanId) {
        const loan = libraryData.findLoan(loanId);
        if (!loan) return;

        const today = new Date();
        const dueDate = new Date(loan.dueDate);
        const daysOverdue = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
        const isOverdue = today > dueDate && loan.status === 'active';

        const modalContent = `
            <div class="loan-details">
                <div class="row">
                    <div class="col-md-6">
                        <h6>Book Information</h6>
                        <p><strong>Title:</strong> ${loan.bookTitle}</p>
                        
                        <h6>User Information</h6>
                        <p><strong>Name:</strong> ${loan.userName}</p>
                        
                        <h6>Loan Information</h6>
                        <p><strong>Loan Date:</strong> ${new Date(loan.loanDate).toLocaleDateString()}</p>
                        <p><strong>Due Date:</strong> ${new Date(loan.dueDate).toLocaleDateString()}</p>
                        <p><strong>Return Date:</strong> ${loan.returnDate ? new Date(loan.returnDate).toLocaleDateString() : 'Not returned yet'}</p>
                        <p><strong>Status:</strong> <span class="status-badge ${loan.status}">${loan.status}</span></p>
                        ${isOverdue ? `<p class="text-danger"><strong>Days Overdue:</strong> ${daysOverdue}</p>` : ''}
                        <p><strong>Fine:</strong> $${loan.fine.toFixed(2)}</p>
                        <p><strong>Renewals:</strong> ${loan.renewalCount}</p>
                        
                        ${loan.notes ? `<h6>Notes</h6><p>${loan.notes}</p>` : ''}
                    </div>
                </div>
                
                <div class="d-flex gap-2 mt-3">
                    ${loan.status === 'active' ? `
                        <button class="btn btn-success" onclick="loansManager.returnBook(${loan.id})">
                            <i class="fas fa-undo me-2"></i>Return Book
                        </button>
                        <button class="btn btn-warning" onclick="loansManager.renewLoan(${loan.id})">
                            <i class="fas fa-sync me-2"></i>Renew Loan
                        </button>
                    ` : ''}
                    <button class="btn btn-primary" onclick="loansManager.exportLoanPDF(${loan.id})">
                        <i class="fas fa-file-pdf me-2"></i>Export PDF
                    </button>
                </div>
            </div>
        `;

        const modal = new bootstrap.Modal(document.getElementById('commonModal'));
        document.getElementById('modalTitle').textContent = 'Loan Details';
        document.getElementById('modalBody').innerHTML = modalContent;
        modal.show();
    }

    returnBook(loanId) {
        const loan = libraryData.findLoan(loanId);
        if (!loan || loan.status !== 'active') return;

        const book = libraryData.findBook(loan.bookId);
        const user = libraryData.findUser(loan.userId);

        // Update loan
        libraryData.updateLoan(loanId, {
            status: 'returned',
            returnDate: new Date().toISOString().split('T')[0]
        });

        // Update book availability
        if (book) {
            book.availableCopies += 1;
            book.borrowedCopies -= 1;
        }

        // Update user's borrowed books count
        if (user) {
            user.booksBorrowed = Math.max(0, (user.booksBorrowed || 0) - 1);
        }

        authManager.showNotification(`Book "${loan.bookTitle}" returned successfully by ${loan.userName}!`, 'success');
        this.renderLoans();
    }

    renewLoan(loanId) {
        const loan = libraryData.findLoan(loanId);
        if (!loan || loan.status !== 'active') return;

        if (loan.renewalCount >= 2) {
            authManager.showNotification('Maximum renewal limit reached (2 renewals)', 'warning');
            return;
        }

        // Extend due date by 14 days
        const newDueDate = new Date(loan.dueDate);
        newDueDate.setDate(newDueDate.getDate() + 14);

        libraryData.updateLoan(loanId, {
            dueDate: newDueDate.toISOString().split('T')[0],
            renewalCount: loan.renewalCount + 1
        });

        authManager.showNotification(`Loan renewed for "${loan.bookTitle}". New due date: ${newDueDate.toLocaleDateString()}`, 'success');
        this.renderLoans();
    }

    deleteLoan(loanId) {
        const loan = libraryData.findLoan(loanId);
        if (!loan) return;

        if (confirm(`Are you sure you want to delete this loan record for "${loan.bookTitle}"? This action cannot be undone.`)) {
            const success = libraryData.deleteLoan(loanId);

            if (success) {
                // If loan is active, restore book availability
                if (loan.status === 'active') {
                    const book = libraryData.findBook(loan.bookId);
                    const user = libraryData.findUser(loan.userId);

                    if (book) {
                        book.availableCopies += 1;
                        book.borrowedCopies -= 1;
                    }

                    if (user) {
                        user.booksBorrowed = Math.max(0, (user.booksBorrowed || 0) - 1);
                    }
                }

                authManager.showNotification(`Loan record deleted successfully`, 'success');
                this.renderLoans();
            } else {
                authManager.showNotification('Failed to delete loan', 'danger');
            }
        }
    }

    exportLoans() {
        const loans = this.getFilteredAndSortedLoans();
        let csv = 'Book Title,User Name,Loan Date,Due Date,Return Date,Status,Fine,Renewal Count\n';

        loans.forEach(loan => {
            csv += `"${loan.bookTitle}","${loan.userName}","${loan.loanDate}","${loan.dueDate}","${loan.returnDate || ''}","${loan.status}",${loan.fine},${loan.renewalCount}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `loans_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        authManager.showNotification('Loans exported successfully', 'success');
    }

    exportLoanPDF(loanId) {
        const loan = libraryData.findLoan(loanId);
        if (!loan) return;

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Title
        doc.setFontSize(20);
        doc.setTextColor(40, 40, 40);
        doc.text("Loan Details", 20, 20);

        // Separator
        doc.setLineWidth(0.5);
        doc.line(20, 25, 190, 25);

        // Content
        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);

        let y = 40;
        const lineHeight = 10;

        const addDetail = (label, value) => {
            doc.setFont("helvetica", "bold");
            doc.text(`${label}:`, 20, y);
            doc.setFont("helvetica", "normal");
            doc.text(`${value}`, 60, y);
            y += lineHeight;
        };

        addDetail("Book Title", loan.bookTitle);
        addDetail("User Name", loan.userName);
        addDetail("Loan Date", loan.loanDate);
        addDetail("Due Date", loan.dueDate);
        addDetail("Return Date", loan.returnDate || "Not returned yet");
        addDetail("Status", loan.status);
        addDetail("Fine", `$${loan.fine.toFixed(2)}`);
        addDetail("Renewal Count", loan.renewalCount.toString());

        if (loan.notes) {
            y += 5;
            doc.setFont("helvetica", "bold");
            doc.text("Notes:", 20, y);
            y += 7;
            doc.setFont("helvetica", "normal");
            const splitNotes = doc.splitTextToSize(loan.notes, 170);
            doc.text(splitNotes, 20, y);
        }

        doc.save(`loan_${loan.id}_details.pdf`);
        authManager.showNotification(`Loan details PDF exported for "${loan.bookTitle}"`, 'success');
    }
}

// Initialize loans manager when needed
let loansManager;

// Global functions for onclick events
window.returnBook = function (loanId) {
    if (loansManager) {
        loansManager.returnBook(loanId);
    }
};

window.renewLoan = function (loanId) {
    if (loansManager) {
        loansManager.renewLoan(loanId);
    }
};

window.deleteLoan = function (loanId) {
    if (loansManager) {
        loansManager.deleteLoan(loanId);
    }
};

window.viewLoanDetails = function (loanId) {
    if (loansManager) {
        loansManager.viewLoanDetails(loanId);
    }
};
