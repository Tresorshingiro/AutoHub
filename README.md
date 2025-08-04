# 🚗 AutoHub - Complete Auto Garage Management System

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

AutoHub is a comprehensive auto garage management system designed to streamline operations for automotive service centers. It provides role-based access control for different user types including receptionists, mechanics, accountants, managers, and administrators.

## 🌟 Features

### 👥 Multi-Role Access System
- **Reception**: Vehicle intake, customer management, service tracking
- **Mechanic**: Vehicle diagnosis, quotation creation, service management
- **Accountant**: Financial management, inventory control, reporting
- **Manager**: Employee management, payroll, operations oversight
- **Admin**: System administration, comprehensive reporting, employee CRUD

### 🔧 Core Functionality
- **Vehicle Management**: Complete vehicle lifecycle from intake to completion
- **Service Tracking**: Real-time service status updates and progress monitoring
- **Financial Management**: Income/expense tracking, profit analysis
- **Inventory Control**: Parts management, supplier relationships
- **Employee Management**: Staff administration, role assignments
- **Comprehensive Reporting**: Multi-format exports (Excel, PDF)
- **Dashboard Analytics**: Real-time KPIs and data visualization

### 📊 Advanced Features
- **Pagination**: Efficient data handling for large datasets
- **Search & Filtering**: Advanced search capabilities across all modules
- **Export Functionality**: Excel and PDF export for all reports
- **Real-time Updates**: Live status tracking and notifications
- **Responsive Design**: Mobile-friendly interface
- **Secure Authentication**: Role-based JWT authentication

## 🛠 Tech Stack

### Frontend
- **React 18+** - Modern UI library
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/UI** - Modern component library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **Recharts** - Data visualization library
- **React Hot Toast** - Elegant notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Multer** - File upload handling
- **Cloudinary** - Image storage and management
- **Bcrypt** - Password hashing

## 📁 Project Structure

```
AutoHub/
├── backend/
│   ├── config/
│   │   └── cloudinary.js          # Cloudinary configuration
│   ├── controllers/
│   │   ├── adminController.js      # Admin operations
│   │   ├── accountantController.js # Financial operations
│   │   ├── managerController.js    # Management operations
│   │   ├── mechanicController.js   # Service operations
│   │   └── receptionController.js  # Reception operations
│   ├── middlewares/
│   │   ├── authAdmin.js           # Admin authentication
│   │   ├── authAccountant.js      # Accountant authentication
│   │   ├── authManager.js         # Manager authentication
│   │   ├── authMechanic.js        # Mechanic authentication
│   │   ├── authReceptionist.js    # Reception authentication
│   │   └── multer.js              # File upload middleware
│   ├── models/
│   │   ├── Employee.js            # Employee data model
│   │   ├── Expense.js             # Expense tracking model
│   │   ├── Income.js              # Income tracking model
│   │   ├── Parts.js               # Inventory parts model
│   │   ├── Quotation.js           # Service quotations model
│   │   ├── Service.js             # Service records model
│   │   ├── Supplier.js            # Supplier management model
│   │   └── Vehicles.js            # Vehicle data model
│   ├── routes/
│   │   ├── adminRoutes.js         # Admin API endpoints
│   │   ├── accountantRoutes.js    # Accountant API endpoints
│   │   ├── managerRoutes.js       # Manager API endpoints
│   │   ├── mechanicRoutes.js      # Mechanic API endpoints
│   │   └── receptionRoutes.js     # Reception API endpoints
│   ├── utils/
│   │   └── quotationScheduler.js  # Automated quotation scheduling
│   ├── server.js                  # Main server file
│   ├── package.json               # Backend dependencies
│   └── .env                       # Environment variables
├── client/
│   ├── public/
│   │   ├── logo.png               # Application logo
│   │   └── vite.svg               # Vite logo
│   ├── src/
│   │   ├── assets/                # Static assets
│   │   ├── components/
│   │   │   ├── ui/                # Reusable UI components
│   │   │   ├── Header.jsx         # Application header
│   │   │   ├── Sidebar.jsx        # Navigation sidebar
│   │   │   └── ...                # Other components
│   │   ├── context/
│   │   │   ├── AdminContext.jsx   # Admin state management
│   │   │   ├── AuthContext.jsx    # Authentication context
│   │   │   ├── AccountantContext.jsx
│   │   │   ├── ManagerContext.jsx
│   │   │   ├── MechanicContext.jsx
│   │   │   └── ReceptionContext.jsx
│   │   ├── pages/
│   │   │   ├── Admin/             # Admin panel pages
│   │   │   ├── Accountant/        # Accountant pages
│   │   │   ├── Manager/           # Manager pages
│   │   │   ├── Mechanic/          # Mechanic pages
│   │   │   ├── Reception/         # Reception pages
│   │   │   ├── Login.jsx          # Employee login
│   │   │   ├── AdminLogin.jsx     # Admin login
│   │   │   └── Register.jsx       # User registration
│   │   ├── utils/                 # Utility functions
│   │   ├── App.jsx                # Main application component
│   │   └── main.jsx               # Application entry point
│   ├── package.json               # Frontend dependencies
│   ├── tailwind.config.js         # Tailwind configuration
│   ├── vite.config.js             # Vite configuration
│   └── components.json            # Shadcn/UI configuration
└── README.md                      # Project documentation
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account or local MongoDB instance
- Cloudinary account for image storage
- Git installed

### 1. Clone Repository
```bash
git clone https://github.com/Tresorshingiro/AutoHub.git
cd AutoHub
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in the backend directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/AutoHub?retryWrites=true&w=majority
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
ADMIN_EMAIL=admin@autohub.com
ADMIN_PASSWORD=your_admin_password
JWT_SECRET=your_jwt_secret_key
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```

Create `.env` file in the client directory:
```env
VITE_BACKEND_URL=http://localhost:5000
```

### 4. Run Application

**Backend (Terminal 1):**
```bash
cd backend
npm start
```

**Frontend (Terminal 2):**
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## 🔐 Default Access Credentials

### Admin Access
- URL: `http://localhost:5173/admin-login`
- Email: Use `ADMIN_EMAIL` from your `.env` file
- Password: Use `ADMIN_PASSWORD` from your `.env` file

### Employee Access
- URL: `http://localhost:5173/login`
- Employees must be created by admin first
- Select appropriate role during login

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/admin/login          # Admin login
POST /api/reception/login      # Reception login
POST /api/mechanic/login       # Mechanic login
POST /api/accountant/login     # Accountant login
POST /api/manager/login        # Manager login
```

### Admin Endpoints
```
GET  /api/admin/dashboard         # Admin dashboard data
GET  /api/admin/get-all-employees # All employees
POST /api/admin/add-employee      # Create employee
GET  /api/admin/get-employee/:id  # Get employee by ID
PUT  /api/admin/update-employee/:id # Update employee
DELETE /api/admin/delete-employee/:id # Delete employee
GET  /api/admin/reports           # Generate reports
```

### Vehicle Management
```
POST /api/reception/add-vehicle   # Add new vehicle
GET  /api/reception/vehicles      # Get all vehicles
PUT  /api/reception/vehicle/:id   # Update vehicle
DELETE /api/reception/vehicle/:id # Delete vehicle
```

### Financial Management
```
GET  /api/accountant/income       # Get income records
POST /api/accountant/income       # Add income
GET  /api/accountant/expenses     # Get expenses
POST /api/accountant/expenses     # Add expense
```

## 👥 User Roles & Permissions

### 🏢 Admin
- **Full System Access**: Complete control over all modules
- **Employee Management**: Create, update, delete employees
- **System Reports**: Generate comprehensive reports
- **Dashboard**: System-wide analytics and KPIs

### 📞 Receptionist
- **Vehicle Intake**: Register new vehicles and customers
- **Service Tracking**: Monitor vehicle status
- **Customer Communication**: Handle customer inquiries
- **Appointment Management**: Schedule services

### 🔧 Mechanic
- **Vehicle Diagnosis**: Assess vehicle issues
- **Quotation Creation**: Generate service estimates
- **Service Updates**: Update repair progress
- **Parts Management**: Track parts usage

### 💰 Accountant
- **Financial Tracking**: Manage income and expenses
- **Inventory Control**: Monitor parts and supplies
- **Supplier Management**: Handle vendor relationships
- **Financial Reports**: Generate financial analytics

### 👔 Manager
- **Employee Oversight**: Manage staff and performance
- **Payroll Management**: Handle employee compensation
- **Operations Control**: Oversee daily operations
- **Strategic Reports**: Generate management reports

## 📱 Key Features

### Dashboard Analytics
- Real-time KPIs and metrics
- Interactive charts and graphs
- Role-specific data visualization
- Performance tracking

### Advanced Search & Filtering
- Multi-criteria search functionality
- Date range filtering
- Status-based filtering
- Role-specific filters

### Pagination System
- Efficient data loading
- Configurable page sizes
- Smooth navigation
- Performance optimization

### Export Capabilities
- Excel (.xlsx) export
- PDF generation
- Multiple report formats
- Customizable data selection

### Responsive Design
- Mobile-friendly interface
- Tablet optimization
- Desktop-first approach
- Cross-browser compatibility

## 🔧 Customization

### Adding New Roles
1. Update Employee model enum
2. Create new authentication middleware
3. Add role-specific routes
4. Create context and pages
5. Update sidebar navigation

### Extending Functionality
1. Add new models in `backend/models/`
2. Create controllers in `backend/controllers/`
3. Define routes in `backend/routes/`
4. Build frontend components
5. Update context providers

## 🚀 Deployment

### Backend (Render/Heroku)
1. Create new web service
2. Connect GitHub repository
3. Set environment variables
4. Deploy from main branch

### Frontend (Netlify/Vercel)
1. Create new site
2. Connect GitHub repository
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Shadcn/UI** for beautiful components
- **Tailwind CSS** for styling framework
- **React Community** for excellent ecosystem
- **MongoDB** for reliable database solution

## 📞 Support

For support and questions:
- 📧 Email: tresorshingiro26@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/Tresorshingiro/AutoHub/issues)
- 📖 Documentation: This README

---

**Built with ❤️ by [Tresor Shingiro](https://github.com/Tresorshingiro)**