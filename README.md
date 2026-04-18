# 🛒 Add to Cart — Software Engineering Assignment

A full-stack **Add to Cart** web application demonstrating:
- RESTful API (Node.js + Express)
- Containerization (Docker + Docker Compose)
- Automated Testing (Jest + Supertest)
- CI/CD Pipeline (GitHub Actions)

---

## 📁 Project Structure

```
cart-app/
├── backend/
│   ├── server.js          # Express REST API
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── index.html         # Shopping UI
│   └── Dockerfile
├── tests/
│   └── cart.test.js       # 15 Jest tests
├── .github/
│   └── workflows/
│       └── ci-cd.yml      # GitHub Actions pipeline
├── docker-compose.yml
└── README.md
```

---

## 🚀 Run with Docker (Recommended)

```bash
# 1. Clone the repo
git clone https://github.com/<your-username>/cart-app.git
cd cart-app

# 2. Start everything
docker compose up --build

# 3. Open in browser
# Frontend → http://localhost:3000
# Backend  → http://localhost:5000
```

---

## 🧪 Run Tests

```bash
cd backend
npm install
npm test
```

---

## 🔌 API Endpoints

| Method | Endpoint           | Description           |
|--------|--------------------|-----------------------|
| GET    | /api/products      | List all products     |
| GET    | /api/cart          | Get cart contents     |
| POST   | /api/cart          | Add item to cart      |
| PUT    | /api/cart/:id      | Update item quantity  |
| DELETE | /api/cart/:id      | Remove item           |
| DELETE | /api/cart          | Clear entire cart     |
| GET    | /health            | Health check          |

---

## ⚙️ CI/CD Pipeline

Every push to `main` runs 3 jobs automatically:

1. **🧪 Test** — Runs all 15 Jest tests with coverage
2. **🐳 Build** — Builds both Docker images
3. **🔗 Integration** — Starts compose, tests live API endpoints

---

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, Vanilla JS
- **Testing**: Jest, Supertest
- **DevOps**: Docker, Docker Compose, GitHub Actions
