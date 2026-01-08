# VegiTrack

A food traceability application that enables consumers to scan QR codes on vegetables and food products to access detailed information about their origin, supply chain, certifications, and environmental impact.

## About

VegiTrack provides a "Food Passport" for each product, showing:
- **Origin & Farm Information**: Location, farm details, harvest date
- **Supply Chain Tracking**: Complete journey from farm to store with blockchain verification
- **Certifications**: Organic, Fair Trade, and other quality certifications
- **Environmental Data**: CO2 emissions, transport distance
- **Recipes & Storage**: Cooking suggestions and shelf life information

## Tech Stack

### Frontend
- **React 19** with **TypeScript** - Modern UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Radix UI** / **shadcn/ui** - Accessible component library

### Backend & Database
- **Supabase** - PostgreSQL database with authentication and real-time capabilities
- **PostGIS** - Geographic data handling for location tracking

### Features & Libraries
- **@zxing/browser** - QR code scanning
- **Leaflet** / **React Leaflet** - Interactive maps
- **date-fns** - Date formatting
- **lucide-react** - Icon library

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` with Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

3. Start development server:
```bash
npm run dev
```

## Deployment

Deployed on **Vercel** with environment variables configured in the project settings.

---

**Know your veggies.** 🥕🍅🥬
