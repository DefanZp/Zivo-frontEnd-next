# Zivo Frontend

The customer-facing and administrator web application for **Zivo**, an e-commerce platform with an integrated AI Shopping Assistant.

The frontend is built with Next.js App Router, React, TypeScript, Tailwind CSS, and Zustand. It communicates with the Laravel REST API for e-commerce features and uses Next.js Route Handlers to proxy AI chat requests to the separate FastAPI service.

## Live Application

- **Web application:** https://zivo-front-end-next-5uvw.vercel.app/
- **Backend API:** https://api.zivoapp.cloud

## Features

### Customer experience

- Registration, login, and email verification.
- Product catalog with pagination, search, category filtering, and sorting.
- Product detail pages.
- Shopping cart operations.
- Checkout with saved delivery addresses.
- Midtrans Snap payment flow and payment result page.
- Order history and order detail.
- Profile and address management.
- AI Shopping Assistant with streamed responses.

### Administrator experience

- Dashboard statistics and low-stock overview.
- Product creation, editing, deletion, and image upload.
- Order listing, order details, and order status management.
- Admin-only navigation and protected pages.

> Backend authorization remains the security boundary. Frontend route guards improve navigation and user experience but do not replace Laravel authorization.

## Architecture

### E-commerce requests

```text
Next.js App Router
       |
       v
Feature Component
       |
       v
Domain Service (lib/services)
       |
       v
Central API Client (lib/api/client.ts)
       |
       v
Laravel REST API
       |
       v
PostgreSQL
```

Feature modules generally separate stateful feature components from presentation components (`*-view.tsx`). Shared UI and layout components live under `components/`.

### AI chat requests

```text
Chat Widget
    |
    v
chatService
    |
    v
Next.js Route Handler (/api/chat/stream)
    |
    v
FastAPI AI Service (/chat/stream)
    |
    v
LangGraph Agent
    |
    v
SSE events streamed back to the browser
```

The active chat widget uses the streaming endpoint. A non-streaming `/api/chat` Route Handler is also present in the source.

## Authentication and State

Authentication state is managed with a Zustand store using the persist middleware.

- Persisted storage key: `zivo-auth`.
- Browser storage: `localStorage`.
- Persisted values: user and token.
- `isAuthReady` is maintained separately and becomes ready after store rehydration.
- The API client dispatches `zivo:unauthorized` for authenticated 401 responses; the auth store listens for this event and clears local authentication state.
- `AuthGuard`, `AdminGuard`, and `VerifiedGuard` control access to frontend routes.

The Bearer token is sent to Laravel for protected API calls. Since the token is stored in browser local storage, this design has an XSS-related security trade-off. Keep backend authorization in place and apply appropriate XSS protections.

## Main Routes

| Route | Purpose |
|---|---|
| `/` | Homepage |
| `/products` | Product catalog |
| `/product/[id]` | Product detail |
| `/cart` | Shopping cart |
| `/checkout` | Checkout |
| `/payment/result` | Payment result |
| `/user/settings` | Profile settings |
| `/user/settings/addresses` | Address management |
| `/user/orders` | Order history |
| `/user/orders/[id]` | Order detail |
| `/auth/login` | Login |
| `/auth/register` | Registration |
| `/auth/verify-email` | Email verification instructions/resend |
| `/auth/email-verified` | Email verification result |
| `/admin/dashboard` | Administrator dashboard |
| `/admin/products` | Product management |
| `/admin/products/create` | Create product |
| `/admin/products/[id]/edit` | Edit product |
| `/admin/orders` | Order management |
| `/admin/orders/[id]` | Order detail and status management |
| `/api/chat` | Non-streaming chat proxy |
| `/api/chat/stream` | Streaming chat proxy |

## Project Structure

```text
app/                  # App Router pages, layouts, and Route Handlers
  (shop)/              # Customer-facing routes
  (admin)/              # Administrator routes
  auth/                 # Authentication routes
  api/chat/             # AI chat proxy endpoints
components/             # Shared, UI, auth, admin, and chatbot components
features/               # Feature-specific stateful components and views
lib/api/                # Centralized Laravel API client
lib/services/           # Domain API and chat services
lib/stores/             # Zustand stores and providers
types/                  # Shared TypeScript types
```

## Tech Stack

| Area | Technology |
|---|---|
| Framework | Next.js 16.4.0 |
| UI library | React 19.3.0 |
| Language | TypeScript 5.9.3 |
| Styling | Tailwind CSS 4.3.3 |
| State management | Zustand 5.0.15 |
| UI foundation | shadcn/ui, Base UI |
| Icons | Lucide React |
| Markdown rendering | react-markdown, remark-gfm |
| Notifications | Sonner |

Versions are taken from the uploaded `package.json` and lockfile snapshot.

## Environment Variables

Create `.env.local` in the project root:

```env
# Laravel API base URL, including the /api path
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Server-side URL used by Next.js chat Route Handlers
AI_SERVICE_URL=http://localhost:8001

# Midtrans Snap browser integration
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_midtrans_client_key
NEXT_PUBLIC_MIDTRANS_SNAP_URL=your_midtrans_snap_script_url
```

Use the actual URLs and keys for the environment being configured. Do not commit `.env.local` or real credentials. The repository snapshot does not include an `.env.example`; adding one is recommended.

## Getting Started

### Requirements

- Node.js 20.9.0 or later (the installed Next.js package declares this minimum).
- npm.
- A running Zivo Laravel API for e-commerce features.
- A running Zivo FastAPI service for AI chat features.

### Installation

```bash
git clone https://github.com/DefanZp/Zivo-frontEnd-next.git
cd Zivo-frontEnd-next
npm ci
```

Create `.env.local` using the variables above, then start the development server:

```bash
npm run dev
```

Open http://localhost:3000.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## Known Limitations and Follow-ups

- The admin order list currently includes a `shipped` option, while the shared `OrderStatus` type and the inspected Laravel backend do not support that state. Selecting it can result in a backend validation error. Align the state machine and UI before documenting `shipped` as supported.
- `next.config.ts` currently allows `next/image` remote images only from `http://localhost:8000/storage/**`. Confirm the deployed Laravel image host and add an exact trusted pattern when required.
- `dangerouslyAllowLocalIP` is enabled in the current Next.js configuration. Review whether this is necessary for production.
- The auth token is persisted in local storage; retain server-side authorization and review the XSS implications.
- No frontend test files or test script were found in the uploaded snapshot. Typecheck, lint, build, and runtime behavior were not executed as part of the source audit.

## Related Repositories

- [Zivo Backend](https://github.com/DefanZp/Zivo-backEnd) — Laravel REST API and e-commerce business logic.
- [Zivo AI Service](https://github.com/DefanZp/Zivo-ai) — FastAPI, LangGraph agent, MCP, and RAG.
- [Zivo n8n](https://github.com/DefanZp/Zivo-n8n) — n8n deployment configuration and automation infrastructure.

## Author

**Defan Zain Pratama** — Full-Stack Developer interested in web applications, backend systems, and AI-powered applications.

- GitHub: [@DefanZp](https://github.com/DefanZp)
