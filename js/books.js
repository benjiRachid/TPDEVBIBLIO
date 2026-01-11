// Books CRUD Module
class BooksManager {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.searchTerm = '';
        this.sortBy = 'title';
        this.sortOrder = 'asc';
        this.searchTimeout = null;
        this.init();
    }

    init() {
        this.renderBooks();
        this.setupEventListeners();
    }

    renderBooks() {
        const contentArea = document.getElementById('contentArea');
        const books = this.getFilteredAndSortedBooks();
        const totalPages = Math.ceil(books.length / this.itemsPerPage);
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const paginatedBooks = books.slice(startIndex, endIndex);

        contentArea.innerHTML = `
            <div class="books-content fade-in">
                <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 class="h2">Books Management</h1>
                    <div class="btn-toolbar mb-2 mb-md-0">
                        <div class="btn-group me-2">
                            <button type="button" class="btn btn-sm btn-primary" onclick="booksManager.showAddBookModal()">
                                <i class="fas fa-plus"></i> Add Book
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-secondary" onclick="booksManager.exportBooks()">
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
                                <input type="text" class="form-control search-input" id="bookSearchInput" placeholder="Search books..." autocomplete="off">
                            </div>
                        </div>
                        <div class="col-md-2">
                            <select class="form-select" id="categoryFilter">
                                <option value="">All Categories</option>
                                ${libraryData.getCategories().map(cat => 
                                    `<option value="${cat.id}">${cat.name}</option>`
                                ).join('')}
                            </select>
                        </div>
                        <div class="col-md-2">
                            <select class="form-select" id="statusFilter">
                                <option value="">All Status</option>
                                <option value="available">Available</option>
                                <option value="borrowed">Borrowed</option>
                            </select>
                        </div>
                        <div class="col-md-2">
                            <select class="form-select" id="sortBySelect">
                                <option value="title">Sort by Title</option>
                                <option value="author">Sort by Author</option>
                                <option value="publicationYear">Sort by Year</option>
                                <option value="availableCopies">Sort by Available</option>
                            </select>
                        </div>
                        <div class="col-md-2">
                            <button class="btn btn-outline-secondary w-100" onclick="booksManager.resetFilters()">
                                <i class="fas fa-redo"></i> Reset
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Books Table -->
                <div class="table-container">
                    <div class="table-header">
                        <h5 class="table-title">Books List (${books.length} books)</h5>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Cover</th>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>Category</th>
                                    <th>Year</th>
                                    <th>ISBN</th>
                                    <th>Available</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${paginatedBooks.map(book => this.renderBookRow(book)).join('')}
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- Pagination -->
                    ${totalPages > 1 ? this.renderPagination(totalPages) : ''}
                </div>
            </div>
        `;

        // Re-attach event listeners after rendering
        this.attachTableEventListeners();
    }

    renderBookRow(book) {
        const availablePercentage = (book.availableCopies / book.totalCopies) * 100;
        const statusColor = availablePercentage > 50 ? 'success' : availablePercentage > 20 ? 'warning' : 'danger';
        
        return `
            <tr>
                <td>
                    <img src="${book.coverImage}" alt="${book.title}" class="book-cover" style="width: 40px; height: 60px; object-fit: cover; border-radius: 4px;">
                </td>
                <td>
                    <div class="fw-bold">${book.title}</div>
                    <small class="text-muted">${book.pages} pages</small>
                </td>
                <td>${book.author}</td>
                <td>
                    <span class="badge" style="background-color: ${libraryData.findCategory(book.categoryId)?.color || '#6c757d'}">
                        ${book.category}
                    </span>
                </td>
                <td>${book.publicationYear}</td>
                <td>
                    <small>${book.isbn}</small>
                </td>
                <td>
                    <div class="progress" style="height: 20px;">
                        <div class="progress-bar bg-${statusColor}" style="width: ${availablePercentage}%">
                            ${book.availableCopies}/${book.totalCopies}
                        </div>
                    </div>
                </td>
                <td>
                    <span class="status-badge ${book.availableCopies > 0 ? 'active' : 'inactive'}">
                        ${book.availableCopies > 0 ? 'Available' : 'Borrowed'}
                    </span>
                </td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="booksManager.viewBookDetails(${book.id})" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-outline-success" onclick="booksManager.markAsRead(${book.id})" title="Mark as Read">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn btn-outline-info" onclick="booksManager.createLoan(${book.id})" title="Create Loan">
                            <i class="fas fa-hand-holding"></i>
                        </button>
                        <button class="btn btn-outline-secondary" onclick="booksManager.editBook(${book.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-success" onclick="booksManager.duplicateBook(${book.id})" title="Duplicate">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="booksManager.deleteBook(${book.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    renderPagination(totalPages) {
        let pagination = '<div class="pagination-container"><nav><ul class="pagination">';
        
        // Previous button
        pagination += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="booksManager.goToPage(${this.currentPage - 1})">Previous</a>
            </li>
        `;
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                pagination += `
                    <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                        <a class="page-link" href="#" onclick="booksManager.goToPage(${i})">${i}</a>
                    </li>
                `;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                pagination += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
        }
        
        // Next button
        pagination += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="booksManager.goToPage(${this.currentPage + 1})">Next</a>
            </li>
        `;
        
        pagination += '</ul></nav></div>';
        return pagination;
    }

    getFilteredAndSortedBooks() {
        let books = [...libraryData.getBooks()];
        
        // Apply search filter
        if (this.searchTerm) {
            books = books.filter(book => 
                book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                book.isbn.includes(this.searchTerm)
            );
        }
        
        // Apply category filter
        const categoryFilter = document.getElementById('categoryFilter')?.value;
        if (categoryFilter) {
            books = books.filter(book => book.categoryId == categoryFilter);
        }
        
        // Apply status filter
        const statusFilter = document.getElementById('statusFilter')?.value;
        if (statusFilter) {
            books = books.filter(book => {
                if (statusFilter === 'available') return book.availableCopies > 0;
                if (statusFilter === 'borrowed') return book.availableCopies === 0;
                return true;
            });
        }
        
        // Apply sorting
        books.sort((a, b) => {
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
        
        return books;
    }

    setupEventListeners() {
        // Search input with debouncing
        document.addEventListener('input', (e) => {
            if (e.target.id === 'bookSearchInput') {
                // Clear existing timeout
                if (this.searchTimeout) {
                    clearTimeout(this.searchTimeout);
                }
                
                // Show loading indicator
                this.showSearchLoading();
                
                // Set new timeout for debounced search
                this.searchTimeout = setTimeout(() => {
                    this.searchTerm = e.target.value;
                    this.currentPage = 1;
                    this.renderBooks();
                    this.hideSearchLoading();
                }, 300); // Wait 300ms after user stops typing
            }
        });

        // Category filter
        document.addEventListener('change', (e) => {
            if (e.target.id === 'categoryFilter') {
                this.currentPage = 1;
                this.renderBooks();
            }
        });

        // Status filter
        document.addEventListener('change', (e) => {
            if (e.target.id === 'statusFilter') {
                this.currentPage = 1;
                this.renderBooks();
            }
        });

        // Sort select
        document.addEventListener('change', (e) => {
            if (e.target.id === 'sortBySelect') {
                this.sortBy = e.target.value;
                this.renderBooks();
            }
        });
    }

    attachTableEventListeners() {
        // Re-attach listeners after DOM update
        const searchInput = document.getElementById('bookSearchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const statusFilter = document.getElementById('statusFilter');
        const sortBySelect = document.getElementById('sortBySelect');

        if (searchInput) searchInput.value = this.searchTerm;
        if (categoryFilter) categoryFilter.value = document.getElementById('categoryFilter')?.value || '';
        if (statusFilter) statusFilter.value = document.getElementById('statusFilter')?.value || '';
        if (sortBySelect) sortBySelect.value = this.sortBy;
    }

    showSearchLoading() {
        const searchInput = document.getElementById('bookSearchInput');
        if (searchInput) {
            searchInput.classList.add('search-loading');
            searchInput.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'20\' height=\'20\' viewBox=\'0 0 24 24\'%3E%3Cstyle%3E.spinner %7B animation: spin 1s linear infinite; %7D @keyframes spin %7B from %7B transform: rotate(0deg); %7B to %7B transform: rotate(360deg); %7B %7D %3C/style%3E%3Ccircle class=\'spinner\' cx=\'12\' cy=\'12\' r=\'10\' fill=\'none\' stroke=\'%23007bff\' stroke-width=\'2\' stroke-dasharray=\'31.416\' stroke-dashoffset=\'31.416\'%3E%3C/circle%3E%3C/svg%3E")';
            searchInput.style.backgroundRepeat = 'no-repeat';
            searchInput.style.backgroundPosition = 'right 10px center';
            searchInput.style.paddingRight = '40px';
        }
    }

    hideSearchLoading() {
        const searchInput = document.getElementById('bookSearchInput');
        if (searchInput) {
            searchInput.classList.remove('search-loading');
            searchInput.style.backgroundImage = 'none';
            searchInput.style.paddingRight = '12px';
        }
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderBooks();
    }

    resetFilters() {
        // Clear any pending search
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        
        this.searchTerm = '';
        this.currentPage = 1;
        this.sortBy = 'title';
        this.sortOrder = 'asc';
        
        // Reset form controls
        document.getElementById('bookSearchInput').value = '';
        document.getElementById('categoryFilter').value = '';
        document.getElementById('statusFilter').value = '';
        document.getElementById('sortBySelect').value = 'title';
        
        this.renderBooks();
    }

    showAddBookModal() {
        const modalContent = this.renderBookForm();
        
        const modal = new bootstrap.Modal(document.getElementById('commonModal'));
        document.getElementById('modalTitle').textContent = 'Add New Book';
        document.getElementById('modalBody').innerHTML = modalContent;
        modal.show();
        
        // Setup form submission
        document.getElementById('bookForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addBook();
        });
    }

    renderBookForm(book = null) {
        const categories = libraryData.getCategories();
        const authors = libraryData.getAuthors();
        
        return `
            <form id="bookForm">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="bookTitle" class="form-label">Title *</label>
                        <input type="text" class="form-control" id="bookTitle" value="${book?.title || ''}" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="bookAuthor" class="form-label">Author *</label>
                        <select class="form-select" id="bookAuthor" required>
                            <option value="">Select Author</option>
                            ${authors.map(author => 
                                `<option value="${author.id}" ${book?.authorId == author.id ? 'selected' : ''}>${author.name}</option>`
                            ).join('')}
                        </select>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-4 mb-3">
                        <label for="bookIsbn" class="form-label">ISBN</label>
                        <input type="text" class="form-control" id="bookIsbn" value="${book?.isbn || ''}">
                    </div>
                    <div class="col-md-4 mb-3">
                        <label for="bookCategory" class="form-label">Category *</label>
                        <select class="form-select" id="bookCategory" required>
                            <option value="">Select Category</option>
                            ${categories.map(cat => 
                                `<option value="${cat.id}" ${book?.categoryId == cat.id ? 'selected' : ''}>${cat.name}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="col-md-4 mb-3">
                        <label for="bookYear" class="form-label">Publication Year</label>
                        <input type="number" class="form-control" id="bookYear" value="${book?.publicationYear || ''}" min="1000" max="${new Date().getFullYear()}">
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-4 mb-3">
                        <label for="bookPublisher" class="form-label">Publisher</label>
                        <input type="text" class="form-control" id="bookPublisher" value="${book?.publisher || ''}">
                    </div>
                    <div class="col-md-4 mb-3">
                        <label for="bookPages" class="form-label">Pages</label>
                        <input type="number" class="form-control" id="bookPages" value="${book?.pages || ''}" min="1">
                    </div>
                    <div class="col-md-4 mb-3">
                        <label for="bookLanguage" class="form-label">Language</label>
                        <input type="text" class="form-control" id="bookLanguage" value="${book?.language || 'English'}">
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="bookTotalCopies" class="form-label">Total Copies *</label>
                        <input type="number" class="form-control" id="bookTotalCopies" value="${book?.totalCopies || 1}" min="1" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="bookCoverImage" class="form-label">Cover Image URL</label>
                        <input type="url" class="form-control" id="bookCoverImage" value="${book?.coverImage || ''}" placeholder="https://example.com/image.jpg">
                    </div>
                </div>
                
                <div class="mb-3">
                    <label for="bookDescription" class="form-label">Description</label>
                    <textarea class="form-control" id="bookDescription" rows="3">${book?.description || ''}</textarea>
                </div>
                
                <div class="d-flex justify-content-end gap-2">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save me-2"></i>${book ? 'Update' : 'Add'} Book
                    </button>
                </div>
            </form>
        `;
    }

    addBook() {
        const formData = {
            title: document.getElementById('bookTitle').value,
            authorId: parseInt(document.getElementById('bookAuthor').value),
            author: libraryData.findAuthor(document.getElementById('bookAuthor').value).name,
            isbn: document.getElementById('bookIsbn').value,
            categoryId: parseInt(document.getElementById('bookCategory').value),
            category: libraryData.findCategory(document.getElementById('bookCategory').value).name,
            publicationYear: parseInt(document.getElementById('bookYear').value) || new Date().getFullYear(),
            publisher: document.getElementById('bookPublisher').value,
            pages: parseInt(document.getElementById('bookPages').value) || 0,
            language: document.getElementById('bookLanguage').value,
            totalCopies: parseInt(document.getElementById('bookTotalCopies').value),
            coverImage: document.getElementById('bookCoverImage').value || `https://picsum.photos/seed/${Date.now()}/200/300`,
            description: document.getElementById('bookDescription').value
        };

        const newBook = libraryData.addBook(formData);
        
        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('commonModal')).hide();
        
        // Show success message
        authManager.showNotification(`Book "${newBook.title}" added successfully!`, 'success');
        
        // Refresh books list
        this.renderBooks();
    }

    viewBookDetails(bookId) {
        const book = libraryData.findBook(bookId);
        if (!book) return;

        const modalContent = `
            <div class="book-details">
                <div class="row">
                    <div class="col-md-4">
                        <img src="${book.coverImage}" alt="${book.title}" class="img-fluid rounded mb-3">
                    </div>
                    <div class="col-md-8">
                        <h4>${book.title}</h4>
                        <p class="text-muted">by ${book.author}</p>
                        
                        <div class="row mb-3">
                            <div class="col-6">
                                <strong>ISBN:</strong> ${book.isbn}
                            </div>
                            <div class="col-6">
                                <strong>Category:</strong> ${book.category}
                            </div>
                        </div>
                        
                        <div class="row mb-3">
                            <div class="col-6">
                                <strong>Published:</strong> ${book.publicationYear}
                            </div>
                            <div class="col-6">
                                <strong>Pages:</strong> ${book.pages}
                            </div>
                        </div>
                        
                        <div class="row mb-3">
                            <div class="col-6">
                                <strong>Language:</strong> ${book.language}
                            </div>
                            <div class="col-6">
                                <strong>Publisher:</strong> ${book.publisher}
                            </div>
                        </div>
                        
                        <div class="row mb-3">
                            <div class="col-6">
                                <strong>Total Copies:</strong> ${book.totalCopies}
                            </div>
                            <div class="col-6">
                                <strong>Available:</strong> ${book.availableCopies}
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <strong>Description:</strong>
                            <p>${book.description}</p>
                        </div>
                        
                        <div class="d-flex gap-2">
                            <button class="btn btn-primary" onclick="booksManager.editBook(${book.id})">
                                <i class="fas fa-edit me-2"></i>Edit
                            </button>
                            <button class="btn btn-success" onclick="booksManager.exportBookPDF(${book.id})">
                                <i class="fas fa-file-pdf me-2"></i>Export PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const modal = new bootstrap.Modal(document.getElementById('commonModal'));
        document.getElementById('modalTitle').textContent = 'Book Details';
        document.getElementById('modalBody').innerHTML = modalContent;
        modal.show();
    }

    editBook(bookId) {
        const book = libraryData.findBook(bookId);
        if (!book) return;

        const modalContent = this.renderBookForm(book);
        
        const modal = new bootstrap.Modal(document.getElementById('commonModal'));
        document.getElementById('modalTitle').textContent = 'Edit Book';
        document.getElementById('modalBody').innerHTML = modalContent;
        modal.show();
        
        // Setup form submission for update
        document.getElementById('bookForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateBook(bookId);
        });
    }

    updateBook(bookId) {
        const formData = {
            title: document.getElementById('bookTitle').value,
            authorId: parseInt(document.getElementById('bookAuthor').value),
            author: libraryData.findAuthor(document.getElementById('bookAuthor').value).name,
            isbn: document.getElementById('bookIsbn').value,
            categoryId: parseInt(document.getElementById('bookCategory').value),
            category: libraryData.findCategory(document.getElementById('bookCategory').value).name,
            publicationYear: parseInt(document.getElementById('bookYear').value) || new Date().getFullYear(),
            publisher: document.getElementById('bookPublisher').value,
            pages: parseInt(document.getElementById('bookPages').value) || 0,
            language: document.getElementById('bookLanguage').value,
            totalCopies: parseInt(document.getElementById('bookTotalCopies').value),
            coverImage: document.getElementById('bookCoverImage').value,
            description: document.getElementById('bookDescription').value
        };

        const updatedBook = libraryData.updateBook(bookId, formData);
        
        if (updatedBook) {
            // Close modal
            bootstrap.Modal.getInstance(document.getElementById('commonModal')).hide();
            
            // Show success message
            authManager.showNotification(`Book "${updatedBook.title}" updated successfully!`, 'success');
            
            // Refresh books list
            this.renderBooks();
        }
    }

    duplicateBook(bookId) {
        const book = libraryData.findBook(bookId);
        if (!book) return;

        const duplicatedBook = {
            ...book,
            title: `${book.title} (Copy)`,
            totalCopies: 1,
            availableCopies: 1,
            borrowedCopies: 0
        };

        delete duplicatedBook.id;

        const newBook = libraryData.addBook(duplicatedBook);
        authManager.showNotification(`Book "${newBook.title}" duplicated successfully!`, 'success');
        this.renderBooks();
    }

    deleteBook(bookId) {
        const book = libraryData.findBook(bookId);
        if (!book) return;

        if (confirm(`Are you sure you want to delete "${book.title}"? This action cannot be undone.`)) {
            const success = libraryData.deleteBook(bookId);
            
            if (success) {
                authManager.showNotification(`Book "${book.title}" deleted successfully!`, 'success');
                this.renderBooks();
            } else {
                authManager.showNotification('Failed to delete book', 'danger');
            }
        }
    }

    exportBooks() {
        const books = this.getFilteredAndSortedBooks();
        let csv = 'Title,Author,Category,ISBN,Publication Year,Pages,Language,Total Copies,Available Copies\n';
        
        books.forEach(book => {
            csv += `"${book.title}","${book.author}","${book.category}","${book.isbn}",${book.publicationYear},${book.pages},"${book.language}",${book.totalCopies},${book.availableCopies}\n`;
        });
        
        // Create download link
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `books_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        authManager.showNotification('Books exported successfully', 'success');
    }

    exportBookPDF(bookId) {
        const book = libraryData.findBook(bookId);
        if (!book) return;

        // Simple PDF export simulation (in real app, use a library like jsPDF)
        let pdfContent = `Book Details\n\n`;
        pdfContent += `Title: ${book.title}\n`;
        pdfContent += `Author: ${book.author}\n`;
        pdfContent += `ISBN: ${book.isbn}\n`;
        pdfContent += `Category: ${book.category}\n`;
        pdfContent += `Publication Year: ${book.publicationYear}\n`;
        pdfContent += `Pages: ${book.pages}\n`;
        pdfContent += `Language: ${book.language}\n`;
        pdfContent += `Publisher: ${book.publisher}\n`;
        pdfContent += `Total Copies: ${book.totalCopies}\n`;
        pdfContent += `Available Copies: ${book.availableCopies}\n`;
        pdfContent += `Description: ${book.description}\n`;

        // Create download link
        const blob = new Blob([pdfContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${book.title.replace(/[^a-z0-9]/gi, '_')}_details.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        authManager.showNotification(`Book details exported for "${book.title}"`, 'success');
    }

    markAsRead(bookId) {
        const book = libraryData.findBook(bookId);
        if (!book) return;

        // Create a modal to select user
        const modalContent = `
            <div class="mark-read-form">
                <h6>Mark "${book.title}" as Read</h6>
                <form id="markAsReadForm">
                    <div class="mb-3">
                        <label for="userSelect" class="form-label">Select User *</label>
                        <select class="form-select" id="userSelect" required>
                            <option value="">Choose a user...</option>
                            ${libraryData.getUsers().filter(user => user.status === 'active').map(user => 
                                `<option value="${user.id}">${user.firstName} ${user.lastName}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="readDate" class="form-label">Date Read</label>
                        <input type="date" class="form-control" id="readDate" value="${new Date().toISOString().split('T')[0]}" required>
                    </div>
                    <div class="mb-3">
                        <label for="rating" class="form-label">Rating</label>
                        <select class="form-select" id="rating">
                            <option value="">No rating</option>
                            <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                            <option value="4">⭐⭐⭐⭐ Very Good</option>
                            <option value="3">⭐⭐⭐ Good</option>
                            <option value="2">⭐⭐ Fair</option>
                            <option value="1">⭐ Poor</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="review" class="form-label">Review (Optional)</label>
                        <textarea class="form-control" id="review" rows="3" placeholder="What did you think about this book?"></textarea>
                    </div>
                    <div class="d-flex justify-content-end gap-2">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-success">
                            <i class="fas fa-check me-2"></i>Mark as Read
                        </button>
                    </div>
                </form>
            </div>
        `;

        const modal = new bootstrap.Modal(document.getElementById('commonModal'));
        document.getElementById('modalTitle').textContent = 'Mark Book as Read';
        document.getElementById('modalBody').innerHTML = modalContent;
        modal.show();

        // Setup form submission
        document.getElementById('markAsReadForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitMarkAsRead(bookId);
        });
    }

    submitMarkAsRead(bookId) {
        const book = libraryData.findBook(bookId);
        const user = libraryData.findUser(document.getElementById('userSelect').value);
        const readDate = document.getElementById('readDate').value;
        const rating = document.getElementById('rating').value;
        const review = document.getElementById('review').value;

        if (!book || !user) return;

        // Update user's total books read
        user.totalBooksRead = (user.totalBooksRead || 0) + 1;

        // Store reading record (in real app, this would go to a separate table)
        if (!libraryData.readingRecords) {
            libraryData.readingRecords = [];
        }
        
        libraryData.readingRecords.push({
            id: libraryData.readingRecords.length + 1,
            bookId: book.id,
            bookTitle: book.title,
            userId: user.id,
            userName: `${user.firstName} ${user.lastName}`,
            readDate: readDate,
            rating: rating,
            review: review
        });

        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('commonModal')).hide();
        
        // Show success message
        authManager.showNotification(`"${book.title}" marked as read by ${user.firstName} ${user.lastName}!`, 'success');
        
        // Refresh books list
        this.renderBooks();
    }

    createLoan(bookId) {
        const book = libraryData.findBook(bookId);
        if (!book) return;

        if (book.availableCopies <= 0) {
            authManager.showNotification('No copies available for loan', 'warning');
            return;
        }

        // Create a modal to create loan
        const modalContent = `
            <div class="create-loan-form">
                <h6>Create Loan for "${book.title}"</h6>
                <form id="createLoanForm">
                    <div class="mb-3">
                        <label for="loanUserSelect" class="form-label">Select User *</label>
                        <select class="form-select" id="loanUserSelect" required>
                            <option value="">Choose a user...</option>
                            ${libraryData.getUsers().filter(user => user.status === 'active').map(user => 
                                `<option value="${user.id}">${user.firstName} ${user.lastName} (${user.booksBorrowed} books borrowed)</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="loanDate" class="form-label">Loan Date *</label>
                            <input type="date" class="form-control" id="loanDate" value="${new Date().toISOString().split('T')[0]}" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="dueDate" class="form-label">Due Date *</label>
                            <input type="date" class="form-control" id="dueDate" value="${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="notes" class="form-label">Notes (Optional)</label>
                        <textarea class="form-control" id="notes" rows="2" placeholder="Any special notes for this loan..."></textarea>
                    </div>
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle me-2"></i>
                        <strong>Available Copies:</strong> ${book.availableCopies} out of ${book.totalCopies}
                    </div>
                    <div class="d-flex justify-content-end gap-2">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-hand-holding me-2"></i>Create Loan
                        </button>
                    </div>
                </form>
            </div>
        `;

        const modal = new bootstrap.Modal(document.getElementById('commonModal'));
        document.getElementById('modalTitle').textContent = 'Create New Loan';
        document.getElementById('modalBody').innerHTML = modalContent;
        modal.show();

        // Setup form submission
        document.getElementById('createLoanForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitCreateLoan(bookId);
        });

        // Set minimum date for due date
        document.getElementById('dueDate').min = document.getElementById('loanDate').value;
    }

    submitCreateLoan(bookId) {
        const book = libraryData.findBook(bookId);
        const user = libraryData.findUser(document.getElementById('loanUserSelect').value);
        const loanDate = document.getElementById('loanDate').value;
        const dueDate = document.getElementById('dueDate').value;
        const notes = document.getElementById('notes').value;

        if (!book || !user) return;

        // Create loan record
        const loan = {
            bookId: book.id,
            bookTitle: book.title,
            userId: user.id,
            userName: `${user.firstName} ${user.lastName}`,
            loanDate: loanDate,
            dueDate: dueDate,
            notes: notes,
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

        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('commonModal')).hide();
        
        // Show success message
        authManager.showNotification(`Loan created successfully! "${book.title}" loaned to ${user.firstName} ${user.lastName}`, 'success');
        
        // Refresh books list
        this.renderBooks();
    }
}

// Initialize books manager when needed
let booksManager;

// Global functions for onclick events
window.markAsRead = function(bookId) {
    if (booksManager) {
        booksManager.markAsRead(bookId);
    }
};

window.createLoan = function(bookId) {
    if (booksManager) {
        booksManager.createLoan(bookId);
    }
};
