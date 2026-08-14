# Deployment Guide for Personal Expense Tracker

This guide walks you through deploying your Expense Tracker to production using **Render** (for the Django backend and PostgreSQL database) and **Vercel** (for the React frontend).

## Architecture
- **Frontend**: React SPA hosted on Vercel (`https://your-frontend.vercel.app`)
- **Backend**: Django REST API hosted on Render (`https://your-backend.onrender.com`)
- **Database**: PostgreSQL hosted on Render

---

## 1. Prepare and Push to GitHub

1. Commit all your changes (including the new `requirements.txt`, `build.sh`, `vercel.json`, and `settings.py` updates).
2. Push your code to your GitHub repository.

---

## 2. Deploy Database (Render)

1. Go to [Render](https://render.com/) and log in.
2. Click **New +** and select **PostgreSQL**.
3. Name it (e.g., `expense-tracker-db`).
4. Click **Create Database**.
5. Once created, copy the **Internal Database URL** (you will need this for the backend).

---

## 3. Deploy Backend (Render)

1. In Render, click **New +** and select **Web Service**.
2. Connect your GitHub repository (`ANGELSHIFT/ExpenseTracker`).
3. Configure the Web Service:
   - **Name**: `expense-tracker-api`
   - **Environment**: `Python`
   - **Root Directory**: `backend` (Important!)
   - **Build Command**: `./build.sh` (or `bash build.sh`)
   - **Start Command**: `gunicorn ExpenseTracker.wsgi:application`
4. Expand **Advanced** and add **Environment Variables**:
   - `DATABASE_URL` = [Paste the Internal Database URL from step 2]
   - `SECRET_KEY` = [Generate a long, random string. Do not use your dev key]
   - `DEBUG` = `False`
   - `ALLOWED_HOSTS` = `.onrender.com`
   - `CORS_ALLOWED_ORIGINS` = `https://your-frontend.vercel.app` (You can update this later once you deploy the frontend and get its URL).
   - `CSRF_TRUSTED_ORIGINS` = `https://your-frontend.vercel.app`
5. Click **Create Web Service**.
6. Wait for the build to finish. Copy your backend URL (e.g., `https://expense-tracker-api.onrender.com`).

---

## 4. Deploy Frontend (Vercel)

1. Go to [Vercel](https://vercel.com/) and log in.
2. Click **Add New** -> **Project**.
3. Import your GitHub repository (`ANGELSHIFT/ExpenseTracker`).
4. Configure the Project:
   - **Project Name**: `expense-tracker`
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `frontend` (Important!)
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Expand **Environment Variables** and add:
   - `REACT_APP_API_URL` = [Paste your Render backend URL from step 3. Make sure there is NO trailing slash, e.g., `https://expense-tracker-api.onrender.com`]
6. Click **Deploy**.
7. Once finished, copy your frontend URL (e.g., `https://expense-tracker.vercel.app`).

---

## 5. Final Configuration

1. Go back to your **Render Web Service** settings.
2. Update the `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS` environment variables to use your real Vercel URL.
   *(Make sure to exclude trailing slashes! E.g., `https://expense-tracker-yourname.vercel.app`)*
3. Save the changes (Render will automatically redeploy or restart the service).

---

## 6. Testing

- Open your Vercel URL in your browser.
- Try logging in.
- Try adding an expense.
- If everything works, your production deployment is complete!
