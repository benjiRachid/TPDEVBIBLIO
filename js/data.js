// Library Management System Data
class LibraryData {
    constructor() {
        this.init();
    }

    init() {
        // Load data from localStorage or use defaults
        this.books = this.loadData('books', this.getDefaultBooks());
        this.authors = this.loadData('authors', this.getDefaultAuthors());
        this.categories = this.loadData('categories', this.getDefaultCategories());
        this.users = this.loadData('users', this.getDefaultUsers());
        this.loans = this.loadData('loans', this.getDefaultLoans());
    }

    loadData(key, defaultValue) {
        const data = localStorage.getItem(`library_${key}`);
        return data ? JSON.parse(data) : defaultValue;
    }

    saveData(key, data) {
        localStorage.setItem(`library_${key}`, JSON.stringify(data));
    }

    // Get methods
    getBooks() { return this.books; }
    getAuthors() { return this.authors; }
    getCategories() { return this.categories; }
    getUsers() { return this.users; }
    getLoans() { return this.loans; }

    // Find methods
    findBook(id) { return this.books.find(book => book.id === parseInt(id)); }
    findAuthor(id) { return this.authors.find(author => author.id === parseInt(id)); }
    findCategory(id) { return this.categories.find(category => category.id === parseInt(id)); }
    findUser(id) { return this.users.find(user => user.id === parseInt(id)); }
    findLoan(id) { return this.loans.find(loan => loan.id === parseInt(id)); }

    // CRUD operations for Books
    addBook(book) {
        const newBook = {
            id: this.generateId(this.books),
            ...book,
            status: "available",
            totalCopies: parseInt(book.totalCopies) || 1,
            availableCopies: parseInt(book.totalCopies) || 1,
            borrowedCopies: 0
        };
        this.books.push(newBook);
        this.saveData('books', this.books);
        return newBook;
    }

    updateBook(id, updates) {
        const index = this.books.findIndex(book => book.id === parseInt(id));
        if (index !== -1) {
            this.books[index] = { ...this.books[index], ...updates };
            this.saveData('books', this.books);
            return this.books[index];
        }
        return null;
    }

    deleteBook(id) {
        const index = this.books.findIndex(book => book.id === parseInt(id));
        if (index !== -1) {
            this.books.splice(index, 1);
            this.saveData('books', this.books);
            return true;
        }
        return false;
    }

    // CRUD operations for Authors
    addAuthor(author) {
        const newAuthor = {
            id: this.generateId(this.authors),
            ...author,
            booksCount: 0
        };
        this.authors.push(newAuthor);
        this.saveData('authors', this.authors);
        return newAuthor;
    }

    updateAuthor(id, updates) {
        const index = this.authors.findIndex(author => author.id === parseInt(id));
        if (index !== -1) {
            this.authors[index] = { ...this.authors[index], ...updates };
            this.saveData('authors', this.authors);
            return this.authors[index];
        }
        return null;
    }

    deleteAuthor(id) {
        const index = this.authors.findIndex(author => author.id === parseInt(id));
        if (index !== -1) {
            this.authors.splice(index, 1);
            this.saveData('authors', this.authors);
            return true;
        }
        return false;
    }

    // CRUD operations for Users
    addUser(user) {
        const newUser = {
            id: this.generateId(this.users),
            ...user,
            membershipDate: new Date().toISOString().split('T')[0],
            status: "active",
            booksBorrowed: 0,
            totalBooksRead: 0
        };
        this.users.push(newUser);
        this.saveData('users', this.users);
        return newUser;
    }

    updateUser(id, updates) {
        const index = this.users.findIndex(user => user.id === parseInt(id));
        if (index !== -1) {
            this.users[index] = { ...this.users[index], ...updates };
            this.saveData('users', this.users);
            return this.users[index];
        }
        return null;
    }

    deleteUser(id) {
        const index = this.users.findIndex(user => user.id === parseInt(id));
        if (index !== -1) {
            this.users.splice(index, 1);
            this.saveData('users', this.users);
            return true;
        }
        return false;
    }

    // CRUD operations for Loans
    addLoan(loan) {
        const newLoan = {
            id: this.generateId(this.loans),
            ...loan,
            loanDate: new Date().toISOString().split('T')[0],
            status: "active",
            renewalCount: 0,
            fine: 0
        };
        this.loans.push(newLoan);
        this.saveData('loans', this.loans);

        // Update user stats - simplified
        return newLoan;
    }

    updateLoan(id, updates) {
        const index = this.loans.findIndex(loan => loan.id === parseInt(id));
        if (index !== -1) {
            this.loans[index] = { ...this.loans[index], ...updates };
            this.saveData('loans', this.loans);
            return this.loans[index];
        }
        return null;
    }

    deleteLoan(id) {
        const index = this.loans.findIndex(loan => loan.id === parseInt(id));
        if (index !== -1) {
            this.loans.splice(index, 1);
            this.saveData('loans', this.loans);
            return true;
        }
        return false;
    }

    generateId(collection) {
        return collection.length > 0 ? Math.max(...collection.map(item => item.id)) + 1 : 1;
    }

    // Statistics methods
    getTotalBooks() { return this.books.length; }
    getTotalAuthors() { return this.authors.length; }
    getTotalUsers() { return this.users.length; }
    getTotalActiveLoans() { return this.loans.filter(loan => loan.status === 'active').length; }
    getTotalOverdueLoans() { return this.loans.filter(loan => loan.status === 'overdue').length; }

    getBooksByCategory() {
        const categoryCount = {};
        this.categories.forEach(cat => {
            categoryCount[cat.name] = this.books.filter(book => book.categoryId === cat.id).length;
        });
        return categoryCount;
    }

    getLoansByMonth() {
        const monthCount = {};
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        months.forEach(month => {
            monthCount[month] = 0;
        });

        this.loans.forEach(loan => {
            if (loan.loanDate) {
                const date = new Date(loan.loanDate);
                if (!isNaN(date)) {
                    const month = date.getMonth();
                    monthCount[months[month]]++;
                }
            }
        });

        return monthCount;
    }

    getUsersByMembership() {
        const membershipCount = {};
        this.users.forEach(user => {
            membershipCount[user.membershipType] = (membershipCount[user.membershipType] || 0) + 1;
        });
        return membershipCount;
    }

    // Default Data
    getDefaultBooks() {
        return [
            { id: 1, title: "To Kill a Mockingbird", author: "Harper Lee", authorId: 1, isbn: "978-0-06-112008-4", category: "Fiction", categoryId: 1, publicationYear: 1960, publisher: "J.B. Lippincott & Co.", pages: 281, language: "English", description: "A classic of modern American literature.", status: "available", totalCopies: 5, availableCopies: 3, borrowedCopies: 2, coverImage: "https://picsum.photos/seed/mockingbird/200/300" },
            { id: 2, title: "1984", author: "George Orwell", authorId: 2, isbn: "978-0-452-28423-4", category: "Dystopian Fiction", categoryId: 2, publicationYear: 1949, publisher: "Secker & Warburg", pages: 328, language: "English", description: "A dystopian social science fiction novel.", status: "available", totalCopies: 8, availableCopies: 4, borrowedCopies: 4, coverImage: "https://picsum.photos/seed/1984/200/300" },
            { id: 3, title: "Pride and Prejudice", author: "Jane Austen", authorId: 3, isbn: "978-0-14-143951-8", category: "Romance", categoryId: 3, publicationYear: 1813, publisher: "T. Egerton", pages: 432, language: "English", description: "A romantic novel of manners.", status: "available", totalCopies: 6, availableCopies: 2, borrowedCopies: 4, coverImage: "https://picsum.photos/seed/pride/200/300" },
            { id: 4, title: "The Great Gatsby", author: "F. Scott Fitzgerald", authorId: 4, isbn: "978-0-7432-7356-5", category: "Fiction", categoryId: 1, publicationYear: 1925, publisher: "Charles Scribner's Sons", pages: 180, language: "English", description: "A novel about the Jazz Age.", status: "available", totalCopies: 4, availableCopies: 1, borrowedCopies: 3, coverImage: "https://picsum.photos/seed/gatsby/200/300" },
            { id: 5, title: "One Hundred Years of Solitude", author: "Gabriel García Márquez", authorId: 5, isbn: "978-0-06-088328-7", category: "Magical Realism", categoryId: 4, publicationYear: 1967, publisher: "Harper & Row", pages: 417, language: "Spanish", description: "A landmark novel of magical realism.", status: "available", totalCopies: 3, availableCopies: 0, borrowedCopies: 3, coverImage: "https://picsum.photos/seed/solitude/200/300" }
        ];
    }

    getDefaultAuthors() {
        return [
            { id: 1, name: "Harper Lee", birthYear: 1926, deathYear: 2016, nationality: "American", biography: "American novelist known for To Kill a Mockingbird.", booksCount: 1, awards: ["Pulitzer Prize"], photo: "https://picsum.photos/seed/harperlee/150/150" },
            { id: 2, name: "George Orwell", birthYear: 1903, deathYear: 1950, nationality: "British", biography: "English novelist and critic.", booksCount: 1, awards: ["Prometheus Hall of Fame"], photo: "https://picsum.photos/seed/orwell/150/150" },
            { id: 3, name: "Jane Austen", birthYear: 1775, deathYear: 1817, nationality: "British", biography: "English novelist known for her six major novels.", booksCount: 1, awards: [], photo: "https://picsum.photos/seed/austen/150/150" },
            { id: 4, name: "F. Scott Fitzgerald", birthYear: 1896, deathYear: 1940, nationality: "American", biography: "American novelist and essayist.", booksCount: 1, awards: [], photo: "https://picsum.photos/seed/fitzgerald/150/150" },
            { id: 5, name: "Gabriel García Márquez", birthYear: 1927, deathYear: 2014, nationality: "Colombian", biography: "Colombian novelist and Nobel Prize winner.", booksCount: 1, awards: ["Nobel Prize"], photo: "https://picsum.photos/seed/marquez/150/150" }
        ];
    }

    getDefaultCategories() {
        return [
            { id: 1, name: "Fiction", description: "Literary works of imagination", color: "#007bff" },
            { id: 2, name: "Dystopian Fiction", description: "Fiction about oppressive societies", color: "#dc3545" },
            { id: 3, name: "Romance", description: "Love stories", color: "#e91e63" },
            { id: 4, name: "Magical Realism", description: "Magic in the real world", color: "#9c27b0" },
            { id: 5, name: "Fantasy", description: "Magical and supernatural elements", color: "#ff9800" },
            { id: 6, name: "Mystery", description: "Crime and detective fiction", color: "#795548" }
        ];
    }

    getDefaultUsers() {
        return [
            { id: 1, firstName: "John", lastName: "Doe", email: "john@example.com", phone: "555-0101", address: "123 Main St", membershipDate: "2023-01-15", membershipType: "Premium", status: "active", booksBorrowed: 2, totalBooksRead: 15, avatar: "https://picsum.photos/seed/john/100/100" },
            { id: 2, firstName: "Jane", lastName: "Smith", email: "jane@example.com", phone: "555-0102", address: "456 Oak Ave", membershipDate: "2023-03-20", membershipType: "Regular", status: "active", booksBorrowed: 1, totalBooksRead: 8, avatar: "https://picsum.photos/seed/jane/100/100" },
            { id: 3, firstName: "Mike", lastName: "Johnson", email: "mike@example.com", phone: "555-0103", address: "789 Pine St", membershipDate: "2022-11-10", membershipType: "Student", status: "active", booksBorrowed: 3, totalBooksRead: 25, avatar: "https://picsum.photos/seed/mike/100/100" }
        ];
    }

    getDefaultLoans() {
        return [
            { id: 1, userId: 1, userName: "John Doe", bookId: 1, bookTitle: "To Kill a Mockingbird", loanDate: "2024-01-02", dueDate: "2024-01-16", status: "active", renewalCount: 0, fine: 0 },
            { id: 2, userId: 1, userName: "John Doe", bookId: 2, bookTitle: "1984", loanDate: "2024-01-05", dueDate: "2024-01-19", status: "active", renewalCount: 1, fine: 0 },
            { id: 3, userId: 2, userName: "Jane Smith", bookId: 3, bookTitle: "Pride and Prejudice", loanDate: "2023-12-20", dueDate: "2024-01-03", returnDate: "2024-01-02", status: "returned", renewalCount: 0, fine: 0 },
            { id: 4, userId: 3, userName: "Mike Johnson", bookId: 5, bookTitle: "One Hundred Years of Solitude", loanDate: "2023-12-28", dueDate: "2024-01-11", status: "overdue", renewalCount: 0, fine: 2.50 }
        ];
    }
}

// Initialize global data instance
const libraryData = new LibraryData();
