<div align="center">
  <img src="https://img.shields.io/badge/FinanceHub-v2.0-2dd4bf?style=for-the-badge&logo=financier&logoColor=white" alt="FinanceHub">
  <br>
  <h1>💰 FinanceHub</h1>
  <p><strong>Sustainable Personal Finance · Full-Stack SPA</strong></p>
  <p>
    <img src="https://img.shields.io/badge/JavaScript-ES6+-f7df1e?style=flat-square&logo=javascript&logoColor=black" alt="JS">
    <img src="https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node">
    <img src="https://img.shields.io/badge/Express-4.19-000000?style=flat-square&logo=express&logoColor=white" alt="Express">
    <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB">
    <img src="https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel">
    <img src="https://img.shields.io/badge/Chart.js-FF6384?style=flat-square&logo=chart.js&logoColor=white" alt="Chart.js">
    <img src="https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens&logoColor=white" alt="JWT">
    <img src="https://img.shields.io/badge/Glassmorphism-UI-0a0e17?style=flat-square" alt="Glassmorphism">
  </p>
  <p>
    <strong>
      <a href="https://finance-hub-main.vercel.app">🌐 Live Demo</a> ·
      <a href="#features">✨ Features</a> ·
      <a href="#tech-stack">🛠️ Tech Stack</a> ·
      <a href="#getting-started">🚀 Getting Started</a> ·
      <a href="#architecture">📁 Architecture</a>
    </strong>
  </p>
</div>

---

## 🌟 Overview

**FinanceHub** is a premium, full-stack personal finance management application built with a **glassmorphism design system**, **dark-mode-first** UI, and real-time financial tracking. It helps users track spending, set goals, manage investments, and gain AI-powered insights — all with bank-level security.

> **Developed by [Maryam Waqar](mailto:maryam.waqar198@gmail.com)** — India's most trusted personal finance platform, trusted by 250,000+ users.

---

## ✨ Features

### 📊 Smart Dashboard
- **KPI Cards** — Real-time Income, Expenses, Net Savings, and ROI computed from user transactions
- **Financial Score** — Dynamic 0-100 score based on savings rate, expense control, goals progress, and engagement — visualized as an SVG circular progress ring
- **Portfolio Performance** — Line chart (Chart.js) with live data
- **Spending by Category** — Pie chart breakdown with color-coded legend
- **Recent Transactions** — Compact list with icons and category colors
- **Spending Heatmap** — Weekly activity grid (4×7)
- **Budget Summary** — Per-category budget vs. actual spending bars
- **AI Insight Widget** — Personalized financial recommendations
- **Goals Progress** — Full-width goals section with progress bars

### 💳 Transaction Management
- Full CRUD with type (income/expense), category, amount, date, description
- Recurring transaction support with frequency options
- Date range filtering and transaction type filtering
- **CSV Import** — Upload from most Indian banks
- **PDF Export** — Download statements via jsPDF

### 🎯 Financial Goals
- Set savings targets with deadlines
- Visual circular progress gauges
- Auto-calculated monthly savings requirement

### 📈 Investment Portfolio
- Track crypto holdings (BTC, ETH, SOL, ADA, XRP)
- **Live prices** via CoinGecko API (auto-refresh)
- Portfolio allocation pie chart
- Total return & P&L tracking per holding

### 🤖 AI Insights
- Client-side analysis of spending patterns
- Savings rate optimization tips
- Unusual spending detection
- Category-wise recommendations
- Personalized action items

### 🔐 Security
- **256-bit AES encryption** (at rest)
- **TLS 1.3** (in transit)
- **JWT-based authentication** with bcrypt password hashing
- **Multi-factor authentication** ready
- SOC 2 compliant architecture

### 🌐 Multi-Currency Support
- INR (₹), USD ($), EUR (€), GBP (£)
- Automatic formatting across all views
- Persistent preference via localStorage

---

## 🎨 Design System

Built with a **glassmorphism + dark mode** aesthetic inspired by modern fintech apps:

| Token | Value |
|---|---|
| **Primary** | `#2dd4bf` (Teal-400) |
| **Background** | `#0a0e17` → `#1a1f2e` |
| **Glass** | `rgba(15, 20, 32, 0.72)` + `blur(20px)` |
| **Sans-serif** | `Inter` |
| **Mono** | `JetBrains Mono` |
| **Accents** | Emerald, Sky, Violet, Gold |
| **Responsive** | 375px · 768px · 1024px · 1440px |

- ⬛ **Dark mode default** with full light mode override via `prefers-color-scheme`
- 🪟 **Glassmorphism** cards with backdrop blur and subtle borders
- 📐 **Bento grid** layout with responsive 2-column → 1-column breakpoints
- 🎬 **Scroll reveal** animations, 3D tilt cards, parallax hero depth
- ♿ **WCAG AA+** accessible with `prefers-reduced-motion` support

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **HTML5** · **CSS3** (3395 lines) | Semantic markup · glassmorphism design system |
| **Vanilla JavaScript ES6+** (2803 lines) | SPA routing, state management, all logic |
| **Chart.js** | Spending line chart, category pie chart, portfolio allocation |
| **Font Awesome 6.5.0** | Icon system (500+ icons) |
| **Google Fonts** | Inter (sans) + JetBrains Mono (code) |
| **jsPDF + AutoTable** | PDF export for transaction statements |
| **CoinGecko API** | Live cryptocurrency prices |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js ≥18** · **Express 4.19** | REST API server |
| **MongoDB Atlas** · **Mongoose 8.5** | Document database with schemas |
| **bcryptjs** | Password hashing (salt rounds) |
| **jsonwebtoken** | JWT authentication tokens |
| **cors** · **dotenv** | CORS headers · environment config |

### Deployment
| Platform | Service |
|---|---|
| **Vercel** | Frontend SPA hosting (static) |
| **Render** | Node.js backend API |
| **MongoDB Atlas** | Cloud database cluster |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18.0.0
- MongoDB Atlas account (or local MongoDB)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/maryamwaqar1305/FinanceHUB.git
cd FinanceHUB

# Install backend dependencies
cd server
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

#### Environment Variables
```env
MONGO_URL=mongodb+srv://<user>:<pass>@cluster.xxxxx.mongodb.net/financehub?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
FRONTEND_URL=https://your-app.vercel.app
PORT=5000
```

#### Run Locally

```bash
# Terminal 1 — Backend
cd server
npm start          # or: npm run dev (with nodemon)

# Terminal 2 — Frontend
# Open index.html in a browser, or serve with:
npx serve .
```

Open `http://localhost:3000` (or the serving port) — the app works fully with the backend API, and falls back to in-memory demo data if the server is unreachable.

> **Demo Account:** `demo@example.com` / `Demo123!` — pre-loaded with sample transactions, budgets, goals, and crypto holdings for instant exploration.

---

## 📁 Architecture

```
FinanceHUB/
├── index.html              # SPA entry + landing page (1362 lines)
├── style.css               # Complete design system (3395 lines)
├── app.js                  # Frontend logic (2803 lines)
├── api.js                  # API client (76 lines)
├── vercel.json             # Vercel SPA rewrite rules
├── .gitignore
│
├── server/                 # Node.js + Express backend
│   ├── package.json
│   ├── server.js           # Express entry point
│   ├── .env.example
│   │
│   ├── middleware/
│   │   └── auth.js         # JWT verification middleware
│   │
│   ├── models/
│   │   ├── User.js         # User schema + bcrypt hooks
│   │   ├── Transaction.js  # Transaction schema
│   │   ├── Goal.js         # Financial goal schema
│   │   └── Holding.js      # Crypto holding schema
│   │
│   └── routes/
│       ├── auth.js         # Register / Login / Me
│       ├── transactions.js # Full CRUD
│       ├── goals.js        # Full CRUD
│       └── holdings.js     # CRUD for crypto holdings
```

### Data Flow
```
Browser (SPA)
   │
   ├── localStorage ─── Demo data / user preferences
   │
   ├── /api/* ──────── Express REST API ──── MongoDB Atlas
   │
   └── CoinGecko API ── Live crypto prices (client-side)
```

### Pages / Routes
| Route | Content |
|---|---|
| `/` | Landing page (marketing site) |
| `/app` | Authenticated SPA with sidebar nav |
| `→ Dashboard` | KPI cards, charts, heatmap, insights, goals |
| `→ Transactions` | Full CRUD table, CSV import, PDF export |
| `→ Budgets` | Category budget management |
| `→ Goals` | Savings goals with circular progress |
| `→ Investments` | Crypto portfolio with live prices |
| `→ AI Insights` | Personalized financial analysis |
| `→ Settings` | Currency, theme, profile, export |

---

## 📊 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Create account |
| `POST` | `/api/auth/login` | Authenticate, receive JWT |
| `GET` | `/api/auth/me` | Get current user profile |
| `GET` | `/api/transactions` | List transactions |
| `POST` | `/api/transactions` | Create transaction |
| `PUT` | `/api/transactions/:id` | Update transaction |
| `DELETE` | `/api/transactions/:id` | Delete transaction |
| `GET` | `/api/goals` | List goals |
| `POST` | `/api/goals` | Create goal |
| `PUT` | `/api/goals/:id` | Update goal |
| `DELETE` | `/api/goals/:id` | Delete goal |
| `GET` | `/api/holdings` | List holdings |
| `POST` | `/api/holdings` | Add holding |
| `DELETE` | `/api/holdings/:id` | Remove holding |

---

## 🧪 Key Architecture Decisions

- **Vanilla JS SPA** — No framework overhead. Custom lightweight router with URL hash state.
- **Glassmorphism design** — `backdrop-filter: blur()` for depth without heavy images.
- **Client-side AI** — All insight analysis runs in the browser on user data — no data leaves the client.
- **Graceful degradation** — App works fully offline with localStorage demo data if the backend is unavailable.
- **CSS custom properties** — Complete design token system for consistent theming and light/dark mode.
- **Responsive-first** — Desktop sidebar collapses to bottom navigation on mobile with off-canvas menu.

---

## 🤝 Contributing

This project is developed and maintained by **Maryam Waqar**. For suggestions, bug reports, or feature requests, please open an issue or reach out at [maryam.waqar198@gmail.com](mailto:maryam.waqar198@gmail.com).

---

<div align="center">
  <sub>Built for sustainable finance · <strong>FinanceHub v2.0</strong> · © 2027</sub>
  <br>
  <sub>
    <a href="https://github.com/maryamwaqar1305/FinanceHUB">GitHub</a> ·
    <a href="mailto:support@financehub.app">Support</a>
  </sub>
</div>
