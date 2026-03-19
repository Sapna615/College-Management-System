# 🧪 College Management System - Complete Test Guide

## 🎯 Complete User Flow Test

### Step 1: Registration Test
1. Go to: `http://localhost:5173/register`
2. Fill in registration form:
   - Name: Test User
   - Email: test@example.com
   - Password: Test@123
   - Role: Administrator (new option!)
   - Department: Test Department
   - Employee ID: EMP001
3. Click "Register"
4. ✅ Expected: "Registration successful! Please login."
5. ✅ Expected: Redirect to login page

### Step 2: Login Test
1. Go to: `http://localhost:5173/login`
2. Enter credentials:
   - Email: test@example.com (or admin@college.com)
   - Password: Test@123 (or Admin@123)
3. Click "Sign in"
4. ✅ Expected: Redirect to dashboard based on role

### Step 3: Dashboard Test
1. **Admin Dashboard:** `http://localhost:5173/admin/dashboard`
   - Should show statistics, charts, admin menu
2. **Teacher Dashboard:** `http://localhost:5173/teacher/dashboard`
   - Should show teacher-specific features
3. **Student Dashboard:** `http://localhost:5173/student/dashboard`
   - Should show student-specific features

## 🎯 Expected Complete Flow

```
Registration → Login → Dashboard → Full Functionality
     ↓           ↓           ↓
   User      Auth     Role-based   Features
   Created    Token     Interface
```

## 🔧 Troubleshooting

### Registration Issues
- Check backend is running: `curl http://localhost:8080/api/auth/register`
- Check CORS: Look for 403/404 errors
- Check form validation: All fields required

### Login Issues
- Verify user exists in database
- Check password encryption
- Check JWT token generation

### Dashboard Issues
- Verify role-based routing
- Check API calls for data
- Check user permissions

## 🗄️ Database Access

### H2 Console
- URL: `http://localhost:8080/api/h2-console`
- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: (empty)

### Check Tables
```sql
SELECT * FROM users WHERE role = 'ADMIN';
SELECT * FROM students;
SELECT * FROM teachers;
SELECT * FROM courses;
```

## 🚀 Success Indicators

✅ **Registration:** User created and stored in database
✅ **Login:** JWT token generated and stored
✅ **Redirect:** Correct dashboard loaded based on role
✅ **Dashboard:** Data loaded from APIs
✅ **Navigation:** Menu items appear based on role

## 🎊 Features to Test

### Admin Features
- [ ] User Management (CRUD operations)
- [ ] Student Management (enrollment, profiles)
- [ ] Teacher Management (assignments, profiles)
- [ ] Course Management (creation, scheduling)
- [ ] Timetable Management (create, view, edit)
- [ ] Result Management (grades, reports)

### Authentication Flow
- [ ] Register new user
- [ ] Login with credentials
- [ ] Token validation
- [ ] Auto-logout on token expiry
- [ ] Password reset functionality

### Data Flow
- [ ] Form validation
- [ ] API error handling
- [ ] Loading states
- [ ] Success/error messages
- [ ] Navigation between pages

**Test each feature and mark completed!**
