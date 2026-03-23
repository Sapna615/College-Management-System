# College Management System

A comprehensive college management system built with Spring Boot (backend) and React (frontend).

## 🚀 Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Teacher, Student)
- Secure login/logout functionality

### User Management
- Admin: Create and manage teachers and students
- Teachers: Manage courses, attendance, and results
- Students: View timetable, attendance, and results

### Academic Management
- Course management by department and semester
- Timetable scheduling with room allocation
- Attendance tracking and reporting
- Result management and grade calculation

### Dashboard Features
- **Admin Dashboard**: Overview of all system statistics
- **Teacher Dashboard**: Class schedules, student management
- **Student Dashboard**: Today's schedule, recent results

## 🛠️ Technology Stack

### Backend
- **Spring Boot 3.2.0**
- **Spring Security** with JWT
- **Spring Data JPA** with Hibernate
- **H2 Database** (in-memory/file-based)
- **Maven** for dependency management

### Frontend
- **React 18** with modern hooks
- **React Router** for navigation
- **Axios** for API calls
- **Tailwind CSS** for styling
- **Lucide React** for icons

## 📋 Prerequisites

- Java 17+
- Node.js 18+
- Maven 3.6+

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Sapna615/College-Management-System.git
cd College-Management-System
```

### 2. Start Backend
```bash
cd backend
mvn spring-boot:run
```

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8081
- **H2 Console**: http://localhost:8081/h2-console

## 🔑 Default Credentials

### Admin Login
- **Email**: admin@example.com
- **Password**: admin123

### Teacher Login
- **Email**: teacher@example.com
- **Password**: teacher123

### Student Login
- **Email**: student@example.com
- **Password**: student123

## 📊 Database

### H2 Console Access
1. Navigate to: http://localhost:8081/h2-console
2. **JDBC URL**: `jdbc:h2:file:./data/collegedb`
3. **Username**: `sa`
4. **Password**: (leave empty)

### Key Tables
- **users**: Authentication and user information
- **teachers**: Teacher profiles and details
- **students**: Student profiles and academic info
- **courses**: Course catalog and details
- **timetables**: Class schedules and assignments
- **attendance**: Attendance records
- **results**: Student grades and results

## 🎯 Key Features Implemented

### ✅ Authentication System
- JWT token-based authentication
- Role-based authorization
- Token validation and expiration handling
- Secure password encoding

### ✅ User Management
- Admin can create teachers and students
- Profile management for all user types
- User role assignments and permissions

### ✅ Academic Management
- Course creation and management
- Timetable scheduling with room allocation
- Attendance tracking and reporting
- Result management with grade calculations

### ✅ Dashboard System
- Role-specific dashboards
- Real-time data display
- Interactive charts and statistics
- Navigation to detailed views

### ✅ Enhanced Features
- Form validation and error handling
- Debug logging for troubleshooting
- Responsive design for mobile devices
- Database access via H2 console

## 🔧 Configuration

### Backend Configuration
- **Database**: H2 file-based database
- **JWT Expiration**: 24 hours
- **Server Port**: 8081
- **CORS**: Enabled for frontend (localhost:5173)

### Frontend Configuration
- **Development Server**: localhost:5173
- **API Base URL**: http://localhost:8081
- **Routing**: React Router for SPA navigation

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 8081
lsof -ti:8081 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

#### Token Expiration
- Clear browser localStorage and sessionStorage
- Login again with fresh credentials

#### Database Issues
- Access H2 console to inspect data
- Check application.properties for database configuration

## 📝 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Admin
- `GET /teachers/all` - Get all teachers
- `POST /teachers/create` - Create teacher
- `GET /students/all` - Get all students
- `POST /students/create` - Create student

### Teacher
- `GET /teachers/profile` - Get teacher profile
- `GET /timetables/teacher-timetable` - Get teacher's timetable
- `POST /attendance/mark` - Mark attendance

### Student
- `GET /students/profile` - Get student profile
- `GET /timetables/student-timetable` - Get student's timetable
- `GET /results/my-results` - Get student's results

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Interface**: Clean and intuitive design
- **Interactive Components**: Forms, tables, and dashboards
- **Error Handling**: User-friendly error messages
- **Loading States**: Smooth user experience

## 🔄 Recent Updates

### Major Bug Fixes & Enhancements
- Enhanced teacher timetable filtering with teacher ID matching
- Fixed student dashboard showing "No classes scheduled"
- Improved admin teacher creation with form validation
- Enhanced JWT token handling and validation
- Added debug logging for troubleshooting
- Improved error handling across all modules
- Added database access endpoint for viewing all users

## 📞 Support

For any issues or questions, please create an issue in the GitHub repository.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the amazing frontend library
- Tailwind CSS for the utility-first CSS framework
- All contributors and users of this system
