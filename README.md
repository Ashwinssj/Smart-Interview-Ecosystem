# Smart Interview Ecosystem

AI-powered placement & interview preparation platform connecting Students, TPOs, and Admins through a centralized ERP system.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Smart Interview Ecosystem                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   Next.js    │    │  FastAPI     │    │   Supabase   │      │
│  │   Frontend   │◄──►│  AI Services │◄──►│  (PostgreSQL  │      │
│  │  (Port 3000) │    │  (Port 8000) │    │   + Auth +    │      │
│  └──────────────┘    └──────────────┘    │  Realtime +   │      │
│         ▲                   ▲            │  Storage)     │      │
│         │                   │            └───────▲───────┘      │
│         │                   │                    │              │
│         └───────────────────┼────────────────────┘              │
│                             │                                    │
│                    ┌────────▼────────┐                          │
│                    │    HeyGen       │                          │
│                    │  Streaming      │                          │
│                    │    Avatar       │                          │
│                    └─────────────────┘                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, shadcn/ui |
| **Backend (AI)** | Python FastAPI, **Google Gemini** (gemini-1.5-pro), Embeddings |
| **Database & Auth** | Supabase (PostgreSQL, Auth, Realtime, Storage, Edge Functions) |
| **AI Avatar** | HeyGen Streaming Avatar SDK |
| **Monorepo** | Turborepo, pnpm |
| **Deployment** | Vercel (Frontend), Fly.io/Railway (AI Services), Supabase Cloud |

## 📁 Project Structure

```
smart-interview-ecosystem/
├── apps/
│   ├── web/                 # Next.js 14 Frontend
│   │   ├── src/
│   │   │   ├── app/         # App Router pages
│   │   │   │   ├── (auth)/      # Login, Register, Verify OTP
│   │   │   │   ├── (student)/   # Student Portal
│   │   │   │   ├── (tpo)/       # TPO Portal
│   │   │   │   ├── (admin)/     # Admin Portal
│   │   │   │   └── api/         # Next.js API Routes
│   │   │   ├── components/  # React Components
│   │   │   │   ├── ui/          # shadcn/ui components
│   │   │   │   ├── student/     # Student-specific components
│   │   │   │   ├── tpo/         # TPO-specific components
│   │   │   │   ├── admin/       # Admin-specific components
│   │   │   │   └── interview/   # HeyGen Interview components
│   │   │   ├── lib/         # Utilities, Supabase clients
│   │   │   ├── hooks/       # Custom React hooks
│   │   │   └── types/       # TypeScript types
│   │   └── ...
│   │
│   └── ai-services/         # FastAPI AI Microservice
│       ├── src/
│       │   ├── main.py
│       │   ├── config.py
│       │   ├── models/      # Pydantic models
│       │   ├── services/
│       │   │   ├── resume_parser.py
│       │   │   ├── resume_matcher.py
│       │   │   ├── interview_engine.py
│       │   │   └── feedback_roadmap.py
│       │   └── api/routes.py
│       └── ...
│
├── packages/
│   ├── shared/              # Shared TypeScript types & Zod schemas
│   └── supabase/            # Supabase migrations, types, RLS policies
│       ├── migrations/
│       └── seed.sql
│
├── supabase/
│   ├── config.toml
│   ├── migrations/
│   │   ├── 20240101000000_initial_schema.sql
│   │   └── 2040101000001_rls_policies.sql
│   └── functions/
│       └── heygen-create-session/
│
├── docker-compose.yml
├── turbo.json
├── package.json
└── pnpm-workspace.yaml
```

## ✨ Features

### 🎓 Student Portal
- **Profile Management** - Academic details, skills, projects, resume upload
- **Placement Drives** - Browse, filter, apply with eligibility checking
- **AI Resume Screening** - Semantic matching with improvement feedback
- **Assessments** - Adaptive aptitude & technical tests
- **AI Mock Interviews** - HeyGen avatar with voice, dynamic follow-ups
- **Feedback & Roadmap** - Detailed evaluation + 4-week personalized plan

### 👨‍🏫 TPO Portal
- **Drive Management** - Create, edit, publish placement drives
- **Application Tracking** - View, filter, update application statuses
- **Test Builder** - Configure aptitude/technical assessments
- **Analytics Dashboard** - Pipeline funnel, conversion rates, activity feed
- **Notifications** - Send announcements to students

### 🔧 Admin Portal
- **User Management** - CRUD for students, TPOs, admins
- **College Management** - Add/manage college profiles
- **Skills Taxonomy** - Maintain skill categories and mappings
- **AI Configuration** - Global thresholds, model settings, prompts
- **System Reports** - Platform-wide analytics and health monitoring

## 🛠️ Getting Started

### Prerequisites
- Node.js 20+
- Python 3.11+
- pnpm 9+
- Supabase CLI (for local development)
- Docker (optional)

### 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd smart-interview-ecosystem

# Install dependencies
pnpm install

# Install Supabase CLI (if not installed)
npm install -g supabase
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Fill in your credentials:
# - Supabase URL & Keys
# - OpenAI API Key
# - HeyGen API Key & Avatar/Voice IDs
```

### 3. Local Development with Supabase

```bash
# Start Supabase locally
supabase start

# Apply migrations
supabase db reset

# Generate TypeScript types
pnpm db:generate

# Start development servers
pnpm dev
```

This starts:
- **Frontend**: http://localhost:3000
- **AI Services**: http://localhost:8000
- **Supabase Studio**: http://localhost:54323
- **Supabase API**: http://localhost:54321

### 4. Alternative: Docker Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

## 🔐 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_HEYGEN_AVATAR_ID=your-avatar-id
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### AI Services (.env)
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=sk-...
HEYGEN_API_KEY=your-heygen-key
HEYGEN_AVATAR_ID=your-avatar-id
HEYGEN_VOICE_ID=your-voice-id
```

### Supabase Dashboard Settings
- **Authentication** → Providers → Email (enable)
- **Storage** → Buckets → `resumes` (private), `recordings` (private), `avatars` (public)
- **Edge Functions** → Deploy `heygen-create-session`
- **Database** → Extensions → Enable `pgvector` (if using embeddings)

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Frontend tests
pnpm test --filter=web

# AI Services tests
pnpm test --filter=ai-services
```

## 📦 Building for Production

```bash
# Build all packages
pnpm build

# Build specific apps
pnpm build --filter=web
pnpm build --filter=ai-services
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect repository to Vercel
2. Add environment variables
3. Deploy

### AI Services (Fly.io / Railway / Render)
```bash
# Fly.io
fly launch
fly deploy

# Or Railway
railway up
```

### Supabase (Production)
1. Create project at supabase.com
2. Run migrations: `supabase db push --db-url <prod-url>`
3. Deploy Edge Functions: `supabase functions deploy --project-ref <ref>`
4. Configure storage buckets and RLS policies

## 📚 API Documentation

### AI Services (FastAPI)
- **Base URL**: `http://localhost:8000/api/v1`
- **Docs**: `http://localhost:8000/docs` (Swagger UI)
- **Endpoints**:
  - `POST /resume/parse` - Parse resume file
  - `POST /resume/match` - Match resume to drive
  - `POST /interview/question` - Generate interview question
  - `POST /interview/evaluate` - Evaluate interview transcript
  - `POST /roadmap/generate` - Generate preparation roadmap

### Supabase Client
- **Database**: Direct PostgreSQL access with RLS
- **Auth**: Supabase Auth (Email/Password, OAuth)
- **Realtime**: Subscribe to changes
- **Storage**: File upload/download with signed URLs
- **Edge Functions**: Serverless functions at edge

## 🔒 Security

- **Row Level Security (RLS)** on all tables
- **JWT Authentication** via Supabase Auth
- **Service Role** for server-side operations
- **File Upload Validation** (type, size, malware scan)
- **Rate Limiting** on API endpoints
- **CORS** configured per environment

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the amazing backend platform
- [HeyGen](https://heygen.com) for Streaming Avatar technology
- [OpenAI](https://openai.com) for GPT-4o and Embeddings
- [shadcn/ui](https://ui.shadcn.com) for beautiful components
- [Turborepo](https://turbo.build) for monorepo management

---

**Built with ❤️ for students, TPOs, and colleges everywhere.**