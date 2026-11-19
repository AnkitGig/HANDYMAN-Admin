# ServEase Admin Panel (React + Vite + Tailwind)

```bash
npm install
npm run dev      # http://localhost:5173  (sign in with any email + any password in demo mode)
npm run build
```

## Structure
- `src/app` – App, router (lazy routes), providers
- `src/components/ui` – Button, Input, Select, Modal, Table, Badge, Pagination (+ Avatar, Card, Stars, StatCard, Tabs, PageHeader)
- `src/components/common` – Loader, EmptyState, ConfirmDialog, ListPage (generic list/table page with filters, tabs, side panel)
- `src/layouts` – AdminLayout (auth guard), AuthLayout, Sidebar, Header
- `src/features/*` – one folder per module
- `src/services/api.js` – API client + mock data; `src/store/authStore.js` – zustand auth
- `.env` – `VITE_USE_MOCK=false` and `VITE_API_BASE_URL` to use a real backend (`GET /<resource>`, `POST /auth/login`)

**Notes:** auth is a demo (no real security). Edits/deletes live only in browser memory until you wire up API calls.
