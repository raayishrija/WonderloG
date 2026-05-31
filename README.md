# WanderLog 🌍✦

> Your Travel Bucket List, Powered by Real-World Data

A single-page React application where authenticated users explore countries, search and filter them, view rich details, and maintain a personal travel bucket list.

---

## 🚀 How to Run Locally

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd wanderlog

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev

# 4. Open in browser
# http://localhost:5173
```

> No `.env` file needed — all APIs are public (no keys required).

---

## 🔑 Test Credentials

Reqres.in only accepts a fixed set of test emails. Use:

| Field    | Value                  |
|----------|------------------------|
| Email    | `eve.holt@reqres.in`   |
| Password | any string (e.g. `cityslicka`) |

> **Note:** If you try an unlisted email, Reqres returns an error — this is handled gracefully with an inline error message.

---

## 🛠 Tech Stack

- **React 18** (JSX, no TypeScript) + **Vite**
- **React Router v6** for routing + protected routes
- **Plain CSS** (custom design system with CSS variables)
- **REST Countries API** — `https://restcountries.com/v3.1/`
- **Reqres.in** — `https://reqres.in/api/` for mock auth

---

## ✨ Features

1. **Authentication** — Login + Sign Up via Reqres.in with graceful error handling
2. **Protected Routes** — Unauthenticated users are redirected to `/auth`
3. **Session Persistence** — Auth token and bucket list saved to `localStorage` per user
4. **Country Grid** — ~250 countries fetched from REST Countries API with loading skeletons
5. **Search + Filter** — Real-time search by name/capital/region; filter by region tab; sort by name/population/area
6. **Country Detail** — Full info: flag, capital, languages, currencies, borders (clickable), coordinates
7. **Bucket List** — Add to wishlist ♡ / mark as visited ✓, stats dashboard, move between lists
8. **Responsive Layout** — Works on desktop screens

---

## 📁 Project Structure

```
src/
├── context/
│   ├── AuthContext.jsx      # Login, register, logout, session
│   └── BucketContext.jsx    # Per-user wishlist + visited state
├── hooks/
│   └── useCountries.js      # REST Countries API fetch hooks
├── components/
│   ├── Navbar.jsx/css
│   ├── CountryCard.jsx/css
│   └── ProtectedRoute.jsx
├── pages/
│   ├── AuthPage.jsx/css
│   ├── ExplorePage.jsx/css
│   ├── CountryDetailPage.jsx/css
│   └── BucketListPage.jsx/css
├── App.jsx                  # Routing + context providers
├── main.jsx
└── index.css                # Global design system
```

---

## 🔮 What I'd Improve With More Time

1. **Map visualization** — Plot bucket list countries on an interactive world map (using Leaflet or react-simple-maps), which would make the "world coverage" stat much more visceral.
2. **Optimistic UI + offline support** — Cache the REST Countries response in `sessionStorage` so the grid loads instantly on re-visits and works offline.
3. **Pagination / virtual list** — Rendering 250 cards at once is fine with `animationDelay` staggering, but a virtualized list (e.g. `react-window`) would be more performant at scale.
4. **Notes per country** — Let users attach a personal note or travel date to each bucket-list entry.
5. **Dark mode** — CSS variables make this straightforward; just needs a `data-theme="dark"` toggle persisted in `localStorage`.

---

## 📝 Notes

- Reqres.in is a mock API and only accepts [specific test emails](https://reqres.in/). Error responses are handled gracefully.
- No `node_modules` is committed (covered by `.gitignore`).
- No API keys or `.env` files required.
