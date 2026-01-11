// Users CRUD Module
class UsersManager {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.searchTerm = '';
        this.sortBy = 'firstName';
        this.sortOrder = 'asc';
        this.searchTimeout = null;
        window.usersManager = this; // Make globally accessible
        this.init();
    }

    init() {
        this.renderUsers();
        this.setupEventListeners();
    }

    renderUsers() {
        const contentArea = document.getElementById('contentArea');
        const users = this.getFilteredAndSortedUsers();
        const totalPages = Math.ceil(users.length / this.itemsPerPage);
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const paginatedUsers = users.slice(startIndex, endIndex);

        contentArea.innerHTML = `
            <div class="users-content fade-in">
                <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 class="h2">Users Management</h1>
                    <div class="btn-toolbar mb-2 mb-md-0">
                        <div class="btn-group me-2">
                            <button type="button" class="btn btn-sm btn-primary" id="addUserBtn">
                                <i class="fas fa-plus"></i> Add User
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-secondary" id="exportUsersBtn">
                                <i class="fas fa-download"></i> Export CSV
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Search and Filter -->
                <div class="search-filter-container">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="input-group">
                                <span class="input-group-text"><i class="fas fa-search"></i></span>
                                <input type="text" class="form-control search-input" id="userSearchInput" placeholder="Search users..." autocomplete="off">
                            </div>
                        </div>
                        <div class="col-md-2">
                            <select class="form-select" id="membershipFilter">
                                <option value="">All Types</option>
                                <option value="Regular">Regular</option>
                                <option value="Premium">Premium</option>
                                <option value="Student">Student</option>
                            </select>
                        </div>
                        <div class="col-md-2">
                            <select class="form-select" id="statusFilter">
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <div class="col-md-2">
                            <select class="form-select" id="sortBySelect">
                                <option value="firstName">Sort by Name</option>
                                <option value="email">Sort by Email</option>
                                <option value="membershipDate">Sort by Join Date</option>
                                <option value="totalBooksRead">Sort by Books Read</option>
                            </select>
                        </div>
                        <div class="col-md-2">
                            <button class="btn btn-outline-secondary w-100" onclick="usersManager.resetFilters()">
                                <i class="fas fa-redo"></i> Reset
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Users Table -->
                <div class="table-container">
                    <div class="table-header">
                        <h5 class="table-title">Users List (${users.length} users)</h5>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Avatar</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Membership</th>
                                    <th>Status</th>
                                    <th>Books Read</th>
                                    <th>Borrowed</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${paginatedUsers.map(user => this.renderUserRow(user)).join('')}
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

    renderUserRow(user) {
        return `
            <tr>
                <td>
                    <img src="${user.avatar}" alt="${user.firstName}" class="rounded-circle" style="width: 40px; height: 40px; object-fit: cover;">
                </td>
                <td>
                    <div class="fw-bold">${user.firstName} ${user.lastName}</div>
                    <small class="text-muted">Member since ${new Date(user.membershipDate).toLocaleDateString()}</small>
                </td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>
                    <span class="badge bg-info">${user.membershipType}</span>
                </td>
                <td>
                    <span class="status-badge ${user.status}">${user.status}</span>
                </td>
                <td>
                    <div class="d-flex align-items-center">
                        <i class="fas fa-book text-primary me-1"></i>
                        <span>${user.totalBooksRead}</span>
                    </div>
                </td>
                <td>
                    <div class="d-flex align-items-center">
                        <i class="fas fa-hand-holding text-warning me-1"></i>
                        <span>${user.booksBorrowed}</span>
                    </div>
                </td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary action-btn" data-action="view" data-id="${user.id}" title="View Details">
                            <i class="fas fa-eye pointer-events-none"></i>
                        </button>
                        <button class="btn btn-outline-secondary action-btn" data-action="edit" data-id="${user.id}" title="Edit">
                            <i class="fas fa-edit pointer-events-none"></i>
                        </button>
                        <button class="btn btn-outline-danger action-btn" data-action="delete" data-id="${user.id}" title="Delete">
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
                <a class="page-link" href="#" onclick="usersManager.goToPage(${this.currentPage - 1})">Previous</a>
            </li>
        `;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                pagination += `
                    <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                        <a class="page-link" href="#" onclick="usersManager.goToPage(${i})">${i}</a>
                    </li>
                `;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                pagination += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
        }

        pagination += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="usersManager.goToPage(${this.currentPage + 1})">Next</a>
            </li>
        `;

        pagination += '</ul></nav></div>';
        return pagination;
    }

    getFilteredAndSortedUsers() {
        let users = [...libraryData.getUsers()];

        if (this.searchTerm) {
            users = users.filter(user =>
                user.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                user.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        }

        const membershipFilter = document.getElementById('membershipFilter')?.value;
        if (membershipFilter) {
            users = users.filter(user => user.membershipType === membershipFilter);
        }

        const statusFilter = document.getElementById('statusFilter')?.value;
        if (statusFilter) {
            users = users.filter(user => user.status === statusFilter);
        }

        users.sort((a, b) => {
            let aValue = a[this.sortBy];
            let bValue = b[this.sortBy];

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (this.sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return users;
    }

    setupEventListeners() {
        document.addEventListener('input', (e) => {
            if (e.target.id === 'userSearchInput') {
                if (this.searchTimeout) {
                    clearTimeout(this.searchTimeout);
                }

                this.showSearchLoading();

                this.searchTimeout = setTimeout(() => {
                    this.searchTerm = e.target.value;
                    this.currentPage = 1;
                    this.renderUsers();
                    this.hideSearchLoading();
                }, 300);
            }
        });

        ['membershipFilter', 'statusFilter'].forEach(id => {
            document.addEventListener('change', (e) => {
                if (e.target.id === id) {
                    this.currentPage = 1;
                    this.renderUsers();
                }
            });
        });

        document.addEventListener('change', (e) => {
            if (e.target.id === 'sortBySelect') {
                this.sortBy = e.target.value;
                this.renderUsers();
            }
        });
    }

    attachTableEventListeners() {
        // Add User Button
        const addUserBtn = document.getElementById('addUserBtn');
        if (addUserBtn) {
            addUserBtn.addEventListener('click', () => this.showAddUserModal());
        }

        // Export Button
        const exportBtn = document.getElementById('exportUsersBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportUsers());
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
                        this.viewUserDetails(id);
                        break;
                    case 'edit':
                        this.editUser(id);
                        break;
                    case 'delete':
                        this.deleteUser(id);
                        break;
                }
            });
        }

        const searchInput = document.getElementById('userSearchInput');
        const membershipFilter = document.getElementById('membershipFilter');
        const statusFilter = document.getElementById('statusFilter');
        const sortBySelect = document.getElementById('sortBySelect');

        if (searchInput) searchInput.value = this.searchTerm;
        if (membershipFilter) membershipFilter.value = document.getElementById('membershipFilter')?.value || '';
        if (statusFilter) statusFilter.value = document.getElementById('statusFilter')?.value || '';
        if (sortBySelect) sortBySelect.value = this.sortBy;
    }

    showSearchLoading() {
        const searchInput = document.getElementById('userSearchInput');
        if (searchInput) {
            searchInput.classList.add('search-loading');
        }
    }

    hideSearchLoading() {
        const searchInput = document.getElementById('userSearchInput');
        if (searchInput) {
            searchInput.classList.remove('search-loading');
        }
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderUsers();
    }

    resetFilters() {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        this.searchTerm = '';
        this.currentPage = 1;
        this.sortBy = 'firstName';
        this.sortOrder = 'asc';

        document.getElementById('userSearchInput').value = '';
        document.getElementById('membershipFilter').value = '';
        document.getElementById('statusFilter').value = '';
        document.getElementById('sortBySelect').value = 'firstName';

        this.renderUsers();
    }

    showAddUserModal() {
        const modalContent = this.renderUserForm();

        const modal = new bootstrap.Modal(document.getElementById('commonModal'));
        document.getElementById('modalTitle').textContent = 'Add New User';
        document.getElementById('modalBody').innerHTML = modalContent;
        modal.show();

        document.getElementById('userForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addUser();
        });
    }

    renderUserForm(user = null) {
        return `
            <form id="userForm">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="firstName" class="form-label">First Name *</label>
                        <input type="text" class="form-control" id="firstName" value="${user?.firstName || ''}" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="lastName" class="form-label">Last Name *</label>
                        <input type="text" class="form-control" id="lastName" value="${user?.lastName || ''}" required>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="email" class="form-label">Email *</label>
                        <input type="email" class="form-control" id="email" value="${user?.email || ''}" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="phone" class="form-label">Phone *</label>
                        <input type="tel" class="form-control" id="phone" value="${user?.phone || ''}" required>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label for="address" class="form-label">Address</label>
                    <input type="text" class="form-control" id="address" value="${user?.address || ''}">
                </div>
                
                <div class="row">
                    <div class="col-md-4 mb-3">
                        <label for="membershipType" class="form-label">Membership Type *</label>
                        <select class="form-select" id="membershipType" required>
                            <option value="Regular" ${user?.membershipType === 'Regular' ? 'selected' : ''}>Regular</option>
                            <option value="Premium" ${user?.membershipType === 'Premium' ? 'selected' : ''}>Premium</option>
                            <option value="Student" ${user?.membershipType === 'Student' ? 'selected' : ''}>Student</option>
                        </select>
                    </div>
                    <div class="col-md-4 mb-3">
                        <label for="status" class="form-label">Status *</label>
                        <select class="form-select" id="status" required>
                            <option value="active" ${user?.status === 'active' ? 'selected' : ''}>Active</option>
                            <option value="inactive" ${user?.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                        </select>
                    </div>
                    <div class="col-md-4 mb-3">
                        <label for="avatar" class="form-label">Avatar URL</label>
                        <input type="url" class="form-control" id="avatar" value="${user?.avatar || ''}" placeholder="https://example.com/avatar.jpg">
                    </div>
                </div>
                
                <div class="d-flex justify-content-end gap-2">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save me-2"></i>${user ? 'Update' : 'Add'} User
                    </button>
                </div>
            </form>
        `;
    }

    addUser() {
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            membershipType: document.getElementById('membershipType').value,
            status: document.getElementById('status').value,
            avatar: document.getElementById('avatar').value || `https://picsum.photos/seed/${Date.now()}/100/100`
        };

        const newUser = libraryData.addUser(formData);

        bootstrap.Modal.getInstance(document.getElementById('commonModal')).hide();
        authManager.showNotification(`User "${newUser.firstName} ${newUser.lastName}" added successfully!`, 'success');
        this.renderUsers();
    }

    viewUserDetails(userId) {
        const user = libraryData.findUser(userId);
        if (!user) return;

        const modalContent = `
            <div class="user-details">
                <div class="row">
                    <div class="col-md-4">
                        <img src="${user.avatar}" alt="${user.firstName}" class="img-fluid rounded-circle mb-3">
                    </div>
                    <div class="col-md-8">
                        <h4>${user.firstName} ${user.lastName}</h4>
                        <p class="text-muted">${user.email}</p>
                        
                        <div class="row mb-3">
                            <div class="col-6">
                                <strong>Phone:</strong> ${user.phone}
                            </div>
                            <div class="col-6">
                                <strong>Membership:</strong> ${user.membershipType}
                            </div>
                        </div>
                        
                        <div class="row mb-3">
                            <div class="col-6">
                                <strong>Status:</strong> 
                                <span class="status-badge ${user.status}">${user.status}</span>
                            </div>
                            <div class="col-6">
                                <strong>Member Since:</strong> ${new Date(user.membershipDate).toLocaleDateString()}
                            </div>
                        </div>
                        
                        <div class="row mb-3">
                            <div class="col-6">
                                <strong>Books Read:</strong> ${user.totalBooksRead}
                            </div>
                            <div class="col-6">
                                <strong>Currently Borrowed:</strong> ${user.booksBorrowed}
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <strong>Address:</strong><br>
                            ${user.address}
                        </div>
                        
                        <div class="d-flex gap-2">
                            <button class="btn btn-primary" onclick="usersManager.editUser(${user.id})">
                                <i class="fas fa-edit me-2"></i>Edit
                            </button>
                            <button class="btn btn-success" onclick="usersManager.exportUserPDF(${user.id})">
                                <i class="fas fa-file-pdf me-2"></i>Export PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const modal = new bootstrap.Modal(document.getElementById('commonModal'));
        document.getElementById('modalTitle').textContent = 'User Details';
        document.getElementById('modalBody').innerHTML = modalContent;
        modal.show();
    }

    editUser(userId) {
        const user = libraryData.findUser(userId);
        if (!user) return;

        const modalContent = this.renderUserForm(user);

        const modal = new bootstrap.Modal(document.getElementById('commonModal'));
        document.getElementById('modalTitle').textContent = 'Edit User';
        document.getElementById('modalBody').innerHTML = modalContent;
        modal.show();

        document.getElementById('userForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateUser(userId);
        });
    }

    updateUser(userId) {
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            membershipType: document.getElementById('membershipType').value,
            status: document.getElementById('status').value,
            avatar: document.getElementById('avatar').value
        };

        const updatedUser = libraryData.updateUser(userId, formData);

        if (updatedUser) {
            bootstrap.Modal.getInstance(document.getElementById('commonModal')).hide();
            authManager.showNotification(`User "${updatedUser.firstName} ${updatedUser.lastName}" updated successfully!`, 'success');
            this.renderUsers();
        }
    }

    deleteUser(userId) {
        const user = libraryData.findUser(userId);
        if (!user) return;

        if (confirm(`Are you sure you want to delete "${user.firstName} ${user.lastName}"? This action cannot be undone.`)) {
            const success = libraryData.deleteUser(userId);

            if (success) {
                authManager.showNotification(`User "${user.firstName} ${user.lastName}" deleted successfully!`, 'success');
                this.renderUsers();
            } else {
                authManager.showNotification('Failed to delete user', 'danger');
            }
        }
    }

    exportUsers() {
        const users = this.getFilteredAndSortedUsers();
        let csv = 'First Name,Last Name,Email,Phone,Address,Membership Type,Status,Member Since,Books Read,Borrowed Books\n';

        users.forEach(user => {
            csv += `"${user.firstName}","${user.lastName}","${user.email}","${user.phone}","${user.address}","${user.membershipType}","${user.status}","${user.membershipDate}",${user.totalBooksRead},${user.booksBorrowed}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        authManager.showNotification('Users exported successfully', 'success');
    }

    exportUserPDF(userId) {
        const user = libraryData.findUser(userId);
        if (!user) return;

        let pdfContent = `User Details\n\n`;
        pdfContent += `Name: ${user.firstName} ${user.lastName}\n`;
        pdfContent += `Email: ${user.email}\n`;
        pdfContent += `Phone: ${user.phone}\n`;
        pdfContent += `Address: ${user.address}\n`;
        pdfContent += `Membership Type: ${user.membershipType}\n`;
        pdfContent += `Status: ${user.status}\n`;
        pdfContent += `Member Since: ${user.membershipDate}\n`;
        pdfContent += `Books Read: ${user.totalBooksRead}\n`;
        pdfContent += `Borrowed Books: ${user.booksBorrowed}\n`;

        const blob = new Blob([pdfContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${user.firstName}_${user.lastName}_details.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        authManager.showNotification(`User details exported for "${user.firstName} ${user.lastName}"`, 'success');
    }
}

// Initialize users manager when needed
let usersManager;

// Global functions for onclick events
window.editUser = function (userId) {
    if (usersManager) {
        usersManager.editUser(userId);
    }
};

window.deleteUser = function (userId) {
    if (usersManager) {
        usersManager.deleteUser(userId);
    }
};

window.viewUserDetails = function (userId) {
    if (usersManager) {
        usersManager.viewUserDetails(userId);
    }
};
