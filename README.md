# FitForge

Personalized gym plans that evolve with you. Set your targets, push your limits, and watch your plan adapt as you grow stronger.

## Features

- **AI-Powered Workout Plans** — Intelligent, personalized plans tailored to your goals, experience level, and equipment
- **Goal-Oriented** — Lose weight, build muscle, get stronger, or improve general fitness
- **Custom Workouts** — Plans shaped by your experience, equipment (barbell, dumbbells, machines, etc.), and schedule
- **Progress Tracking** — Log workouts and body measurements; track weight over time with charts
- **Adaptive Plans** — Plans evolve based on your feedback (difficulty ratings) as you break through plateaus
- **PWA Support** — Install as an app on your device for a native-like experience
- **Authentication** — Sign up and sign in via Supabase Auth

## Tech Stack

- **Framework:** Next.js 16 (App Router) with React 19
- **Styling:** Tailwind CSS 4
- **UI:** Radix UI, shadcn/ui components
- **Backend:** Supabase (Auth, Database)
- **AI:** Vercel AI SDK for workout plan generation
- **Package Manager:** pnpm

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- A [Supabase](https://supabase.com) project

### Environment Variables

Create a `.env.local` file in the project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
pnpm build
```

### Start (Production)

```bash
pnpm start
```

## Project Structure

```
├── app/
│   ├── (app)/           # Authenticated app routes
│   │   ├── dashboard/   # Dashboard
│   │   ├── plan/        # Workout plan & generation
│   │   ├── progress/    # Progress tracking & logs
│   │   └── profile/     # User profile
│   ├── api/             # API routes (generate-plan, update-plan)
│   ├── auth/            # Login, sign-up, error pages
│   └── ...
├── components/          # Reusable UI components
│   ├── onboarding/      # Onboarding flow (goals, metrics, preferences)
│   ├── plan/            # Plan overview, feedback
│   ├── progress/        # Stats, weight chart
│   └── workout/         # Workout logging
├── lib/                 # Utilities, Supabase client, data access
├── hooks/               # Custom React hooks
└── public/
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server (with Turbopack) |
| `pnpm build` | Generate PWA icons and build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm generate-icons` | Generate PWA icons from source |

## License

Private — All rights reserved.
