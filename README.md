# Rize — Business Idea Discovery & Validation Platform

Rize is a SaaS MVP that helps business creators discover, organize, and validate business ideas from curated content sources. It combines AI-powered extraction with structured planning tools to go from raw content to actionable launch plans.

## Features

### Business Idea Vault
- **Ingest content** from CSV imports, manual text entry, or URL scraping
- **AI-powered extraction** transforms raw content into structured business idea cards
- **Automatic classification** by category, difficulty, budget, and monetization model
- **Advanced filtering** and search across all idea dimensions
- **Structured Plan generation** — market angle, MVP scope, 30-day roadmap
- **Launch Pack generation** — brand names, domains, landing page copy, marketing plan

### Business Validator
- **Submit any idea** through a structured form
- **Hybrid scoring** — deterministic heuristic scoring + AI-powered qualitative analysis
- **Score breakdown** across 7 dimensions (problem, audience, monetization, distribution, differentiation, feasibility, speed)
- **Actionable recommendations** with a 7-day validation plan
- **Convert validated ideas** into the Idea Vault for further development

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend Framework | AdonisJS v7 |
| Language | TypeScript (strict) |
| Database | PostgreSQL |
| Cache / Queue | Redis |
| ORM | Lucid |
| Validation | VineJS |
| Frontend | React 19 + Inertia.js |
| Styling | Tailwind CSS v4 |
| Auth | Session-based with roles (admin/member) |
| AI Provider | OpenAI (abstracted behind provider interface) |
| Testing | Japa |

## Architecture

```
app/
├── controllers/http/       # HTTP controllers
│   └── admin/              # Admin-only controllers
├── exceptions/             # Error handlers
├── jobs/                   # Background job classes
├── lib/                    # Shared utilities
├── middleware/              # Auth, admin middleware
├── models/                 # Lucid ORM models
├── services/               # Business logic
│   ├── ai/                 # AI provider abstraction + prompts
│   ├── ideas/              # Idea extraction, search, plan generation
│   ├── ingestion/          # Source adapters (CSV, manual, URL)
│   ├── launchpacks/        # Launch pack generation
│   ├── taxonomy/           # Category management
│   └── validator/          # Heuristic scoring + AI validation
├── types/                  # TypeScript enums, interfaces
└── validators/             # VineJS request validators

commands/                   # Ace CLI commands
config/                     # AdonisJS configuration
database/
├── migrations/             # 11 migration files
└── seeders/                # Demo data seeders
inertia/                    # React frontend
├── app/                    # Entry point
├── components/             # Reusable UI components
├── layouts/                # App layout with sidebar
├── lib/                    # Frontend utilities
└── pages/                  # Inertia pages
    ├── auth/               # Login, Register
    ├── ideas/              # Vault list, detail, plan, launch pack
    ├── validator/          # Form, results
    └── admin/              # Source items, idea review
```

### Key Design Decisions

- **Ingestion adapters** — pluggable interface (`SourceIngestionAdapter`) for adding new content sources without touching core logic
- **AI provider abstraction** — `AIProvider` interface with OpenAI implementation; swap to Claude by implementing the same interface
- **Hybrid scoring** — deterministic heuristic scoring first, then AI enrichment; graceful degradation if AI fails
- **Versioned prompts** — all AI prompts stored in `app/services/ai/prompts.ts` with version tracking
- **AI usage logging** — every generation logged to `ai_generations` table with token counts

## Local Setup

### Prerequisites
- Node.js 22+
- PostgreSQL 16+
- Redis 7+
- OpenAI API key (optional — needed for AI features)

### Quick Start

```bash
# 1. Start infrastructure
docker-compose up -d

# 2. Install dependencies
cd rize
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your settings (defaults work with docker-compose)

# 4. Run migrations
node ace migration:run

# 5. Seed demo data
node ace db:seed

# 6. Start development server
npm run dev
```

The app will be available at `http://localhost:3333`.

### Demo Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@rize.app | password123 | Admin |
| member@rize.app | password123 | Member |

## Environment Variables

```env
# App
NODE_ENV=development
PORT=3333
HOST=localhost
APP_KEY=            # Generate with: node ace generate:key
APP_NAME=rize
LOG_LEVEL=info
SESSION_DRIVER=cookie

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_DATABASE=rize_dev

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# AI
OPENAI_API_KEY=     # Required for AI features
OPENAI_MODEL=gpt-4o # Model to use
```

## Available Commands

```bash
# Development
npm run dev              # Start dev server with HMR
npm run build            # Build for production
npm start                # Start production server

# Database
node ace migration:run   # Run pending migrations
node ace migration:rollback  # Rollback last batch
node ace db:seed         # Run seeders

# Jobs
node ace jobs:extract    # Process pending source items → extract business ideas

# Code Quality
npm run lint             # Run ESLint
npm run typecheck        # TypeScript type checking
npm test                 # Run test suite
```

## How Ingestion Works

1. **Admin adds content** via manual text entry or CSV import
2. A `SourceItem` record is created with `sync_status: pending`
3. Run `node ace jobs:extract` (or trigger from UI) to process pending items
4. The AI extracts structured business idea data from raw text
5. Categories are assigned automatically
6. The idea appears in the Vault for browsing and further generation

### CSV Format

```csv
title,url,text,platform,published_at
"My Business Idea","https://example.com","Full description of the idea...","youtube","2024-01-15"
```

## How AI Works

All AI interactions follow this pattern:

1. **Versioned prompt** selected from `prompts.ts`
2. **OpenAI API call** with JSON response format
3. **Response parsed** and validated
4. **Usage logged** to `ai_generations` table (tokens, model, status)
5. **Result stored** in the relevant entity

The AI provider is abstracted behind `AIProvider` interface. To add a new provider:
1. Create a new class implementing `AIProvider`
2. Update `ai_service.ts` factory function

## API Endpoints

### Auth
- `POST /login` — Login
- `POST /register` — Register
- `POST /logout` — Logout

### Ideas (auth required)
- `GET /ideas` — List with filters
- `GET /ideas/:slug` — Detail view
- `POST /ideas/:id/generate-structured-plan` — Generate plan
- `GET /ideas/:id/structured-plan` — View plan
- `POST /ideas/:id/generate-launch-pack` — Generate launch pack
- `GET /ideas/:id/launch-pack` — View launch pack

### Validator (auth required)
- `GET /validator` — Form
- `POST /validator/run` — Run validation
- `GET /validator/:id` — View results

### Admin (admin role required)
- `GET /admin/source-items` — List source items
- `POST /admin/source-items/manual` — Add manual content
- `POST /admin/source-items/import-csv` — Import CSV
- `GET /admin/ideas/review` — Review ideas
- `PATCH /admin/ideas/:id` — Update idea
- `POST /admin/ideas/:id/reprocess` — Reprocess idea

## Testing

```bash
# Run all tests
npm test

# Run unit tests only
node ace test --suite=unit

# Run functional tests only
node ace test --suite=functional
```

## MVP Limitations

- No real-time scraping of social media platforms
- No background job queue (jobs run as CLI commands)
- No email notifications
- No password reset flow
- No file storage for S3 (local only)
- No SSR for React pages
- Scoring heuristics are basic keyword-matching (adequate for MVP)

## V2 Roadmap

- [ ] Bull/BullMQ queue for background jobs
- [ ] Social media scraping adapters (YouTube, Instagram, TikTok)
- [ ] Claude AI provider option
- [ ] Favorites / bookmarks for ideas
- [ ] Team collaboration
- [ ] Email notifications
- [ ] Export ideas to PDF
- [ ] WHOIS domain availability checking
- [ ] Landing page template generator
- [ ] A/B test scoring variants
- [ ] Internationalization (i18n)

## License

Proprietary — All rights reserved.
