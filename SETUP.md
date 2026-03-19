# College Management System - Setup Instructions

## Prerequisites

Before you begin, ensure you have the following installed:

- **Java 17** or higher
- **Node.js 16** or higher  
- **MySQL 8.0** or higher
- **Maven** 3.6 or higher

## Database Setup

1. **Install MySQL** if not already installed
2. **Create Database:**
   ```sql
   CREATE DATABASE college_management;
   ```
3. **Update Database Credentials** in `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/college_management
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password
   ```

## Backend Setup

1. **Navigate to Backend Directory:**
   ```bash
   cd backend
   ```

2. **Install Dependencies:**
   ```bash
   mvn clean install
   ```

3. **Run the Application:**
   ```bash
   mvn spring-boot:run
   ```

4. **Backend will be available at:** `http://localhost:8080`

## Frontend Setup

1. **Navigate to Frontend Directory:**
   ```bash
   cd frontend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Run the Development Server:**
   ```bash
   npm run dev
   ```

4. **Frontend will be available at:** `http://localhost:5173`

## Default Admin Credentials

- **Email:** `admin@college.com`
- **Password:** `Admin@123`

## Email Configuration (Optional)

For password reset functionality, configure email settings in `backend/src/main/resources/application.properties`:

```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

**Note:** For Gmail, you'll need to:
1. Enable 2-factor authentication
2. Generate an app password
3. Use the app password in the configuration

## Project Structure

```
college-management-system/
├── backend/                 # Spring Boot Application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── college/
│   │   │   │           ├── controller/    # REST Controllers
│   │   │   │           ├── service/       # Business Logic
│   │   │   │           ├── repository/    # Data Access Layer
│   │   │   │           ├── model/         # JPA Entities
│   │   │   │           ├── config/        # Configuration
│   │   │   │           ├── security/      # Security Configuration
│   │   │   │           └── dto/           # Data Transfer Objects
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
├── frontend/               # React Application
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable Components
│   │   ├── pages/          # Page Components
│   │   ├── services/       # API Services
│   │   ├── context/        # React Context
│   │   ├── layouts/        # Layout Components
│   │   ├── routes/         # Route Configuration
│   │   └── utils/          # Utility Functions
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── README.md
└── SETUP.md
```

## Features Implemented

### Authentication System
- ✅ User Registration with Role Selection
- ✅ Email/Password Login
- ✅ JWT-based Authentication
- ✅ Password Reset via Email
- ✅ Role-based Authorization

### Admin Dashboard
- ✅ User Management (Students & Teachers)
- ✅ Dashboard Analytics
- ✅ Student Management (CRUD Operations)
- ✅ Teacher Management (CRUD Operations)
- ✅ Course Management (Structure Ready)
- ✅ Timetable Management (Structure Ready)
- ✅ Result Management (Structure Ready)

### Teacher Dashboard
- ✅ Profile Management
- ✅ Course Overview
- ✅ Attendance Management (Structure Ready)
- ✅ Result Management (Structure Ready)
- ✅ Timetable View (Structure Ready)

### Student Dashboard
- ✅ Profile Management
- ✅ Results Viewing (Structure Ready)
- ✅ Attendance Tracking (Structure Ready)
- ✅ Timetable Viewing (Structure Ready)
- ✅ Course Enrollment

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

### Users
- `GET /api/users/all` - Get all users (Admin only)
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user (Admin only)
- `GET /api/users/profile` - Get current user profile

### Students
- `GET /api/students/all` - Get all students (Admin only)
- `POST /api/students/create` - Create student (Admin only)
- `GET /api/students/{id}` - Get student by ID
- `PUT /api/students/{id}` - Update student
- `DELETE /api/students/{id}` - Delete student (Admin only)
- `GET /api/students/profile` - Get current student profile

### Teachers
- `GET /api/teachers/all` - Get all teachers (Admin only)
- `POST /api/teachers/create` - Create teacher (Admin only)
- `GET /api/teachers/{id}` - Get teacher by ID
- `PUT /api/teachers/{id}` - Update teacher
- `DELETE /api/teachers/{id}` - Delete teacher (Admin only)
- `GET /api/teachers/profile` - Get current teacher profile

### Courses
- `GET /api/courses/all` - Get all courses
- `POST /api/courses/create` - Create course (Admin only)
- `GET /api/courses/{id}` - Get course by ID
- `PUT /api/courses/{id}` - Update course (Admin only)
- `DELETE /api/courses/{id}` - Delete course (Admin only)
- `GET /api/courses/my-courses` - Get teacher's courses

### Results
- `GET /api/results/student/{studentId}` - Get student results
- `POST /api/results/create` - Create result (Admin/Teacher)
- `GET /api/results/my-results` - Get current student results

### Attendance
- `GET /api/attendance/student/{studentId}` - Get student attendance
- `POST /api/attendance/mark` - Mark attendance (Admin/Teacher)
- `GET /api/attendance/my-attendance` - Get current student attendance

### Timetable
- `GET /api/timetable/all` - Get all timetables
- `POST /api/timetable/create` - Create timetable (Admin only)
- `GET /api/timetable/my-timetable` - Get user's timetable

## Running the Application

1. **Start MySQL Database**
2. **Run Backend:**
   ```bash
   cd backend
   mvn spring-boot:run
   ```
3. **Run Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
4. **Access Application:** Open `http://localhost:5173` in your browser

## Troubleshooting

### Common Issues

1. **Database Connection Error:**
   - Ensure MySQL is running
   - Check database credentials in application.properties
   - Verify database name and permissions

2. **Port Already in Use:**
   - Change backend port in application.properties: `server.port=8081`
   - Change frontend port in vite.config.js: `port: 5174`

3. **CORS Issues:**
   - Ensure CORS is properly configured in SecurityConfig.java
   - Check that frontend URL is in allowed origins

4. **Email Service Not Working:**
   - Verify email credentials
   - Check if app password is used for Gmail
   - Ensure SMTP settings are correct

## Development Notes

### Backend
- Uses Spring Boot 3.2.0 with Java 17
- Spring Security with JWT authentication
- Spring Data JPA for database operations
- MySQL as database
- Lombok for reducing boilerplate code

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- Context API for state management
- React Hot Toast for notifications

### Security
- Password encryption with BCrypt
- JWT tokens for authentication
- Role-based access control
- CORS configuration
- Input validation

## Future Enhancements

- [ ] Complete course management functionality
- [ ] Implement full attendance system
- [ ] Add result upload/download features
- [ ] Implement file upload for profiles
- [ ] Add dashboard charts and analytics
- [ ] Dark mode support
- [ ] Mobile app development
- [ ] Integration with external systems

## Support

For any issues or questions, please refer to the code documentation or create an issue in the project repository.
