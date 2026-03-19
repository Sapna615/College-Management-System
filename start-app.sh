#!/bin/bash

echo "🚀 Starting College Management System..."

# Start Backend
echo "📊 Starting Backend..."
cd backend
mvn spring-boot:run &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 10

# Check if backend is running
if curl -s http://localhost:8080/api > /dev/null; then
    echo "✅ Backend started successfully!"
else
    echo "❌ Backend failed to start!"
    kill $BACKEND_PID
    exit 1
fi

# Start Frontend
echo "🌐 Starting Frontend..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "🎉 College Management System is ready!"
echo "📊 Backend: http://localhost:8080/api"
echo "🌐 Frontend: http://localhost:5173"
echo "🗄️ H2 Console: http://localhost:8080/api/h2-console"
echo ""
echo "🔑 Default Admin Credentials:"
echo "   Email: admin@college.com"
echo "   Password: Admin@123"
echo ""
echo "Press Ctrl+C to stop both services"

# Wait for user to stop
trap "echo '🛑 Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
