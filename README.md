# ⚡ AI Disaster Resource Allocation Platform

Full-stack disaster management platform — **React** frontend + **FastAPI** backend + **PostgreSQL** database + **ML** integration.

---

## 📁 Project Structure

```
disaster_app/
│
├── frontend/                        ← React app (Create React App)
│   ├── public/index.html
│   ├── package.json
│   └── src/
│       ├── App.jsx                  ← Root component + routing
│       ├── index.js                 ← Entry point
│       ├── styles/global.css        ← Theme variables (dark + light)
│       ├── context/
│       │   ├── ThemeContext.jsx     ← Dark/Light theme state
│       │   └── AuthContext.jsx      ← User auth state
│       ├── components/
│       │   ├── ui/
│       │   │   ├── AuthModal.jsx    ← Split-panel login/register
│       │   │   ├── Button.jsx
│       │   │   ├── Card.jsx
│       │   │   └── Badge.jsx
│       │   ├── layout/
│       │   │   ├── Navbar.jsx       ← Nav + Dark/Light toggle
│       │   │   └── Sidebar.jsx      ← Dashboard sidebar
│       │   ├── map/
│       │   │   └── IndiaMap.jsx     ← SVG India map + markers
│       │   └── charts/
│       │       └── Charts.jsx       ← Recharts analytics
│       ├── pages/
│       │   ├── Home.jsx             ← Hero + stats + map + how-it-works
│       │   ├── MapPage.jsx          ← Full map page
│       │   ├── About.jsx
│       │   ├── DashboardRouter.jsx  ← Routes to correct dashboard by role
│       │   ├── citizen/CitizenDashboard.jsx
│       │   ├── volunteer/VolunteerDashboard.jsx
│       │   └── admin/AdminDashboard.jsx
│       └── utils/data.js            ← Mock data + dummy ML helpers
│
├── backend/                         ← FastAPI app
│   ├── main.py                      ← App entry + CORS + router registration
│   ├── database.py                  ← PostgreSQL connection (SQLAlchemy)
│   ├── models.py                    ← DB models: User, DisasterReport, etc.
│   ├── ml_integration.py            ← Dummy ML functions (replace with real)
│   ├── setup_db.sql                 ← Run once in PostgreSQL
│   ├── requirements.txt
│   ├── .env.example                 ← Copy to .env and fill in
│   └── routes/
│       ├── auth.py                  ← POST /auth/register, /auth/login
│       ├── disasters.py             ← CRUD for disaster reports
│       ├── analytics.py             ← Summary stats
│       ├── ml.py                    ← ML prediction endpoints
│       └── users.py                 ← User management
│
└── ml_models/                       ← Placeholder for trained models
    ├── README.md                    ← Training instructions
    ├── text_classifier/model.py
    ├── image_classifier/model.py
    └── resource_predictor/model.py
```

---

## 🚀 Setup

### 1. PostgreSQL

```sql
-- In psql or pgAdmin:
CREATE DATABASE disaster_ai;
```

### 2. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

pip install -r requirements.txt

# Create backend/.env from example
cp .env.example .env
# Edit .env → set your PostgreSQL password

python main.py
# → API at http://localhost:8000
# → Docs at http://localhost:8000/docs
```

### 3. Frontend

```bash
cd frontend
npm install
npm start
# → App at http://localhost:3000
```

---

## 🔐 Demo Login (Frontend)

| Role      | Email                 | Password  |
|-----------|-----------------------|-----------|
| Admin     | admin@demo.com        | demo123   |
| Citizen   | citizen@demo.com      | demo123   |
| Volunteer | volunteer@demo.com    | demo123   |

---

## 🎨 Theme Toggle

The navbar has a 🌙 / ☀️ pill toggle:
- **Dark** — Deep navy/black professional theme  
- **Light** — Clean white/blue beautiful theme  

Preference is saved to `localStorage`.

---

## 📡 API Endpoints

| Method | Endpoint                   | Description            |
|--------|----------------------------|------------------------|
| POST   | /auth/register             | Create account         |
| POST   | /auth/login                | Login → JWT token      |
| GET    | /disasters/                | All reports            |
| GET    | /disasters/active          | Active only            |
| POST   | /disasters/report          | Submit new report      |
| PATCH  | /disasters/{id}/status     | Update status          |
| DELETE | /disasters/{id}            | Delete report          |
| GET    | /analytics/summary         | Platform stats         |
| POST   | /ml/predict-text           | Text classification    |
| POST   | /ml/predict-resources      | Resource prediction    |
| GET    | /users/                    | All users (admin)      |

---

## 🧠 ML Models (Phase 2)

Edit `backend/ml_integration.py` to replace dummy functions with real models. See `ml_models/README.md` for training instructions.
