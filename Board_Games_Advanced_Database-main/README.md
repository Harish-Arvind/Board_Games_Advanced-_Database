# Board Games App 🎲

A full-stack application to explore, search, and manage a collection of board games. Built with **Vue.js (frontend)** and **Node.js + Express + MySQL (backend)**.

---

## 📦 Project Structure

```
proj/
├── backend/           # Node.js + Express + Sequelize + MySQL
└── frontend/          # Vue.js 3 + Vite
```

---

## 🚀 Getting Started

### 🔧 Prerequisites

- Node.js (v16+ recommended)
- MySQL server
- npm (Node package manager)

---

## 🛠️ Backend Setup (Node.js + MySQL)

### 1. Configure Environment Variables

Create a `.env` file inside the `backend/` folder:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=board_games
PORT=5000
```

### 2. Install Dependencies

```bash
cd proj/backend
npm install
```

### 3. Initialize the Database

Ensure your MySQL server is running, and then run the seed script:

```bash
node seed.js
```

This will create the tables and populate them with games.

### 4. Run the Server

```bash
node server.js
```

The backend will start at [http://localhost:5000](http://localhost:5000)

---

## 🌐 Frontend Setup (Vue.js)

### 1. Install Dependencies

```bash
cd proj
npm install
```

### 2. Run the Frontend

```bash
npm run dev
```

It should start at [http://localhost:5173](http://localhost:5173)

> Make sure the backend is also running on port 5000, as the frontend fetches game data from it.

---

## 💡 Features

- Search board games by name
- View detailed info with modal popup
- Ratings, player count, and description
- Pagination
- Admin feature (if enabled): add/edit games (WIP)
- MySQL triggers, views, procedures included (optional)

---

