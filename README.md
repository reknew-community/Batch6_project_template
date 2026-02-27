# SmartHub Logistics Operations Dashboard
  A full-stack logistics control tower dashboard built with React (Vite + Ant Design) and FastAPI, designed to monitor shipments, exceptions, vendor performance, and operational KPIs in real time.

# Tech Stack
## Frontend
  React 18
  TypeScript
  Vite
  Ant Design
  React Router
## Backend
  FastAPI
  Python
  MySQL
  PyMySQL
  python-dotenv

# Project Structure
smarthub_operations_dashboard/
  backend/
    main.py
    requirements.txt

  frontend/
    src/
    public/
    package.json
    vite.config.ts

.gitignore
README.md

# Backend Setup (FastAPI)
1. Navigate to backend: cd backend
2. Create virtual environment
  python -m venv .venv
  source .venv/bin/activate   # On Unix or MacOS
  .\.venv\Scripts\activate    # On Windows
3. Install dependencies
  pip install -r requirements.txt
4. Run backend server
  uvicorn main:app --reload --port 8000

# Frontend Setup (React + Vite)
1. Navigate to frontend
  cd frontend

2. Install dependencies
  npm install

3. Run development server
  npm run dev

# Environment Variables
## Backend requires a .env file inside /backend:
  Example:

    MYSQL_HOST=localhost
    MYSQL_USER=yourusername
    MYSQL_PASSWORD=yourpassword
    MYSQL_DB=database_name

# Development Notes
  Backend runs on port 8000
  Make sure CORS is enabled in FastAPI.
  Example (add to your backend/main.py):
  Use a `.gitignore` file to exclude sensitive and dependency folders such as `.venv`, `node_modules`, and `.env`:

    # .gitignore example
    .venv/
    node_modules/
    .env
  ```python
  from fastapi.middleware.cors import CORSMiddleware

  app.add_middleware(
      CORSMiddleware,
      allow_origins=["*"],  # Update with your frontend URL in production
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
  )
  ```
  Make sure CORS is enabled in FastAPI
  Use .gitignore to exclude .venv, node_modules, .env

# Features:
  1. Shipment Status Monitoring
  2. Exceptions Tracking
  3. Vendor Performance View
  4. Analytics Dashboard
  5. Real-time operational insights
  6. REST API integration with FastAPI backend