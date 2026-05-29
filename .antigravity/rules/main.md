# Antigravity Agent Workspace Rules: Birthday Project

Welcome to the **Birthday Project** agent workspace! This document defines the architectural guidelines, tech stack, and conventions for all autonomous agents operating in this repository.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** Vite + TypeScript
- **Styling:** Tailwind CSS (Vanilla CSS structure where appropriate)
- **UI Components:** Radix UI via Shadcn UI (`components.json` is configured)
- **Package Manager:** Bun (uses `bun.lockb`)
- **Testing:** Vitest (`vitest.config.ts`)

### Backend
- **Framework:** Express + TypeScript (`tsconfig.json` in `birthdays-backend`)
- **Database ORM:** Prisma (`prisma/schema.prisma`)
- **Utilities:** NodeMailer/SMTP testing (`src/test-smtp.ts`)
- **Environment:** Managed via `.env` files

---

## 📐 Project Structure

```
Birthday_Project2/
├── .antigravity/            # Agent workspace configuration
│   ├── rules/               # Agent-specific behavioral guidelines
│   └── settings.json        # Workspace settings
├── birthdays-backend/       # Express + TS + Prisma backend API
│   ├── src/                 # Source files
│   │   ├── app.ts           # App setup
│   │   ├── index.ts         # Entry point
│   │   ├── prisma/          # Database queries & clients
│   │   └── modules/         # API business modules
│   └── prisma/              # Schema & migrations
└── frontend/                # Vite + React + TS frontend
    ├── src/                 # Application source
    │   ├── components/      # Shared components
    │   ├── contexts/        # Global React contexts
    │   ├── pages/           # Pages & views
    │   └── services/        # API communication services
    └── tailwind.config.ts   # Styling configurations
```

---

## 📜 Agent Guidelines

### 1. Code Standards & Architecture
- Keep frontend components modular and reusable. Reuse existing Radix/Shadcn components rather than building from scratch.
- Ensure strict TypeScript typing in both frontend and backend. Avoid using `any` whenever possible.
- Use async/await for database operations in the backend and handle errors gracefully using centralized middleware.

### 2. Styling Rules
- Adhere strictly to the existing theme using Shadcn / Tailwind utility classes.
- Maintain premium design aesthetics: smooth transitions, harmonious dark/light mode integration, and accessible color contrasts.

### 3. Git and Commits
- Always work in descriptive branches when developing features.
- Write clean, descriptive commit messages summarizing the functional changes.

---

## 🔄 Saved Chat Sync Status
This workspace is linked to the shared Antigravity core brain directory. Conversations are synchronized in real-time between the **Antigravity IDE** and the **standalone Antigravity App**.
