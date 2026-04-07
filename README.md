# 🏥 MedCare – MERN Full Stack Healthcare Application

MedCare is a full-stack healthcare web application built using the MERN stack (MongoDB, Express, React, Node.js). It enables users to manage healthcare-related activities such as user data, appointments, and more with a modern and responsive UI.

---

## 🚀 Live Demo

* 🌐 Frontend: https://your-frontend.vercel.app
* 🔗 Backend API: https://your-backend.onrender.com

---

## 📌 Features

* 👤 User Authentication (Login/Register)
* 🏥 Healthcare Management System
* 📊 Dashboard UI with modern design
* 🔄 RESTful API integration
* 🔐 Secure backend with environment variables
* 📱 Fully responsive (mobile + desktop)

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Axios
* React Router
* Framer Motion

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

## 📁 Project Structure

```
medcare-app/
│
├── frontend/        # React (Vite) frontend
│
├── backend/         # Node + Express backend
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```
git clone https://github.com/your-username/medcare-app.git
cd medcare-app
```

---

### 2️⃣ Setup Backend

```
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection
CLIENT_URL=http://localhost:5173
```

Run backend:

```
npm run dev
```

---

### 3️⃣ Setup Frontend

```
cd frontend
npm install
```

Create `.env` file:

```
VITE_API_URL=http://localhost:5000
```

Run frontend:

```
npm run dev
```

---

## 🌐 API Endpoints (Sample)

```
GET    /api/users
POST   /api/auth/register
POST   /api/auth/login
```

---

## 🚀 Deployment Guide

### Backend (Render)

* Create a new Web Service
* Set Root Directory → `backend`
* Build Command → `npm install`
* Start Command → `npm start`
* Add environment variables

---

### Frontend (Vercel)

* Import project from GitHub
* Set Root Directory → `frontend`
* Add environment variable:

```
VITE_API_URL=https://your-backend.onrender.com
```

---

## ⚠️ Environment Variables

### Backend

```
PORT=
MONGO_URI=
CLIENT_URL=
JWT_SECRET=
```

### Frontend

```
VITE_API_URL=
```

---

## 🧪 Testing

* Test backend using Postman
* Ensure API endpoints are working before frontend integration

---

## 🧠 Future Enhancements

* 🗓️ Appointment booking system
* 💳 Payment integration
* 📁 Medical records upload
* 🔔 Notifications system

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a new branch
3. Commit your changes
4. Push and create PR

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Abinesh R**

* GitHub: https://github.com/your-username
* LinkedIn: https://linkedin.com/in/your-profile

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
