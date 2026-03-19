# 🚀 College Management System - Startup Guide

## 📋 Prerequisites
- Java 17+
- Node.js 16+
- Maven 3.6+

## 🔧 Quick Start

### Option 1: Automatic Startup (Recommended)
```bash
./start-app.sh
```

### Option 2: Manual Startup

#### Step 1: Start Backend
```bash
cd backend
mvn spring-boot:run
```
Wait for: `Started CollegeManagementApplication`

#### Step 2: Start Frontend (New Terminal)
```bash
cd frontend
npm run dev
```

## 🌐 Access Points

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | Main Application |
| **Backend API** | http://localhost:8080/api | REST API |
| **H2 Console** | http://localhost:8080/api/h2-console | Database Admin |

## 🔑 Default Credentials

### Admin Login
- **Email:** `admin@college.com`
- **Password:** `Admin@123`

### H2 Database Console
- **JDBC URL:** `jdbc:h2:mem:testdb`
- **Username:** `sa`
- **Password:** (leave empty)

## 🛠️ Troubleshooting

### Port Conflicts
- **Backend uses:** 8080
- **Frontend uses:** 5173
- If ports are busy, change in:
  - Backend: `backend/src/main/resources/application.properties`
  - Frontend: `frontend/vite.config.js`

### Connection Issues
1. Ensure backend is running first
2. Check firewall settings
3. Verify CORS configuration

### Database Issues
- H2 is in-memory (data lost on restart)
- For persistent data, configure MySQL/PostgreSQL

## 📱 Features

### Admin Features
- 👥 User Management
- 📚 Course Management
- 📅 Timetable Management
- 📝 Result Management
- 📊 Dashboard & Analytics

### Teacher Features
- 📖 Course Management
- 📝 Grade Management
- 📅 Schedule View
- 👥 Student Management

### Student Features
- 📊 Profile Management
- 📝 View Results
- 📅 View Timetable
- 📚 Course Enrollment

## 🔐 Security Features
- JWT Authentication
- Role-based Access Control
- CORS Protection
- Password Encryption

## 🗄️ Database Schema
The system automatically creates the following tables:
- `users` - User accounts
- `students` - Student profiles
- `teachers` - Teacher profiles
- `courses` - Course information
- `results` - Student grades
- `attendance` - Attendance records
- `timetable` - Class schedules

## 🚀 Development

### Backend Development
```bash
cd backend
mvn clean compile
mvn spring-boot:run
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### API Documentation
- Swagger UI: http://localhost:8080/api/swagger-ui.html (if enabled)

## 📞 Support

For issues:
1. Check console logs
2. Verify backend is running
3. Check network connectivity
4. Review this guide
