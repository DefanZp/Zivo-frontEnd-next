# Zivo Frontend

**The web application for Zivo, an AI-powered e-commerce platform.**

Zivo Frontend is the customer-facing and administrative web application built with Next.js. It provides an e-commerce experience where customers can discover products, manage their shopping carts, complete purchases, and interact with an AI shopping assistant.

The application also includes an administrative dashboard for managing products and orders.

Built with Next.js App Router, React, TypeScript, and Zustand, the frontend communicates with the Laravel REST API and Zivo AI Service.

## Related Repositories

| Repository | Description |
|---|---|
| [Zivo Frontend](https://github.com/DefanZp/Zivo-frontEnd-next) | Next.js web application |
| [Zivo Backend](https://github.com/DefanZp/Zivo-backEnd) | Laravel REST API |
| [Zivo AI Service](https://github.com/DefanZp/Zivo-ai) | AI shopping assistant powered by Python and LangGraph |
| [Zivo n8n](https://github.com/DefanZp/Zivo-n8n) | Workflow automation |

## Features

### Customer Experience

- Browse and discover products.
- Search and filter products.
- View product details.
- Manage shopping cart items.
- Manage customer shipping addresses.
- Complete the checkout process.
- Make payments through Midtrans Snap.
- View order history and order details.
- Manage customer account settings.

### Authentication & User Management

- Customer registration and login.
- Token-based authentication using Laravel Sanctum.
- Persistent authentication state using Zustand Persist.
- Email verification flow.
- Protected routes for authenticated customers.
- Role-based access control for administrators.
- Automatic authentication state cleanup when the backend returns an unauthorized response.

### Admin Dashboard

- Dashboard overview.
- Product management.
- Create and edit products.
- Upload product images.
- Delete products.
- View low-stock products.
- Manage customer orders.
- View order details.
- Update order statuses.

### AI Shopping Assistant

- Interactive AI chatbot integrated into the shopping experience.
- Product-related conversations.
- Guest and authenticated user support.
- Streaming AI responses using Server-Sent Events (SSE).
- Conversation thread identification.
- Communication with the separate Zivo AI Service through Next.js Route Handlers.

### Payment Integration

- Midtrans Snap integration.
- Request payment tokens from the Laravel backend.
- Open the Midtrans payment interface.
- Handle payment callbacks.
- Display payment result information.

## Technology Stack

| Technology | Purpose |
|---|---|
| Next.js 16 | React framework and application routing |
| React 19 | User interface |
| TypeScript 5 | Static type checking |
| Tailwind CSS 4 | Styling |
| Zustand 5 | Client-side state management |
| Zustand Persist | Persistent authentication state |
| shadcn/ui | UI component foundation |
| Base UI | Accessible UI primitives |
| Lucide React | Icons |
| Sonner | Toast notifications |
| React Markdown | AI response rendering |
| Midtrans Snap | Payment interface |
| ESLint 9 | Code quality and linting |

## Architecture

The frontend follows a feature-oriented structure that separates application routes, UI components, business features, API communication, state management, and shared types.

### Application Flow

```text
                Next.js Application
                        |
                        v
                   App Router
                        |
          +-------------+-------------+
          |             |             |
          v             v             v
       Customer       Admin        API Routes
        Pages         Pages            |
          |             |              |
          +-------------+              |
                        |              |
                        v              v
                   Features       AI Service
                        |
                        v
                  Components
                        |
                        v
                 Client Services
                        |
                        v
                    API Client
                        |
                        v
                  Laravel Backend
```

### State Management

Zustand is used to manage authentication state across the application.

The authentication store contains:

- `user`: Current authenticated user.
- `token`: Laravel Sanctum access token.
- `isAuthReady`: Indicates whether authentication state restoration has completed.

The store uses Zustand Persist with local storage to preserve authentication information across page reloads.

An `AuthStoreProvider` initializes the store and restores its persisted state after the component mounts. This approach also avoids accessing browser-only local storage directly during server-side rendering.

### API Communication

The application uses a centralized API client located at:

```text
lib/api/client.ts
```

The API client handles:

- Base API URL configuration.
- JSON request and response handling.
- Authorization headers.
- FormData requests.
- API error handling.
- Unauthorized response detection.

Feature-specific services use this client to communicate with the Laravel backend.

### AI Integration

The AI chatbot communicates with the AI Service through Next.js Route Handlers.

```text
Chat Widget
    |
    v
Chat Service
    |
    v
Next.js API Route
    |
    v
Zivo AI Service
```

Two communication methods are implemented:

| Endpoint | Description |
|---|---|
| `/api/chat` | Send a chat message and receive a JSON response |
| `/api/chat/stream` | Send a chat message and receive a streaming SSE response |

The Route Handlers forward the user's authorization header when available and communicate with the configured AI Service URL.

## Project Structure

```text
.
├── app/
│   ├── (admin)/
│   │   └── admin/
│   │       ├── dashboard/
│   │       ├── orders/
│   │       ├── products/
│   │       └── layout.tsx
│   │
│   ├── (shop)/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── payment/
│   │   ├── product/
│   │   ├── products/
│   │   ├── user/
│   │   └── layout.tsx
│   │
│   ├── api/
│   │   └── chat/
│   │       ├── route.ts
│   │       └── stream/
│   │           └── route.ts
│   │
│   ├── auth/
│   │   ├── login/
│   │   ├── register/
│   │   ├── verify-email/
│   │   └── email-verified/
│   │
│   ├── globals.css
│   └── layout.tsx
│
├── components/
│   ├── admin/
│   ├── auth/
│   ├── chatbot/
│   ├── shared/
│   └── ui/
│
├── features/
│   ├── cart/
│   ├── checkout/
│   ├── home/
│   ├── orders/
│   ├── payment/
│   └── products/
│
├── lib/
│   ├── api/
│   │   └── client.ts
│   ├── services/
│   ├── stores/
│   └── utils.ts
│
├── types/
│
├── public/
│
├── next.config.ts
├── package.json
└── tsconfig.json
```

### Folder Responsibilities

| Folder | Responsibility |
|---|---|
| `app/` | Application routing, layouts, and API Route Handlers |
| `components/` | Reusable UI components |
| `features/` | Feature-specific UI and business logic |
| `lib/api/` | Centralized API client |
| `lib/services/` | API communication and service functions |
| `lib/stores/` | Zustand state management |
| `types/` | Shared TypeScript interfaces and types |
| `public/` | Static assets such as images and logos |

## Getting Started

### Prerequisites

Make sure the following tools are installed:

- Node.js
- npm
- Git

The Laravel backend and AI Service should also be available if you want to use the complete application functionality.

### 1. Clone the Repository

```bash
git clone https://github.com/DefanZp/Zivo-frontEnd-next.git

cd Zivo-frontEnd-next
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root.

```env
# Laravel Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# AI Service
AI_SERVICE_URL=http://127.0.0.1:8001

# Midtrans
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=
NEXT_PUBLIC_MIDTRANS_SNAP_URL=
```

Configure each variable according to your local environment.

**Important:**

- `NEXT_PUBLIC_API_URL` is used by the centralized API client.
- `AI_SERVICE_URL` is used by server-side Next.js Route Handlers to communicate with the AI Service.
- `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` and `NEXT_PUBLIC_MIDTRANS_SNAP_URL` are used to load the Midtrans Snap script in the browser.

Never expose private API keys or server credentials through `NEXT_PUBLIC_` environment variables.

### 4. Run the Development Server

```bash
npm run dev
```

Open the application:

```text
http://localhost:3000
```

The development server supports hot reloading, allowing changes to appear automatically during development.

## Available Scripts

The project includes the following npm scripts:

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

### Production Build

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Authentication Flow

Authentication is handled through the Laravel backend using Laravel Sanctum.

The general flow is:

1. The customer submits registration or login credentials.
2. The frontend sends the request to the Laravel API.
3. The backend validates the credentials and returns authentication data.
4. The frontend stores the user information and token using Zustand Persist.
5. Protected application sections check the authentication state before displaying their content.
6. The token is attached to authenticated API requests through the service layer.

### Route Protection

The application provides three reusable route guards:

| Guard | Responsibility |
|---|---|
| `AuthGuard` | Restricts access to authenticated users |
| `AdminGuard` | Restricts access to authenticated administrators |
| `VerifiedGuard` | Restricts access to users with verified email addresses |

These guards are located in:

```text
components/auth/
```

## AI Chat Integration

The AI chatbot is available through the customer shopping layout.

It communicates with the AI Service using Next.js Route Handlers, keeping the AI Service URL on the server side.

### Standard Chat

```text
POST /api/chat
```

Returns a JSON response from the AI Service.

### Streaming Chat

```text
POST /api/chat/stream
```

Uses Server-Sent Events (SSE) to forward streaming responses from the AI Service to the frontend.

Both endpoints support guest requests and authenticated requests. When an authorization token is provided, it is forwarded to the AI Service.

## Payment Integration

The frontend integrates with Midtrans Snap through the Laravel backend.

The general payment flow is:

1. The customer completes checkout.
2. The frontend sends the checkout request to the Laravel API.
3. The backend creates the order and payment record.
4. The frontend requests a Snap token using the payment ID.
5. The frontend loads the Midtrans Snap script.
6. The customer completes payment through the Midtrans interface.
7. The frontend displays the payment result.

Payment status and transaction notifications are handled by the backend.

## Deployment

The application can be deployed to platforms that support Next.js, including Vercel.

For production deployment:

1. Configure the production environment variables.
2. Set `NEXT_PUBLIC_API_URL` to the production Laravel API URL.
3. Set `AI_SERVICE_URL` to the production AI Service URL.
4. Configure the Midtrans client key and Snap script URL.
5. Build and deploy the application.

Build locally to verify the production build:

```bash
npm run build
```

For more information, refer to the [Next.js Deployment Documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## License

This project is part of the Zivo e-commerce platform.