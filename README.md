# WebPilot - Website Growth Platform for UK SMEs

A modern SaaS application built with Next.js 16, NextAuth.js, and AWS Aurora PostgreSQL.

## What's New in This Version

✨ **Migrated from Supabase to AWS Aurora PostgreSQL**
✨ **Upgraded from Vite+React to Next.js 16**
✨ **Enhanced authentication with NextAuth.js**
✨ **Improved security with HTTP-only cookies**
✨ **Fixed 15+ critical bugs** (see BUG_REPORT.md)

## Quick Start

### Prerequisites
- Node.js 18+ and npm/pnpm
- AWS Aurora PostgreSQL instance
- Google OAuth credentials (optional)

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository>
cd webpilot-saas
npm install --legacy-peer-deps
```

2. **Set up environment variables:**
Copy `.env.example` to `.env.local` and fill in your values:
```bash
cp .env.example .env.local
```

Required variables:
- `PGHOST`, `PGDATABASE`, `PGUSER`, `AWS_REGION`, `AWS_ROLE_ARN` (Aurora)
- `NEXTAUTH_URL`, `NEXTAUTH_SECRET` (Auth)
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (OAuth - optional)

3. **Apply database schema:**
Run the migration scripts against your Aurora instance:
```bash
# Using AWS RDS Query Editor or psql
psql -h $PGHOST -U $PGUSER -d $PGDATABASE -f scripts/001-core-schema.sql
psql -h $PGHOST -U $PGUSER -d $PGDATABASE -f scripts/002-seo-infrastructure.sql
```

4. **Migrate data from Supabase (if applicable):**
```bash
npm run migrate-data
```

5. **Start development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
webpilot-saas/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx         # Home page
│   │   ├── api/             # API routes & NextAuth
│   │   ├── auth/            # Auth pages (login, signup)
│   │   └── layout.tsx       # Root layout
│   ├── components/          # React components
│   │   ├── layout/          # Layout components (Header, Footer)
│   │   └── ui/              # Reusable UI components
│   ├── lib/
│   │   ├── db.ts            # Database connection & queries
│   │   └── auth.ts          # Auth utilities
│   └── contexts/            # React contexts
├── scripts/
│   ├── 001-core-schema.sql  # Database schema (users, audits, projects)
│   ├── 002-seo-infrastructure.sql  # SEO tables schema
│   └── migrate-data.ts      # Data migration script
├── public/                  # Static assets
├── BUG_REPORT.md           # Detailed bug analysis (15 issues)
├── MIGRATION_GUIDE.md      # Supabase → Aurora migration guide
├── TESTING_CHECKLIST.md    # Testing procedures
└── package.json

```

## Key Features

### Authentication
- **Email/Password** - Custom implementation with bcrypt
- **Google OAuth** - Secure OAuth 2.0 integration
- **Session Management** - NextAuth.js JWT + HTTP-only cookies
- **Role-based Access** - Client vs. Admin roles

### Audit System
- Website SEO & performance audits
- Automated scoring (0-100)
- Personalized recommendations
- Anonymous submission support

### Project Management
- Client project tracking
- Milestone-based progress tracking
- Task assignment system
- Document/asset uploads

### SEO Infrastructure
- Keyword rank tracking
- Competitor analysis
- SEO opportunities database
- Historical ranking snapshots

### Analytics Integration
- Google Analytics 4 connection
- Search Console integration
- Performance dashboards

## Database Schema

### Core Tables
- `users` - User accounts with auth
- `profiles` - Extended user information
- `audits` - Website audit submissions
- `projects` - Client projects
- `subscriptions` - Billing information
- `tasks` - Project tasks
- `messages` - Client-admin communication
- `assets` - File uploads

### SEO Tables
- `seo_settings` - Per-client SEO configuration
- `seo_keywords` - Target keywords
- `seo_rankings` - Historical rank tracking
- `seo_opportunities` - Improvement recommendations

See `scripts/001-core-schema.sql` and `scripts/002-seo-infrastructure.sql` for full schema.

## Bug Fixes

This version fixes 15+ critical bugs found in the previous Supabase version:

1. ✅ Vite environment variable syntax errors
2. ✅ Missing Supabase env vars causing app crash
3. ✅ Weak error handling (`catch (err: any)`)
4. ✅ Missing route parameter validation
5. ✅ Auth callback race conditions
6. ✅ Contact form not sending emails
7. ✅ Settings page env variable crashes
8. ✅ Analytics missing GA4 fallbacks
9. ✅ And 7+ more...

See `BUG_REPORT.md` for detailed analysis.

## Configuration

### Environment Variables

```env
# Aurora PostgreSQL
PGHOST=your-aurora-host.rds.amazonaws.com
PGDATABASE=webpilot_prod
PGUSER=postgres
AWS_REGION=us-east-1
AWS_ROLE_ARN=arn:aws:iam::ACCOUNT:role/WebPilotRole

# NextAuth.js
NEXTAUTH_URL=https://webpilot.vercel.app
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

# Google OAuth
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx

# Analytics (optional)
NEXT_PUBLIC_GA4_PROPERTY_ID=G-XXXXXXXXXX
```

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
npm run migrate-data # Migrate data from Supabase to Aurora
```

## Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub:**
```bash
git add .
git commit -m "Migrate to Aurora PostgreSQL and Next.js 16"
git push
```

2. **Connect to Vercel:**
   - Go to vercel.com
   - Import your GitHub repository
   - Set environment variables
   - Deploy

3. **Post-deployment:**
   - Verify authentication works
   - Check data access
   - Monitor error logs

See `MIGRATION_GUIDE.md` for detailed migration instructions.

## Testing

See `TESTING_CHECKLIST.md` for comprehensive testing procedures.

**Quick test:**
```bash
npm run dev
# Navigate to http://localhost:3000 and test signup/login
```

## Troubleshooting

### Database Connection Issues
- Verify `PGHOST`, `PGDATABASE`, `PGUSER` are correct
- Check AWS RDS security groups allow your IP
- Ensure `AWS_ROLE_ARN` has proper permissions

### Authentication Fails
- Check `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches your domain
- For Google OAuth, check credentials are correct

### Data Migration Issues
- Run schema scripts first
- Check Supabase credentials are valid
- Review `scripts/migrate-data.ts` output for errors

See `MIGRATION_GUIDE.md` and `BUG_REPORT.md` for more troubleshooting.

## Security Considerations

✅ **Passwords** - Hashed with bcrypt  
✅ **Sessions** - Secure HTTP-only cookies (NextAuth.js)  
✅ **Database** - Parameterized queries (no SQL injection)  
✅ **Auth** - JWT tokens with expiration  
✅ **HTTPS** - Enforced in production  

## Performance

- Next.js 16 with Turbopack (3x faster builds)
- Image optimization with Next.js Image
- Automatic code splitting
- Edge caching with Vercel
- Database connection pooling

## Documentation

- **BUG_REPORT.md** - Detailed analysis of 15 bugs fixed
- **MIGRATION_GUIDE.md** - Step-by-step Supabase to Aurora migration
- **TESTING_CHECKLIST.md** - Comprehensive testing procedures
- **.env.example** - Environment variable template

## Support

For issues or questions:
1. Check `MIGRATION_GUIDE.md` and `TESTING_CHECKLIST.md`
2. Review `BUG_REPORT.md` for known issues
3. Check application logs
4. Contact support@webpilot.co.uk

## License

Proprietary - WebPilot Limited

## Changelog

### v2.0.0 (Current)
- Migrated from Supabase to AWS Aurora PostgreSQL
- Upgraded Vite+React to Next.js 16
- Implemented NextAuth.js authentication
- Fixed 15+ critical bugs
- Enhanced security with HTTP-only cookies
- Improved error handling and validation
- Created comprehensive migration and testing documentation

### v1.0.0
- Initial Supabase + Vite+React version
