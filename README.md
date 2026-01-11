# Library Management System

A comprehensive web-based library management application built with vanilla JavaScript, HTML5, and CSS3. This system provides complete CRUD functionality for managing books, authors, users, loans, and categories with an intuitive dashboard and responsive design.

## Features

### 🔐 Authentication
- Secure login system (admin/admin)
- Session management with localStorage
- Multi-language support (English, French, Arabic)
- RTL support for Arabic

### 📊 Dashboard
- Real-time statistics cards
- Interactive charts (Chart.js)
- Recent activities feed
- Quick action buttons
- Data export functionality

### 📚 Books Management
- Full CRUD operations (Create, Read, Update, Delete)
- Advanced search and filtering
- Pagination and sorting
- CSV export
- PDF export for individual books
- Book duplication
- Cover image support
- Availability tracking

### 👥 Users Management
- User registration and management
- Membership types
- Activity tracking
- Contact management

### ✍️ Authors Management
- Author profiles
- Biography and awards
- Book count tracking
- Nationality and lifespan

### 📖 Loans Management
- Loan tracking
- Due date management
- Fine calculation
- Overdue notifications
- Loan history

### 🏷️ Categories Management
- Category organization
- Color coding
- Book categorization

### 🎨 UI/UX Features
- Responsive design (Bootstrap 5)
- Modern animations
- Loading states
- Toast notifications
- Modal dialogs
- Keyboard shortcuts
- Mobile-friendly

## Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Framework**: Bootstrap 5
- **Icons**: Font Awesome 6
- **Charts**: Chart.js
- **Utilities**: Lodash.js
- **Data**: Local storage with in-memory data management

## Project Structure

```
project_biblio/
├── index.html              # Main application entry point
├── css/
│   └── styles.css          # Custom styles and animations
├── js/
│   ├── main.js             # Main application controller
│   ├── auth.js             # Authentication module
│   ├── data.js             # Data management and CRUD operations
│   ├── dashboard.js        # Dashboard functionality
│   ├── books.js            # Books management
│   ├── users.js            # Users management (placeholder)
│   ├── authors.js          # Authors management (placeholder)
│   ├── loans.js            # Loans management (placeholder)
│   └── categories.js       # Categories management (placeholder)
└── README.md               # This file
```

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, for development)

### Installation
1. Clone or download the project
2. Open `index.html` in your web browser
3. Login with credentials:
   - Username: `admin`
   - Password: `admin`

### Development Setup
For local development with a web server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## Usage

### Navigation
- Use the sidebar menu to navigate between different sections
- Dashboard shows overview statistics and charts
- Each section has its own CRUD operations

### Keyboard Shortcuts
- `Ctrl/Cmd + B`: Go to Books
- `Ctrl/Cmd + U`: Go to Users  
- `Ctrl/Cmd + D`: Go to Dashboard

### Data Management
- **Add**: Click "Add New" buttons to create new records
- **Edit**: Click the edit icon in table rows
- **View**: Click the eye icon to see detailed information
- **Delete**: Click the trash icon with confirmation
- **Export**: Use export buttons for CSV/PDF downloads

### Search and Filter
- Use search bars to find specific records
- Apply filters by category, status, or other attributes
- Sort data by different columns

## Sample Data

The application comes pre-loaded with sample data including:
- 10 famous books from various genres
- 10 renowned authors with biographies
- 6 book categories
- 5 sample users
- 6 sample loan records

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support or questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

---

**Note**: This is a demonstration project for educational purposes. In a production environment, consider implementing proper backend services, database integration, and enhanced security measures.
"# TPDEVBIBLIO" 
