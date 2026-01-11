// Categories CRUD Module
class CategoriesManager {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 20;
        this.searchTerm = '';
        this.sortBy = 'name';
        this.sortOrder = 'asc';
        this.searchTimeout = null;
        this.init();
    }

    init() {
        this.renderCategories();
        this.setupEventListeners();
    }

    renderCategories() {
        const contentArea = document.getElementById('contentArea');
        const categories = this.getFilteredAndSortedCategories();

        contentArea.innerHTML = `
            <div class="categories-content fade-in">
                <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 class="h2">Categories Management</h1>
                    <div class="btn-toolbar mb-2 mb-md-0">
                        <div class="btn-group me-2">
                            <button type="button" class="btn btn-sm btn-primary" onclick="categoriesManager.showAddCategoryModal()">
                                <i class="fas fa-plus"></i> Add Category
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-secondary" onclick="categoriesManager.exportCategories()">
                                <i class="fas fa-download"></i> Export CSV
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Search -->
                <div class="search-filter-container">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="input-group">
                                <span class="input-group-text"><i class="fas fa-search"></i></span>
                                <input type="text" class="form-control search-input" id="categorySearchInput" placeholder="Search categories..." autocomplete="off">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <select class="form-select" id="sortBySelect">
                                <option value="name">Sort by Name</option>
                                <option value="id">Sort by ID</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <button class="btn btn-outline-secondary w-100" onclick="categoriesManager.resetFilters()">
                                <i class="fas fa-redo"></i> Reset
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Categories Grid -->
                <div class="row">
                    ${categories.map(category => this.renderCategoryCard(category)).join('')}
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    renderCategoryCard(category) {
        const bookCount = libraryData.getBooks().filter(book => book.categoryId === category.id).length;
        
        return `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card h-100">
                    <div class="card-header d-flex justify-content-between align-items-center" style="background-color: ${category.color}20; border-left: 4px solid ${category.color};">
                        <h5 class="card-title mb-0">
                            <span class="badge" style="background-color: ${category.color};">
                                <i class="fas fa-tag me-1"></i>${category.name}
                            </span>
                        </h5>
                        <div class="dropdown">
                            <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="#" onclick="categoriesManager.editCategory(${category.id})">
                                    <i class="fas fa-edit me-2"></i>Edit
                                </a></li>
                                <li><a class="dropdown-item" href="#" onclick="categoriesManager.deleteCategory(${category.id})">
                                    <i class="fas fa-trash me-2"></i>Delete
                                </a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="card-body">
                        <p class="card-text">${category.description}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="text-muted">
                                <i class="fas fa-book me-1"></i>
                                <span>${bookCount} books</span>
                            </div>
                            <div class="d-flex gap-2">
                                <button class="btn btn-sm btn-outline-primary" onclick="categoriesManager.viewCategoryDetails(${category.id})" title="View Details">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-info" onclick="categoriesManager.viewBooksInCategory(${category.id})" title="View Books">
                                    <i class="fas fa-book"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getFilteredAndSortedCategories() {
        let categories = [...libraryData.getCategories()];
        
        if (this.searchTerm) {
            categories = categories.filter(category => 
                category.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                category.description.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        }
        
        categories.sort((a, b) => {
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
        
        return categories;
    }

    setupEventListeners() {
        document.addEventListener('input', (e) => {
            if (e.target.id === 'categorySearchInput') {
                if (this.searchTimeout) {
                    clearTimeout(this.searchTimeout);
                }
                
                this.showSearchLoading();
                
                this.searchTimeout = setTimeout(() => {
                    this.searchTerm = e.target.value;
                    this.renderCategories();
                    this.hideSearchLoading();
                }, 300);
            }
        });

        document.addEventListener('change', (e) => {
            if (e.target.id === 'sortBySelect') {
                this.sortBy = e.target.value;
                this.renderCategories();
            }
        });
    }

    attachEventListeners() {
        const searchInput = document.getElementById('categorySearchInput');
        const sortBySelect = document.getElementById('sortBySelect');

        if (searchInput) searchInput.value = this.searchTerm;
        if (sortBySelect) sortBySelect.value = this.sortBy;
    }

    showSearchLoading() {
        const searchInput = document.getElementById('categorySearchInput');
        if (searchInput) {
            searchInput.classList.add('search-loading');
        }
    }

    hideSearchLoading() {
        const searchInput = document.getElementById('categorySearchInput');
        if (searchInput) {
            searchInput.classList.remove('search-loading');
        }
    }

    resetFilters() {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        
        this.searchTerm = '';
        this.sortBy = 'name';
        this.sortOrder = 'asc';
        
        document.getElementById('categorySearchInput').value = '';
        document.getElementById('sortBySelect').value = 'name';
        
        this.renderCategories();
    }

    showAddCategoryModal() {
        const modalContent = this.renderCategoryForm();
        
        const modal = new bootstrap.Modal(document.getElementById('commonModal'));
        document.getElementById('modalTitle').textContent = 'Add New Category';
        document.getElementById('modalBody').innerHTML = modalContent;
        modal.show();
        
        document.getElementById('categoryForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addCategory();
        });
    }

    renderCategoryForm(category = null) {
        return `
            <form id="categoryForm">
                <div class="mb-3">
                    <label for="name" class="form-label">Category Name *</label>
                    <input type="text" class="form-control" id="name" value="${category?.name || ''}" required>
                </div>
                
                <div class="mb-3">
                    <label for="description" class="form-label">Description</label>
                    <textarea class="form-control" id="description" rows="3">${category?.description || ''}</textarea>
                </div>
                
                <div class="mb-3">
                    <label for="color" class="form-label">Color *</label>
                    <div class="row">
                        <div class="col-md-8">
                            <input type="color" class="form-control form-control-color" id="color" value="${category?.color || '#007bff'}" required>
                        </div>
                        <div class="col-md-4">
                            <input type="text" class="form-control" id="colorText" value="${category?.color || '#007bff'}" placeholder="#000000">
                        </div>
                    </div>
                    <small class="form-text text-muted">Choose a color to represent this category</small>
                </div>
                
                <div class="d-flex justify-content-end gap-2">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save me-2"></i>${category ? 'Update' : 'Add'} Category
                    </button>
                </div>
            </form>
        `;
    }

    addCategory() {
        const formData = {
            name: document.getElementById('name').value,
            description: document.getElementById('description').value,
            color: document.getElementById('color').value
        };

        const newCategory = {
            id: Math.max(...libraryData.getCategories().map(c => c.id)) + 1,
            ...formData
        };

        libraryData.categories.push(newCategory);
        
        bootstrap.Modal.getInstance(document.getElementById('commonModal')).hide();
        authManager.showNotification(`Category "${newCategory.name}" added successfully!`, 'success');
        this.renderCategories();
    }

    viewCategoryDetails(categoryId) {
        const category = libraryData.findCategory(categoryId);
        if (!category) return;

        const bookCount = libraryData.getBooks().filter(book => book.categoryId === category.id).length;
        const booksInCategory = libraryData.getBooks().filter(book => book.categoryId === category.id);

        const modalContent = `
            <div class="category-details">
                <div class="text-center mb-4">
                    <span class="badge p-3" style="background-color: ${category.color}; font-size: 1.2rem;">
                        <i class="fas fa-tag me-2"></i>${category.name}
                    </span>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <h6>Category Information</h6>
                        <p><strong>Name:</strong> ${category.name}</p>
                        <p><strong>Description:</strong> ${category.description}</p>
                        <p><strong>Color:</strong> 
                            <span class="badge" style="background-color: ${category.color};">
                                ${category.color}
                            </span>
                        </p>
                        <p><strong>Total Books:</strong> ${bookCount}</p>
                    </div>
                    
                    <div class="col-md-6">
                        <h6>Recent Books in this Category</h6>
                        <div class="list-group">
                            ${booksInCategory.slice(0, 5).map(book => `
                                <a href="#" class="list-group-item list-group-item-action" onclick="window.app.loadPage('books'); booksManager.viewBookDetails(${book.id})">
                                    <div class="d-flex w-100 justify-content-between">
                                        <h6 class="mb-1">${book.title}</h6>
                                        <small>${book.author}</small>
                                    </div>
                                </a>
                            `).join('')}
                            ${booksInCategory.length > 5 ? `<small class="text-muted">...and ${booksInCategory.length - 5} more</small>` : ''}
                        </div>
                    </div>
                </div>
                
                <div class="d-flex gap-2 mt-3">
                    <button class="btn btn-primary" onclick="categoriesManager.editCategory(${category.id})">
                        <i class="fas fa-edit me-2"></i>Edit Category
                    </button>
                    <button class="btn btn-info" onclick="categoriesManager.viewBooksInCategory(${category.id})">
                        <i class="fas fa-book me-2"></i>View All Books
                    </button>
                    <button class="btn btn-success" onclick="categoriesManager.exportCategoryPDF(${category.id})">
                        <i class="fas fa-file-pdf me-2"></i>Export PDF
                    </button>
                </div>
            </div>
        `;

        const modal = new bootstrap.Modal(document.getElementById('commonModal'));
        document.getElementById('modalTitle').textContent = 'Category Details';
        document.getElementById('modalBody').innerHTML = modalContent;
        modal.show();
    }

    viewBooksInCategory(categoryId) {
        const category = libraryData.findCategory(categoryId);
        if (!category) return;

        // Close modal and navigate to books page with filter
        bootstrap.Modal.getInstance(document.getElementById('commonModal')).hide();
        window.app.loadPage('books');
        
        // Set filter after a short delay to ensure books page is loaded
        setTimeout(() => {
            const categoryFilter = document.getElementById('categoryFilter');
            if (categoryFilter) {
                categoryFilter.value = categoryId;
                categoryFilter.dispatchEvent(new Event('change'));
            }
        }, 500);
    }

    editCategory(categoryId) {
        const category = libraryData.findCategory(categoryId);
        if (!category) return;

        const modalContent = this.renderCategoryForm(category);
        
        const modal = new bootstrap.Modal(document.getElementById('commonModal'));
        document.getElementById('modalTitle').textContent = 'Edit Category';
        document.getElementById('modalBody').innerHTML = modalContent;
        modal.show();
        
        // Sync color inputs
        document.getElementById('color').addEventListener('input', (e) => {
            document.getElementById('colorText').value = e.target.value;
        });
        
        document.getElementById('colorText').addEventListener('input', (e) => {
            document.getElementById('color').value = e.target.value;
        });
        
        document.getElementById('categoryForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateCategory(categoryId);
        });
    }

    updateCategory(categoryId) {
        const category = libraryData.findCategory(categoryId);
        if (!category) return;

        const updatedCategory = {
            ...category,
            name: document.getElementById('name').value,
            description: document.getElementById('description').value,
            color: document.getElementById('color').value
        };

        const index = libraryData.categories.findIndex(c => c.id === categoryId);
        if (index !== -1) {
            libraryData.categories[index] = updatedCategory;
        }

        bootstrap.Modal.getInstance(document.getElementById('commonModal')).hide();
        authManager.showNotification(`Category "${updatedCategory.name}" updated successfully!`, 'success');
        this.renderCategories();
    }

    deleteCategory(categoryId) {
        const category = libraryData.findCategory(categoryId);
        if (!category) return;

        const bookCount = libraryData.getBooks().filter(book => book.categoryId === categoryId).length;
        
        if (bookCount > 0) {
            authManager.showNotification(`Cannot delete category "${category.name}" because it contains ${bookCount} books. Please reassign or delete the books first.`, 'danger');
            return;
        }

        if (confirm(`Are you sure you want to delete category "${category.name}"? This action cannot be undone.`)) {
            const index = libraryData.categories.findIndex(c => c.id === categoryId);
            if (index !== -1) {
                libraryData.categories.splice(index, 1);
                authManager.showNotification(`Category "${category.name}" deleted successfully!`, 'success');
                this.renderCategories();
            }
        }
    }

    exportCategories() {
        const categories = this.getFilteredAndSortedCategories();
        let csv = 'Name,Description,Color,Book Count\n';
        
        categories.forEach(category => {
            const bookCount = libraryData.getBooks().filter(book => book.categoryId === category.id).length;
            csv += `"${category.name}","${category.description}","${category.color}",${bookCount}\n`;
        });
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `categories_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        authManager.showNotification('Categories exported successfully', 'success');
    }

    exportCategoryPDF(categoryId) {
        const category = libraryData.findCategory(categoryId);
        if (!category) return;

        const bookCount = libraryData.getBooks().filter(book => book.categoryId === category.id).length;

        let pdfContent = `Category Details\n\n`;
        pdfContent += `Name: ${category.name}\n`;
        pdfContent += `Description: ${category.description}\n`;
        pdfContent += `Color: ${category.color}\n`;
        pdfContent += `Book Count: ${bookCount}\n`;

        const blob = new Blob([pdfContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${category.name.replace(/[^a-z0-9]/gi, '_')}_details.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        authManager.showNotification(`Category details exported for "${category.name}"`, 'success');
    }
}

// Initialize categories manager when needed
let categoriesManager;

// Global functions for onclick events
window.editCategory = function(categoryId) {
    if (categoriesManager) {
        categoriesManager.editCategory(categoryId);
    }
};

window.deleteCategory = function(categoryId) {
    if (categoriesManager) {
        categoriesManager.deleteCategory(categoryId);
    }
};

window.viewCategoryDetails = function(categoryId) {
    if (categoriesManager) {
        categoriesManager.viewCategoryDetails(categoryId);
    }
};

window.viewBooksInCategory = function(categoryId) {
    if (categoriesManager) {
        categoriesManager.viewBooksInCategory(categoryId);
    }
};
