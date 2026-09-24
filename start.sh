#!/bin/bash
echo "Starting TraffiQ Prototype..."

# Start Backend
echo "Starting FastAPI Backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --port 8000 &
BACKEND_PID=$!

# Start Frontend
echo "Starting React Frontend..."
cd ../frontend
npm install
npm run dev &
FRONTEND_PID=$!

echo "Prototype is running!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo "Press Ctrl+C to stop."

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
