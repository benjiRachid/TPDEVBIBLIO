// Authors CRUD Module
class AuthorsManager {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.searchTerm = '';
        this.sortBy = 'name';
        this.sortOrder = 'asc';
        this.searchTimeout = null;
        this.init();
    }

    init() {
        this.renderAuthors();
        this.setupEventListeners();
    }

    renderAuthors() {
        const contentArea = document.getElementById('contentArea');
        const authors = this.getFilteredAndSortedAuthors();
        const totalPages = Math.ceil(authors.length / this.itemsPerPage);
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const paginatedAuthors = authors.slice(startIndex, endIndex);

        contentArea.innerHTML = `
            <div class="authors-content fade-in">
                <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 class="h2">Authors Management</h1>
                    <div class="btn-toolbar mb-2 mb-md-0">
                        <div class="btn-group me-2">
                            <button type="button" class="btn btn-sm btn-primary" onclick="authorsManager.showAddAuthorModal()">
                                <i class="fas fa-plus"></i> Add Author
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-secondary" onclick="authorsManager.exportAuthors()">
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
                                <input type="text" class="form-control search-input" id="authorSearchInput" placeholder="Search authors..." autocomplete="off">
                            </div>
                        </div>
                        <div class="col-md-2">
                            <select class="form-select" id="nationalityFilter">
                                <option value="">All Nationalities</option>
                                <option value="American">American</option>
                                <option value="British">British</option>
                                <option value="Colombian">Colombian</option>
                            </select>
                        </div>
                        <div class="col-md-2">
                            <select class="form-select" id="sortBySelect">
                                <option value="name">Sort by Name</option>
                                <option value="birthYear">Sort by Birth Year</option>
                                <option value="booksCount">Sort by Books Count</option>
                                <option value="nationality">Sort by Nationality</option>
                            </select>
                        </div>
                        <div class="col-md-2">
                            <select class="form-select" id="statusFilter">
                                <option value="">All</option>
                                <option value="living">Living</option>
                                <option value="deceased">Deceased</option>
                            </select>
                        </div>
                        <div class="col-md-2">
                            <button class="btn btn-outline-secondary w-100" onclick="authorsManager.resetFilters()">
                                <i class="fas fa-redo"></i> Reset
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Authors Table -->
                <div class="table-container">
                    <div class="table-header">
                        <h5 class="table-title">Authors List (${authors.length} authors)</h5>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Photo</th>
                                    <th>Name</th>
                                    <th>Nationality</th>
                                    <th>Lifespan</th>
                                    <th>Books</th>
                                    <th>Awards</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${paginatedAuthors.map(author => this.renderAuthorRow(author)).join('')}
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

    renderAuthorRow(author) {
        const lifespan = author.deathYear ? 
            `${author.birthYear} - ${author.deathYear}` : 
            `${author.birthYear} - Present`;
        
        const status = author.deathYear ? 'deceased' : 'living';
        
        return `
            <tr>
                <td>
                    <img src="${author.photo}" alt="${author.name}" class="rounded-circle" style="width: 40px; height: 40px; object-fit: cover;">
                </td>
                <td>
                    <div class="fw-bold">${author.name}</div>
                    <small class="text-muted">${author.biography ? author.biography.substring(0, 50) + '...' : ''}</small>
                </td>
                <td>
                    <span class="badge bg-secondary">${author.nationality}</span>
                </td>
                <td>
                    <small>${lifespan}</small>
                </td>
                <td>
                    <div class="d-flex align-items-center">
                        <i class="fas fa-book text-primary me-1"></i>
                        <span>${author.booksCount || 0}</span>
                    </div>
                </td>
                <td>
                    <div class="d-flex align-items-center">
                        <i class="fas fa-trophy text-warning me-1"></i>
                        <span>${author.awards ? author.awards.length : 0}</span>
                    </div>
                </td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="authorsManager.viewAuthorDetails(${author.id})" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-outline-secondary" onclick="authorsManager.editAuthor(${author.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="authorsManager.deleteAuthor(${author.id})" title="Delete">
                            <i class="fas fa-trash"></i>
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
                <a class="page-link" href="#" onclick="authorsManager.goToPage(${this.currentPage - 1})">Previous</a>
            </li>
        `;
        
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                pagination += `
                    <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                        <a class="page-link" href="#" onclick="authorsManager.goToPage(${i})">${i}</a>
                    </li>
                `;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                pagination += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
        }
        
        pagination += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="authorsManager.goToPage(${this.currentPage + 1})">Next</a>
            </li>
        `;
        
        pagination += '</ul></nav></div>';
        return pagination;
    }

    getFilteredAndSortedAuthors() {
        let authors = [...libraryData.getAuthors()];
        
        if (this.searchTerm) {
            authors = authors.filter(author => 
                author.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                author.nationality.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        }
        
        const nationalityFilter = document.getElementById('nationalityFilter')?.value;
        if (nationalityFilter) {
            authors = authors.filter(author => author.nationality === nationalityFilter);
        }
        
        const statusFilter = document.getElementById('statusFilter')?.value;
        if (statusFilter) {
            authors = authors.filter(author => {
                if (statusFilter === 'living') return !author.deathYear;
                if (statusFilter === 'deceased') return author.deathYear;
                return true;
            });
        }
        
        authors.sort((a, b) => {
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
        
        return authors;
    }

    setupEventListeners() {
        document.addEventListener('input', (e) => {
            if (e.target.id === 'authorSearchInput') {
                if (this.searchTimeout) {
                    clearTimeout(this.searchTimeout);
                }
                
                this.showSearchLoading();
                
                this.searchTimeout = setTimeout(() => {
                    this.searchTerm = e.target.value;
                    this.currentPage = 1;
                    this.renderAuthors();
                    this.hideSearchLoading();
                }, 300);
            }
        });

        ['nationalityFilter', 'statusFilter'].forEach(id => {
            document.addEventListener('change', (e) => {
                if (e.target.id === id) {
                    this.currentPage = 1;
                    this.renderAuthors();
                }
            });
        });

        document.addEventListener('change', (e) => {
            if (e.target.id === 'sortBySelect') {
                this.sortBy = e.target.value;
                this.renderAuthors();
            }
        });
    }

    attachTableEventListeners() {
        const searchInput = document.getElementById('authorSearchInput');
        const nationalityFilter = document.getElementById('nationalityFilter');
        const statusFilter = document.getElementById('statusFilter');
        const sortBySelect = document.getElementById('sortBySelect');

        if (searchInput) searchInput.value = this.searchTerm;
        if (nationalityFilter) nationalityFilter.value = document.getElementById('nationalityFilter')?.value || '';
        if (statusFilter) statusFilter.value = document.getElementById('statusFilter')?.value || '';
        if (sortBySelect) sortBySelect.value = this.sortBy;
    }

    showSearchLoading() {
        const searchInput = document.getElementById('authorSearchInput');
        if (searchInput) {
            searchInput.classList.add('search-loading');
        }
    }

    hideSearchLoading() {
        const searchInput = document.getElementById('authorSearchInput');
        if (searchInput) {
            searchInput.classList.remove('search-loading');
        }
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderAuthors();
    }

    resetFilters() {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        
        this.searchTerm = '';
        this.currentPage = 1;
        this.sortBy = 'name';
        this.sortOrder = 'asc';
        
        document.getElementById('authorSearchInput').value = '';
        document.getElementById('nationalityFilter').value = '';
        document.getElementById('statusFilter').value = '';
        document.getElementById('sortBySelect').value = 'name';
        
        this.renderAuthors();
    }

    showAddAuthorModal() {
        const modalContent = this.renderAuthorForm();
        
        const modal = new bootstrap.Modal(document.getElementById('commonModal'));
        document.getElementById('modalTitle').textContent = 'Add New Author';
        document.getElementById('modalBody').innerHTML = modalContent;
        modal.show();
        
        document.getElementById('authorForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addAuthor();
        });
    }

    renderAuthorForm(author = null) {
        return `
            <form id="authorForm">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="name" class="form-label">Name *</label>
                        <input type="text" class="form-control" id="name" value="${author?.name || ''}" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="nationality" class="form-label">Nationality *</label>
                        <input type="text" class="form-control" id="nationality" value="${author?.nationality || ''}" required>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="birthYear" class="form-label">Birth Year *</label>
                        <input type="number" class="form-control" id="birthYear" value="${author?.birthYear || ''}" min="1000" max="${new Date().getFullYear()}" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="deathYear" class="form-label">Death Year (if applicable)</label>
                        <input type="number" class="form-control" id="deathYear" value="${author?.deathYear || ''}" min="1000" max="${new Date().getFullYear()}">
                    </div>
                </div>
                
                <div class="mb-3">
                    <label for="biography" class="form-label">Biography</label>
                    <textarea class="form-control" id="biography" rows="4">${author?.biography || ''}</textarea>
                </div>
                
                <div class="mb-3">
                    <label for="awards" class="form-label">Awards (comma separated)</label>
                    <input type="text" class="form-control" id="awards" value="${author?.awards ? author.awards.join(', ') : ''}" placeholder="Pulitzer Prize, Nobel Prize">
                </div>
                
                <div class="mb-3">
                    <label for="photo" class="form-label">Photo URL</label>
                    <input type="url" class="form-control" id="photo" value="${author?.photo || ''}" placeholder="https://example.com/photo.jpg">
                </div>
                
                <div class="d-flex justify-content-end gap-2">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save me-2"></i>${author ? 'Update' : 'Add'} Author
                    </button>
                </div>
            </form>
        `;
    }

    addAuthor() {
        const formData = {
            name: document.getElementById('name').value,
            nationality: document.getElementById('nationality').value,
            birthYear: parseInt(document.getElementById('birthYear').value),
            deathYear: document.getElementById('deathYear').value ? parseInt(document.getElementById('deathYear').value) : null,
            biography: document.getElementById('biography').value,
            awards: document.getElementById('awards').value.split(',').map(award => award.trim()).filter(award => award),
            photo: document.getElementById('photo').value || `https://picsum.photos/seed/${Date.now()}/150/150`
        };

        const newAuthor = libraryData.addAuthor(formData);
        
        bootstrap.Modal.getInstance(document.getElementById('commonModal')).hide();
        authManager.showNotification(`Author "${newAuthor.name}" added successfully!`, 'success');
        this.renderAuthors();
    }

    viewAuthorDetails(authorId) {
        const author = libraryData.findAuthor(authorId);
        if (!author) return;

        const lifespan = author.deathYear ? 
            `${author.birthYear} - ${author.deathYear}` : 
            `${author.birthYear} - Present`;

        const modalContent = `
            <div class="author-details">
                <div class="row">
                    <div class="col-md-4">
                        <img src="${author.photo}" alt="${author.name}" class="img-fluid rounded-circle mb-3">
                    </div>
                    <div class="col-md-8">
                        <h4>${author.name}</h4>
                        <p class="text-muted">${author.nationality} Author</p>
                        
                        <div class="row mb-3">
                            <div class="col-6">
                                <strong>Lifespan:</strong> ${lifespan}
                            </div>
                            <div class="col-6">
                                <strong>Age:</strong> ${author.deathYear ? author.deathYear - author.birthYear : new Date().getFullYear() - author.birthYear}
                            </div>
                        </div>
                        
                        <div class="row mb-3">
                            <div class="col-6">
                                <strong>Books Count:</strong> ${author.booksCount || 0}
                            </div>
                            <div class="col-6">
                                <strong>Awards:</strong> ${author.awards ? author.awards.length : 0}
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <strong>Biography:</strong>
                            <p>${author.biography || 'No biography available.'}</p>
                        </div>
                        
                        ${author.awards && author.awards.length > 0 ? `
                            <div class="mb-3">
                                <strong>Awards:</strong>
                                <ul>
                                    ${author.awards.map(award => `<li>${award}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                        
                        <div class="d-flex gap-2">
                            <button class="btn btn-primary" onclick="authorsManager.editAuthor(${author.id})">
                                <i class="fas fa-edit me-2"></i>Edit
                            </button>
                            <button class="btn btn-success" onclick="authorsManager.exportAuthorPDF(${author.id})">
                                <i class="fas fa-file-pdf me-2"></i>Export PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const modal = new bootstrap.Modal(document.getElementById('commonModal'));
        document.getElementById('modalTitle').textContent = 'Author Details';
        document.getElementById('modalBody').innerHTML = modalContent;
        modal.show();
    }

    editAuthor(authorId) {
        const author = libraryData.findAuthor(authorId);
        if (!author) return;

        const modalContent = this.renderAuthorForm(author);
        
        const modal = new bootstrap.Modal(document.getElementById('commonModal'));
        document.getElementById('modalTitle').textContent = 'Edit Author';
        document.getElementById('modalBody').innerHTML = modalContent;
        modal.show();
        
        document.getElementById('authorForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateAuthor(authorId);
        });
    }

    updateAuthor(authorId) {
        const formData = {
            name: document.getElementById('name').value,
            nationality: document.getElementById('nationality').value,
            birthYear: parseInt(document.getElementById('birthYear').value),
            deathYear: document.getElementById('deathYear').value ? parseInt(document.getElementById('deathYear').value) : null,
            biography: document.getElementById('biography').value,
            awards: document.getElementById('awards').value.split(',').map(award => award.trim()).filter(award => award),
            photo: document.getElementById('photo').value
        };

        const updatedAuthor = libraryData.updateAuthor(authorId, formData);
        
        if (updatedAuthor) {
            bootstrap.Modal.getInstance(document.getElementById('commonModal')).hide();
            authManager.showNotification(`Author "${updatedAuthor.name}" updated successfully!`, 'success');
            this.renderAuthors();
        }
    }

    deleteAuthor(authorId) {
        const author = libraryData.findAuthor(authorId);
        if (!author) return;

        if (confirm(`Are you sure you want to delete "${author.name}"? This action cannot be undone.`)) {
            const success = libraryData.deleteAuthor(authorId);
            
            if (success) {
                authManager.showNotification(`Author "${author.name}" deleted successfully!`, 'success');
                this.renderAuthors();
            } else {
                authManager.showNotification('Failed to delete author', 'danger');
            }
        }
    }

    exportAuthors() {
        const authors = this.getFilteredAndSortedAuthors();
        let csv = 'Name,Nationality,Birth Year,Death Year,Biography,Awards,Books Count\n';
        
        authors.forEach(author => {
            csv += `"${author.name}","${author.nationality}",${author.birthYear},${author.deathYear || ''},"${author.biography || ''}","${author.awards ? author.awards.join('; ') : ''}",${author.booksCount || 0}\n`;
        });
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `authors_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        authManager.showNotification('Authors exported successfully', 'success');
    }

    exportAuthorPDF(authorId) {
        const author = libraryData.findAuthor(authorId);
        if (!author) return;

        const lifespan = author.deathYear ? 
            `${author.birthYear} - ${author.deathYear}` : 
            `${author.birthYear} - Present`;

        let pdfContent = `Author Details\n\n`;
        pdfContent += `Name: ${author.name}\n`;
        pdfContent += `Nationality: ${author.nationality}\n`;
        pdfContent += `Lifespan: ${lifespan}\n`;
        pdfContent += `Biography: ${author.biography || 'No biography available.'}\n`;
        pdfContent += `Books Count: ${author.booksCount || 0}\n`;
        pdfContent += `Awards: ${author.awards ? author.awards.join(', ') : 'None'}\n`;

        const blob = new Blob([pdfContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${author.name.replace(/[^a-z0-9]/gi, '_')}_details.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        authManager.showNotification(`Author details exported for "${author.name}"`, 'success');
    }
}

// Initialize authors manager when needed
let authorsManager;

// Global functions for onclick events
window.editAuthor = function(authorId) {
    if (authorsManager) {
        authorsManager.editAuthor(authorId);
    }
};

window.deleteAuthor = function(authorId) {
    if (authorsManager) {
        authorsManager.deleteAuthor(authorId);
    }
};

window.viewAuthorDetails = function(authorId) {
    if (authorsManager) {
        authorsManager.viewAuthorDetails(authorId);
    }
};
