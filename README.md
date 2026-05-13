# 🔐 Password Security Analyzer - PasSec

A full-stack cybersecurity tool that simulates real-world brute-force and dictionary attacks on passwords using cryptographic entropy math and GPU-speed benchmarks.

---

## 🏗️ Project Structure

```
password-analyzer/
├── frontend/                          # React + Vite + Tailwind CSS
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ParticleCanvas.jsx
│   │   │   ├── ResultsPanel.jsx
│   │   │   ├── StrengthMeter.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── hooks/
│   │   │   ├── usePasswordAnalysis.js
│   │   │   └── useTheme.js
│   │   ├── pages/
│   │   │   ├── AnalyzerPage.jsx
│   │   │   └── LandingPage.jsx
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── utils/
│   │   │   └── formatters.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                           # Python FastAPI
│   ├── data/
│   │   └── common_passwords.txt       # Top 100k common passwords wordlist (generated or downloaded)
│   ├── routers/
│   │   ├── __init__.py
│   │   └── analyze.py                 # POST /api/analyze-password endpoint
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── dictionary.py              # Dictionary attack engine (set lookup)
│   │   ├── download_wordlist.py       # Creates/downloads the top-100k wordlist
│   │   ├── entropy.py                 # Entropy + brute-force estimation
│   │   └── scorer.py                  # Overall verdict + recommendations
│   ├── .env.example
│   ├── main.py                        # FastAPI app entrypoint
│   └── requirements.txt
│
├── .gitignore
└── README.md
```

### 📄 File-by-file purpose + skills used (Frontend + Backend)

> Each line lists: **file** — purpose — **skills/tech used**

#### Frontend

- `frontend/index.html` — HTML entry + metadata — **Vite**
- `frontend/vite.config.js` — Dev server + `/api` proxy to FastAPI — **Vite**
- `frontend/package.json` — Frontend dependencies/scripts — **React, Vite, Tailwind CSS**
- `frontend/package-lock.json` — Reproducible npm dependency lockfile — **npm**
- `frontend/tailwind.config.js` — Theme tokens + Tailwind scanning config — **Tailwind CSS**
- `frontend/eslint.config.js` — Lint rules for React + hooks + Vite refresh — **ESLint, React**
- `frontend/.gitignore` — Ignore frontend build/deps — **Git**
- `frontend/public/favicon.svg` — App icon asset — **Vite**
- `frontend/public/icons.svg` — Icon sprite asset — **Vite**

- `frontend/src/main.jsx` — React bootstrap + React Router mounting — **React 18, React Router v6**
- `frontend/src/App.jsx` — Route definitions and theme wiring — **React 18, React Router v6**

- `frontend/src/pages/LandingPage.jsx` — Landing/marketing page UI + animations — **React 18, React Router v6, Framer Motion, Lucide React**
- `frontend/src/pages/AnalyzerPage.jsx` — Analyzer UI, input flow, result rendering — **React 18, Axios, Framer Motion, Lucide React**

- `frontend/src/hooks/useTheme.js` — Dark-mode persistence via `localStorage` + `<html class="dark">` — **React 18, Tailwind CSS**
- `frontend/src/hooks/usePasswordAnalysis.js` — Calls backend analyze endpoint + manages loading/error state — **React 18, Axios**

- `frontend/src/components/Navbar.jsx` — Top nav + routing links + theme toggle — **React 18, React Router v6, Lucide React**
- `frontend/src/components/ThemeToggle.jsx` — Dark/light toggle button animation — **React 18, Framer Motion, Lucide React**
- `frontend/src/components/StrengthMeter.jsx` — Client-side “as-you-type” strength indicator — **React 18, Framer Motion**
- `frontend/src/components/ResultsPanel.jsx` — Server-side verdict display (shows **COMPROMISED** on breach match) — **React 18, Framer Motion**
- `frontend/src/components/ParticleCanvas.jsx` — 3D animated particle background — **React 18, Three.js**

- `frontend/src/utils/formatters.js` — Formatting + verdict mapping helpers — **JavaScript (React app utility)**
- `frontend/src/styles/globals.css` — Global styles + Tailwind import + theme tokens — **Tailwind CSS**

#### Backend

- `backend/main.py` — FastAPI app setup, CORS, lifecycle loading of dictionary wordlist, `/health` — **FastAPI, Uvicorn, Python-dotenv, CORS Middleware**
- `backend/requirements.txt` — Python dependencies — **FastAPI stack**
- `backend/.env.example` — Example env vars (CORS origins, wordlist path, host/port) — **Python-dotenv**

- `backend/routers/__init__.py` — Router package marker — **Python**
- `backend/routers/analyze.py` — `POST /api/analyze-password` endpoint + request/response models — **FastAPI, Pydantic**

- `backend/utils/__init__.py` — Utils package marker — **Python**
- `backend/utils/dictionary.py` — In-memory dictionary attack engine (case-insensitive set lookup) — **Python**
- `backend/utils/download_wordlist.py` — Downloads/builds `common_passwords.txt` (top 100k) — **Python**
- `backend/utils/entropy.py` — Entropy math + brute-force crack-time estimation — **Python (math/log2)**
- `backend/utils/scorer.py` — Score label + recommendations + breach override — **Python**

- `backend/data/common_passwords.txt` — Top 100k common-password list used for breach checks — **Dictionary attack data**

---

## 🚀 Getting Started

### Backend (Python FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Download password list
python utils/download_wordlist.py

# Start server
uvicorn main:app --reload --port 8000
```

### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: https://passec-2dv.pages.dev/  
Backend API at:   https://passec-backend.onrender.com 
API Docs at:      https://passec-backend.onrender.com/docs

---

## 🛠️ Tech Stack

### Frontend
| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS (v4) | Utility-first styling |
| React Router v6 | Client-side routing |
| Framer Motion | Animations & transitions |
| Three.js | 3D particle background |
| Axios | HTTP client for API calls |
| Lucide React | Icon library |

### Backend
| Tool | Purpose |
|------|---------|
| FastAPI | High-performance Python API |
| Uvicorn | ASGI server |
| Python-dotenv | Environment variable management |
| CORS Middleware | Allow frontend requests |
| Pydantic | Request/response validation |
| Math / Log2 | Entropy calculations |

---

## 📡 API Reference

### `POST /api/analyze-password`

**Request:**
```json
{ "password": "MyP@ssw0rd!" }
```

**Response:**
```json
{
  "length": 11,
  "pool_size": 94,
  "entropy_bits": 72.4,
  "has_lowercase": true,
  "has_uppercase": true,
  "has_digits": true,
  "has_symbols": true,
  "dictionary_attack": {
    "breached": false
  },
  "brute_force_attack": {
    "combinations": 5.19e21,
    "time_to_crack_seconds": 51900,
    "human_readable_time": "14.4 Hours"
  },
  "overall_score": "Strong",
  "recommendations": [
    "Increase length to 16+ characters for near-uncrackable security.",
    "Avoid common substitutions like @ for 'a' — attackers know these patterns.",
    "Consider using a passphrase like 'correct-horse-battery-staple'."
  ]
}
```

---

## 🔬 How the Math Works

### Entropy Formula
```
E = L × log₂(R)
```
- `L` = password length
- `R` = character pool size (26 lowercase, +26 upper, +10 digits, +32 symbols = 94 max)

### Brute Force Time
```
combinations = R^L
seconds_to_crack = combinations / GPU_SPEED
```
- GPU speed assumed: **100,000,000,000 guesses/sec** (RTX 4090 benchmark)

---

## ⚠️ Disclaimer

This tool is for **educational purposes only**. Never submit real passwords to any online tool. All password analysis should be done locally.
