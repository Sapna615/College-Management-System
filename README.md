# College Management System

A full-stack College Management System built with React.js (Frontend) and Spring Boot (Backend) with MySQL database.

## Tech Stack

### Frontend
- React.js with Vite
- Tailwind CSS
- React Router
- Axios
- Context API

### Backend
- Java Spring Boot
- Spring Security with JWT
- Spring Data JPA
- MySQL Database
- JavaMailSender

## Features

### Authentication System
- Login and Registration with role selection
- Password reset via email
- JWT-based authentication
- BCrypt password hashing

### Role-Based Dashboards
1. **Admin Dashboard**
   - Manage students and teachers
   - Course management
   - Timetable creation
   - Results management
   - System analytics

2. **Teacher Dashboard**
   - Profile management
   - Student marks management
   - Attendance management
   - View timetable and courses

3. **Student Dashboard**
   - Profile management
   - View timetable and results
   - View attendance
   - View enrolled courses

## Project Structure

```
college-management-system/
├── backend/                 # Spring Boot Application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── college/
│   │   │   │           ├── controller/
│   │   │   │           ├── service/
│   │   │   │           ├── repository/
│   │   │   │           ├── model/
│   │   │   │           ├── config/
│   │   │   │           └── security/
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
├── frontend/               # React Application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── routes/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Setup Instructions

### Prerequisites
- Java 17+
- Node.js 16+
- MySQL 8.0+
- Maven

### Database Setup
1. Create MySQL database: `college_management`
2. Update database credentials in `backend/src/main/resources/application.properties`

### Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Default Admin Credentials
- Email: admin@college.com
- Password: Admin@123

## API Endpoints

### Authentication
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/forgot-password
- POST /api/auth/reset-password

### Users
- GET /api/users/all
- GET /api/users/{id}
- PUT /api/users/{id}
- DELETE /api/users/{id}

### Students
- GET /api/students/all
- POST /api/students/create
- PUT /api/students/{id}
- DELETE /api/students/{id}

### Teachers
- GET /api/teachers/all
- POST /api/teachers/create
- PUT /api/teachers/{id}
- DELETE /api/teachers/{id}

### Courses
- GET /api/courses/all
- POST /api/courses/create
- PUT /api/courses/{id}
- DELETE /api/courses/{id}

### Results
- GET /api/results/student/{studentId}
- POST /api/results/create
- PUT /api/results/{id}

### Timetable
- GET /api/timetable/all
- POST /api/timetable/create
- PUT /api/timetable/{id}

## Environment Variables

### Backend (application.properties)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/college_management
spring.datasource.username=root
spring.datasource.password=your_password
jwt.secret=your_jwt_secret
spring.mail.username=your_email@gmail.com
spring.mail.password=your_email_password
```

## Running the Application

1. Start MySQL database
2. Run backend Spring Boot application (port 8080)
3. Run frontend React application (port 5173)
4. Access the application at http://localhost:5173

## Security Features

- JWT-based authentication
- Role-based authorization
- Password encryption with BCrypt
- CORS configuration
- Input validation
- SQL injection prevention
