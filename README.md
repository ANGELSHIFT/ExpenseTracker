# Personal Expense Tracker

A full-stack interactive Personal Expense Tracker application built with **React** (Frontend) and **Django REST Framework** (Backend).

## 🚀 Live Demo
- **Frontend App**: [https://expense-tracker-sd3r-kqrfs4b2z-angelmariajoy225-4047s-projects.vercel.app](https://expense-tracker-sd3r-kqrfs4b2z-angelmariajoy225-4047s-projects.vercel.app)
- **Backend API**: [https://expense-tracker-api-lpil.onrender.com/api/](https://expense-tracker-api-lpil.onrender.com/api/)

---

## 🛠️ Tech Stack
- **Frontend**: React.js, Context API, CSS3 (Minimalist Dark Theme, Dynamic Micro-interactions)
- **Backend**: Django, Django REST Framework, JWT Authentication (`djangorestframework-simplejwt`)
- **Database**: PostgreSQL (Production on Render) / SQLite (Local Development)
- **Hosting**: Vercel (Frontend), Render (Backend & PostgreSQL)

---

## 🌟 Key Features
- **Interactive Calendar Dashboard**: View daily spending, monthly totals, and budget analytics.
- **Expense Management**: Add, edit, and delete daily expenses in real-time.
- **JWT Authentication**: Secure user login and registration token-based sessions.
- **Responsive & Modern UI**: Smooth micro-animations and black & white aesthetic.

---

## 📋 Deployment Instructions
See the detailed step-by-step deployment guide in [`DEPLOYMENT.md`](./DEPLOYMENT.md).

### Quick Summary:
1. **Backend & DB (Render)**:
   - Create PostgreSQL Database on Render.
   - Deploy Django Web Service (Root directory: `backend`, Build: `./build.sh`, Start: `gunicorn ExpenseTracker.wsgi:application`).
   - Set environment variables (`DATABASE_URL`, `SECRET_KEY`, `DEBUG=False`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`).

2. **Frontend (Vercel)**:
   - Import repository to Vercel (Root directory: `frontend`, Build: `npm run build`).
   - Set environment variable (`REACT_APP_API_URL` = Render backend URL).

3. **Update GitHub Repo**:
   - Update the Live Demo links in this `README.md` and push to GitHub.

---

## 💻 Local Development Setup

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm start
```
