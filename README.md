# SleepTracker

A modern, glass-morphic web application that helps users understand and improve their sleep patterns.

## ✨ Key Features
1. **Dashboard** – At-a-glance metrics: total hours, sleep score, and quality trend, with purple glass UI cards.
2. **Sleep Log** – Friendly form to record date, bedtime, wake time, 1-10 quality rating, and notes. Prevents duplicate entries.
3. **Statistics & Analytics** – Interactive charts (average duration, quality heatmap, bedtime vs. wake trends) powered by Chart.js.
4. **Insights & Recommendations** – AI-style tips plus smart bedtime reminder based on user goals and recent patterns.
5. **Themes & Design** – Tailwind CSS, lilac background, liquid-glass cards, responsive layout, dark-mode toggle.
6. **Local Persistence** – Zustand + localStorage keep data even after refresh.
7. **Unit Tests** – Vitest + React Testing Library with comprehensive tests for `SleepLog`.

## 🏗️ Tech Stack
- React 18 + TypeScript
- Vite for lightning-fast dev/build
- Tailwind CSS for utility styling
- Zustand (state) with middleware `persist`
- Chart.js & react-chartjs-2 for data viz
- Vitest / RTL / jest-dom for testing

## 🚀 Getting Started
```bash
# install deps
npm install

# start dev server
npm run dev

# run unit tests (watch)
npm test
```
The app runs at `http://localhost:5173/` by default.

## 📂 Project Structure
```
src/
 ├─ pages/       # Dashboard, SleepLog, Analytics, Insights
 ├─ components/  # Navigation, Empty states, shared UI
 ├─ store/       # Zustand sleepStore
 ├─ hooks/       # useTheme toggle
 ├─ test/        # global Vitest setup
```

## 📝 Product Requirements Snapshot
| Requirement | Implementation |
|-------------|----------------|
| Log daily sleep | SleepLog form with validation, notes, quality slider & stars |
| Analyze patterns | Analytics page with dynamic charts + stats helpers |
| Smart insights | Recommendations card & bedtime reminder logic |
| Persistent data | Zustand `persist` to localStorage |
| Engaging UI | Purple palette, glassmorphism, responsive & accessible |
| Testing | 16 tests covering rendering, interactions, error states |

## 📜 Scripts
| Command | Description |
|---------|-------------|
| `npm run dev` | Launch dev server with HMR |
| `npm run build` | Production build |
| `npm run preview` | Preview built app |
| `npm run lint` | ESLint code check |
| `npm test` | Vitest watch mode |
| `npm run test:coverage` | Generate coverage report |

## 🌐 Deployment
The project is ready for Vercel (see `vercel.json`) or any static host.

---
Crafted with ❤️ and plenty of restful nights.
