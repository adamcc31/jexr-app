# Frontend Architecture Documentation (Updated)

This document outlines the architectural standards for the Recruitment Platform Frontend, updated for Next.js App Router v14+, TypeScript, and separate Golang Backend integration.

## Core Principles
1.  **Framework**: Next.js 14+ (App Router).
2.  **Language**: TypeScript (`.tsx`, `.ts`).
3.  **State Management**:
    -   **Server State**: TanStack Query (React Query).
    -   **Client State**: React Context / Hooks (minimal global state).
    -   **URL State**: Search Params (filters, pagination).
4.  **Styling**: SCSS Modules or Global SCSS (adhering to template).
5.  **Data Fetching**:
    -   **Server Components**: Fetch directly (if public) or via API wrapper handling tokens.
    -   **Client Components**: TanStack Query hooks.

## Directory Structure
```
src/app/
├── (auth)/                      # Public Auth Pages
│   ├── login/
│   └── signup/
├── (dashboard)/                 # Dashboard Route Group (Role-Based)
│   ├── layout.tsx               # Server Layout: Auth Guard & Providers
│   ├── dashboard-employer/      # Employer Routes
│   │   ├── layout.tsx           # Employer Sidebar
│   │   └── page.tsx
│   └── admin/                   # Admin Routes
│       ├── layout.tsx           # Admin Sidebar
│       └── page.tsx
├── components/                  # Shared Components
├── layouts/                     # Layout Components (Sidebars, Headers)
├── services/                    # API Integration Layer
└── types/                       # TypeScript Definitions
```

## Authentication & Security
-   **Method**: JWT (Stateless).
-   **Storage**: HTTP-Only Cookies (set by Backend).
-   **Guard**: Server Component in `(dashboard)/layout.tsx` checks cookie presence.
-   **Token Passing**:
    -   **Server**: Read `cookies()` -> pass to fetch headers.
    -   **Client**: Browser handles cookie automatically for same-domain/proxy requests.

## Server vs Client Components
| Feature | Type | Reasoning |
| :--- | :--- | :--- |
| **Route Layouts** | Server | Auth checks, Metadata, Initial Data |
| **Forms (Interactive)** | Client | `useState`, `react-hook-form`, Event Handlers |
| **Interactive UI** | Client | Dropdowns, Modals, Charts |
| **Static Content** | Server | SEO, Performance |

## Key Libraries
-   **Validation**: Zod (Schema aligned with Backend DTOs).
-   **Forms**: React Hook Form (`zodResolver`).
-   **Date**: `date-fns` or native `Intl`.
