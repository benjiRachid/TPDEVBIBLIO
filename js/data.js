// Library Management System Data
class LibraryData {
    constructor() {
        this.books = [
            {
                id: 1,
                title: "To Kill a Mockingbird",
                author: "Harper Lee",
                authorId: 1,
                isbn: "978-0-06-112008-4",
                category: "Fiction",
                categoryId: 1,
                publicationYear: 1960,
                publisher: "J.B. Lippincott & Co.",
                pages: 281,
                language: "English",
                description: "A classic of modern American literature that won the Pulitzer Prize.",
                status: "available",
                totalCopies: 5,
                availableCopies: 3,
                borrowedCopies: 2,
                coverImage: "https://picsum.photos/seed/mockingbird/200/300"
            },
            {
                id: 2,
                title: "1984",
                author: "George Orwell",
                authorId: 2,
                isbn: "978-0-452-28423-4",
                category: "Dystopian Fiction",
                categoryId: 2,
                publicationYear: 1949,
                publisher: "Secker & Warburg",
                pages: 328,
                language: "English",
                description: "A dystopian social science fiction novel and cautionary tale.",
                status: "available",
                totalCopies: 8,
                availableCopies: 4,
                borrowedCopies: 4,
                coverImage: "https://picsum.photos/seed/1984/200/300"
            },
            {
                id: 3,
                title: "Pride and Prejudice",
                author: "Jane Austen",
                authorId: 3,
                isbn: "978-0-14-143951-8",
                category: "Romance",
                categoryId: 3,
                publicationYear: 1813,
                publisher: "T. Egerton",
                pages: 432,
                language: "English",
                description: "A romantic novel of manners written by Jane Austen.",
                status: "available",
                totalCopies: 6,
                availableCopies: 2,
                borrowedCopies: 4,
                coverImage: "https://picsum.photos/seed/pride/200/300"
            },
            {
                id: 4,
                title: "The Great Gatsby",
                author: "F. Scott Fitzgerald",
                authorId: 4,
                isbn: "978-0-7432-7356-5",
                category: "Fiction",
                categoryId: 1,
                publicationYear: 1925,
                publisher: "Charles Scribner's Sons",
                pages: 180,
                language: "English",
                description: "A novel about the Jazz Age in the United States.",
                status: "available",
                totalCopies: 4,
                availableCopies: 1,
                borrowedCopies: 3,
                coverImage: "https://picsum.photos/seed/gatsby/200/300"
            },
            {
                id: 5,
                title: "One Hundred Years of Solitude",
                author: "Gabriel García Márquez",
                authorId: 5,
                isbn: "978-0-06-088328-7",
                category: "Magical Realism",
                categoryId: 4,
                publicationYear: 1967,
                publisher: "Harper & Row",
                pages: 417,
                language: "Spanish",
                description: "A landmark novel of magical realism by Colombian author.",
                status: "available",
                totalCopies: 3,
                availableCopies: 0,
                borrowedCopies: 3,
                coverImage: "https://picsum.photos/seed/solitude/200/300"
            },
            {
                id: 6,
                title: "The Catcher in the Rye",
                author: "J.D. Salinger",
                authorId: 6,
                isbn: "978-0-316-76948-0",
                category: "Fiction",
                categoryId: 1,
                publicationYear: 1951,
                publisher: "Little, Brown and Company",
                pages: 234,
                language: "English",
                description: "A story about teenage rebellion and angst.",
                status: "available",
                totalCopies: 7,
                availableCopies: 5,
                borrowedCopies: 2,
                coverImage: "https://picsum.photos/seed/catcher/200/300"
            },
            {
                id: 7,
                title: "Brave New World",
                author: "Aldous Huxley",
                authorId: 7,
                isbn: "978-0-06-085052-4",
                category: "Dystopian Fiction",
                categoryId: 2,
                publicationYear: 1932,
                publisher: "Chatto & Windus",
                pages: 311,
                language: "English",
                description: "A dystopian novel set in a futuristic World State.",
                status: "available",
                totalCopies: 5,
                availableCopies: 3,
                borrowedCopies: 2,
                coverImage: "https://picsum.photos/seed/brave/200/300"
            },
            {
                id: 8,
                title: "The Hobbit",
                author: "J.R.R. Tolkien",
                authorId: 8,
                isbn: "978-0-547-92822-7",
                category: "Fantasy",
                categoryId: 5,
                publicationYear: 1937,
                publisher: "George Allen & Unwin",
                pages: 310,
                language: "English",
                description: "A fantasy novel and children's book about hobbits and dragons.",
                status: "available",
                totalCopies: 10,
                availableCopies: 8,
                borrowedCopies: 2,
                coverImage: "https://picsum.photos/seed/hobbit/200/300"
            },
            {
                id: 9,
                title: "Harry Potter and the Sorcerer's Stone",
                author: "J.K. Rowling",
                authorId: 9,
                isbn: "978-0-439-70818-8",
                category: "Fantasy",
                categoryId: 5,
                publicationYear: 1997,
                publisher: "Bloomsbury",
                pages: 309,
                language: "English",
                description: "The first novel in the Harry Potter series.",
                status: "available",
                totalCopies: 15,
                availableCopies: 12,
                borrowedCopies: 3,
                coverImage: "https://picsum.photos/seed/potter/200/300"
            },
            {
                id: 10,
                title: "The Da Vinci Code",
                author: "Dan Brown",
                authorId: 10,
                isbn: "978-0-385-50420-5",
                category: "Mystery",
                categoryId: 6,
                publicationYear: 2003,
                publisher: "Doubleday",
                pages: 689,
                language: "English",
                description: "A mystery thriller novel following symbologist Robert Langdon.",
                status: "available",
                totalCopies: 8,
                availableCopies: 6,
                borrowedCopies: 2,
                coverImage: "https://picsum.photos/seed/davinci/200/300"
            }
        ];

        this.authors = [
            {
                id: 1,
                name: "Harper Lee",
                birthYear: 1926,
                deathYear: 2016,
                nationality: "American",
                biography: "Nelle Harper Lee was an American novelist best known for her 1960 novel To Kill a Mockingbird.",
                booksCount: 1,
                awards: ["Pulitzer Prize for Fiction (1961)"],
                photo: "https://picsum.photos/seed/harperlee/150/150"
            },
            {
                id: 2,
                name: "George Orwell",
                birthYear: 1903,
                deathYear: 1950,
                nationality: "British",
                biography: "Eric Arthur Blair, known by his pen name George Orwell, was an English novelist and critic.",
                booksCount: 1,
                awards: ["Prometheus Hall of Fame Award"],
                photo: "https://picsum.photos/seed/orwell/150/150"
            },
            {
                id: 3,
                name: "Jane Austen",
                birthYear: 1775,
                deathYear: 1817,
                nationality: "British",
                biography: "Jane Austen was an English novelist known primarily for her six major novels.",
                booksCount: 1,
                awards: ["Posthumous recognition"],
                photo: "https://picsum.photos/seed/austen/150/150"
            },
            {
                id: 4,
                name: "F. Scott Fitzgerald",
                birthYear: 1896,
                deathYear: 1940,
                nationality: "American",
                biography: "Francis Scott Key Fitzgerald was an American novelist, essayist, and short story writer.",
                booksCount: 1,
                awards: ["Literary acclaim"],
                photo: "https://picsum.photos/seed/fitzgerald/150/150"
            },
            {
                id: 5,
                name: "Gabriel García Márquez",
                birthYear: 1927,
                deathYear: 2014,
                nationality: "Colombian",
                biography: "Gabriel José de la Concordia García Márquez was a Colombian novelist and Nobel Prize winner.",
                booksCount: 1,
                awards: ["Nobel Prize in Literature (1982)", "Neustadt International Prize for Literature (1972)"],
                photo: "https://picsum.photos/seed/marquez/150/150"
            },
            {
                id: 6,
                name: "J.D. Salinger",
                birthYear: 1919,
                deathYear: 2010,
                nationality: "American",
                biography: "Jerome David Salinger was an American writer known for his novel The Catcher in the Rye.",
                booksCount: 1,
                awards: ["Literary recognition"],
                photo: "https://picsum.photos/seed/salinger/150/150"
            },
            {
                id: 7,
                name: "Aldous Huxley",
                birthYear: 1894,
                deathYear: 1963,
                nationality: "British",
                biography: "Aldous Leonard Huxley was an English writer and philosopher.",
                booksCount: 1,
                awards: ["Literary acclaim"],
                photo: "https://picsum.photos/seed/huxley/150/150"
            },
            {
                id: 8,
                name: "J.R.R. Tolkien",
                birthYear: 1892,
                deathYear: 1973,
                nationality: "British",
                biography: "John Ronald Reuel Tolkien was an English writer and philologist, best known as the author of The Hobbit and The Lord of the Rings.",
                booksCount: 1,
                awards: ["Carnegie Medal", "Fantasy Award"],
                photo: "https://picsum.photos/seed/tolkien/150/150"
            },
            {
                id: 9,
                name: "J.K. Rowling",
                birthYear: 1965,
                deathYear: null,
                nationality: "British",
                biography: "Joanne Rowling, known as J.K. Rowling, is a British author, best known for writing the Harry Potter fantasy series.",
                booksCount: 1,
                awards: ["British Book Awards", "Hugo Award", "Whitbread Award"],
                photo: "https://picsum.photos/seed/rowling/150/150"
            },
            {
                id: 10,
                name: "Dan Brown",
                birthYear: 1964,
                deathYear: null,
                nationality: "American",
                biography: "Daniel Gerhard Brown is an American author best known for his thriller novels, including the Robert Langdon series.",
                booksCount: 1,
                awards: ["Bestselling author recognition"],
                photo: "https://picsum.photos/seed/brown/150/150"
            }
        ];

        this.categories = [
            { id: 1, name: "Fiction", description: "Literary works of imagination", color: "#007bff" },
            { id: 2, name: "Dystopian Fiction", description: "Fiction about oppressive societies", color: "#dc3545" },
            { id: 3, name: "Romance", description: "Love stories and romantic fiction", color: "#e91e63" },
            { id: 4, name: "Magical Realism", description: "Literary style with magical elements", color: "#9c27b0" },
            { id: 5, name: "Fantasy", description: "Stories with magical and supernatural elements", color: "#ff9800" },
            { id: 6, name: "Mystery", description: "Crime and detective fiction", color: "#795548" }
        ];

        this.users = [
            {
                id: 1,
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@email.com",
                phone: "+1-555-0101",
                address: "123 Main St, New York, NY 10001",
                membershipDate: "2023-01-15",
                membershipType: "Premium",
                status: "active",
                booksBorrowed: 2,
                totalBooksRead: 15,
                avatar: "https://picsum.photos/seed/johndoe/100/100"
            },
            {
                id: 2,
                firstName: "Jane",
                lastName: "Smith",
                email: "jane.smith@email.com",
                phone: "+1-555-0102",
                address: "456 Oak Ave, Los Angeles, CA 90001",
                membershipDate: "2023-03-20",
                membershipType: "Regular",
                status: "active",
                booksBorrowed: 1,
                totalBooksRead: 8,
                avatar: "https://picsum.photos/seed/janesmith/100/100"
            },
            {
                id: 3,
                firstName: "Michael",
                lastName: "Johnson",
                email: "michael.j@email.com",
                phone: "+1-555-0103",
                address: "789 Pine St, Chicago, IL 60601",
                membershipDate: "2022-11-10",
                membershipType: "Premium",
                status: "active",
                booksBorrowed: 3,
                totalBooksRead: 25,
                avatar: "https://picsum.photos/seed/michaelj/100/100"
            },
            {
                id: 4,
                firstName: "Emily",
                lastName: "Davis",
                email: "emily.davis@email.com",
                phone: "+1-555-0104",
                address: "321 Elm St, Houston, TX 77001",
                membershipDate: "2023-06-05",
                membershipType: "Student",
                status: "active",
                booksBorrowed: 0,
                totalBooksRead: 5,
                avatar: "https://picsum.photos/seed/emilyd/100/100"
            },
            {
                id: 5,
                firstName: "Robert",
                lastName: "Wilson",
                email: "robert.w@email.com",
                phone: "+1-555-0105",
                address: "654 Maple Dr, Phoenix, AZ 85001",
                membershipDate: "2022-09-15",
                membershipType: "Regular",
                status: "inactive",
                booksBorrowed: 0,
                totalBooksRead: 12,
                avatar: "https://picsum.photos/seed/robertw/100/100"
            }
        ];

        this.loans = [
            {
                id: 1,
                userId: 1,
                userName: "John Doe",
                bookId: 1,
                bookTitle: "To Kill a Mockingbird",
                loanDate: "2024-01-02",
                dueDate: "2024-01-16",
                returnDate: null,
                status: "active",
                renewalCount: 0,
                fine: 0
            },
            {
                id: 2,
                userId: 1,
                userName: "John Doe",
                bookId: 2,
                bookTitle: "1984",
                loanDate: "2024-01-05",
                dueDate: "2024-01-19",
                returnDate: null,
                status: "active",
                renewalCount: 1,
                fine: 0
            },
            {
                id: 3,
                userId: 2,
                userName: "Jane Smith",
                bookId: 3,
                bookTitle: "Pride and Prejudice",
                loanDate: "2023-12-20",
                dueDate: "2024-01-03",
                returnDate: "2024-01-02",
                status: "returned",
                renewalCount: 0,
                fine: 0
            },
            {
                id: 4,
                userId: 3,
                userName: "Michael Johnson",
                bookId: 4,
                bookTitle: "The Great Gatsby",
                loanDate: "2024-01-01",
                dueDate: "2024-01-15",
                returnDate: null,
                status: "active",
                renewalCount: 0,
                fine: 0
            },
            {
                id: 5,
                userId: 3,
                userName: "Michael Johnson",
                bookId: 5,
                bookTitle: "One Hundred Years of Solitude",
                loanDate: "2023-12-28",
                dueDate: "2024-01-11",
                returnDate: null,
                status: "overdue",
                renewalCount: 0,
                fine: 2.50
            },
            {
                id: 6,
                userId: 3,
                userName: "Michael Johnson",
                bookId: 6,
                bookTitle: "The Catcher in the Rye",
                loanDate: "2024-01-08",
                dueDate: "2024-01-22",
                returnDate: null,
                status: "active",
                renewalCount: 0,
                fine: 0
            }
        ];
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
            id: Math.max(...this.books.map(b => b.id)) + 1,
            ...book,
            status: "available",
            totalCopies: parseInt(book.totalCopies) || 1,
            availableCopies: parseInt(book.totalCopies) || 1,
            borrowedCopies: 0
        };
        this.books.push(newBook);
        return newBook;
    }

    updateBook(id, updates) {
        const index = this.books.findIndex(book => book.id === parseInt(id));
        if (index !== -1) {
            this.books[index] = { ...this.books[index], ...updates };
            return this.books[index];
        }
        return null;
    }

    deleteBook(id) {
        const index = this.books.findIndex(book => book.id === parseInt(id));
        if (index !== -1) {
            this.books.splice(index, 1);
            return true;
        }
        return false;
    }

    // CRUD operations for Authors
    addAuthor(author) {
        const newAuthor = {
            id: Math.max(...this.authors.map(a => a.id)) + 1,
            ...author,
            booksCount: 0
        };
        this.authors.push(newAuthor);
        return newAuthor;
    }

    updateAuthor(id, updates) {
        const index = this.authors.findIndex(author => author.id === parseInt(id));
        if (index !== -1) {
            this.authors[index] = { ...this.authors[index], ...updates };
            return this.authors[index];
        }
        return null;
    }

    deleteAuthor(id) {
        const index = this.authors.findIndex(author => author.id === parseInt(id));
        if (index !== -1) {
            this.authors.splice(index, 1);
            return true;
        }
        return false;
    }

    // CRUD operations for Users
    addUser(user) {
        const newUser = {
            id: Math.max(...this.users.map(u => u.id)) + 1,
            ...user,
            membershipDate: new Date().toISOString().split('T')[0],
            status: "active",
            booksBorrowed: 0,
            totalBooksRead: 0
        };
        this.users.push(newUser);
        return newUser;
    }

    updateUser(id, updates) {
        const index = this.users.findIndex(user => user.id === parseInt(id));
        if (index !== -1) {
            this.users[index] = { ...this.users[index], ...updates };
            return this.users[index];
        }
        return null;
    }

    deleteUser(id) {
        const index = this.users.findIndex(user => user.id === parseInt(id));
        if (index !== -1) {
            this.users.splice(index, 1);
            return true;
        }
        return false;
    }

    // CRUD operations for Loans
    addLoan(loan) {
        const newLoan = {
            id: Math.max(...this.loans.map(l => l.id)) + 1,
            ...loan,
            loanDate: new Date().toISOString().split('T')[0],
            status: "active",
            renewalCount: 0,
            fine: 0
        };
        this.loans.push(newLoan);
        return newLoan;
    }

    updateLoan(id, updates) {
        const index = this.loans.findIndex(loan => loan.id === parseInt(id));
        if (index !== -1) {
            this.loans[index] = { ...this.loans[index], ...updates };
            return this.loans[index];
        }
        return null;
    }

    deleteLoan(id) {
        const index = this.loans.findIndex(loan => loan.id === parseInt(id));
        if (index !== -1) {
            this.loans.splice(index, 1);
            return true;
        }
        return false;
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
            const month = new Date(loan.loanDate).getMonth();
            monthCount[months[month]]++;
        });
        
        return monthCount;
    }
}

// Initialize global data instance
const libraryData = new LibraryData();
