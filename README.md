# WebPilot UK

A modern, production-ready SaaS platform for website growth services targeting UK small and medium-sized enterprises (SMEs). Built with React, TypeScript, Tailwind CSS, and Supabase.

## Overview

WebPilot UK is not just a portfolio site—it's a complete client platform for selling, onboarding, managing, and reporting website growth services. The platform includes public marketing pages, client dashboards, admin tools, and a free website audit feature.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Icons:** Lucide React

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx              # Public site navigation
│   │   ├── Footer.tsx              # Public site footer
│   │   ├── DashboardSidebar.tsx    # Dashboard navigation
│   │   └── DashboardLayout.tsx     # Dashboard wrapper
│   ├── ui/
│   │   ├── Button.tsx              # Reusable button component
│   │   ├── Card.tsx                # Card components
│   │   ├── Input.tsx               # Form input component
│   │   ├── Select.tsx              # Select dropdown component
│   │   └── Badge.tsx               # Status badge component
│   └── ProtectedRoute.tsx          # Route protection wrapper
├── contexts/
│   └── AuthContext.tsx             # Authentication state management
├── lib/
│   └── supabase.ts                 # Supabase client and types
├── pages/
│   ├── Home.tsx                    # Landing page
│   ├── Services.tsx                # Services overview
│   ├── Industries.tsx              # Industry solutions
│   ├── Pricing.tsx                 # Pricing plans
│   ├── CaseStudies.tsx             # Success stories
│   ├── About.tsx                   # About the company
│   ├── Contact.tsx                 # Contact form
│   ├── Audit.tsx                   # Free audit submission
│   ├── AuditResults.tsx            # Audit results display
│   ├── auth/
│   │   ├── Login.tsx               # User login
│   │   ├── Signup.tsx              # User registration
│   │   └── ForgotPassword.tsx      # Password reset
│   ├── dashboard/
│   │   ├── Dashboard.tsx           # Client dashboard home
│   │   ├── Project.tsx             # Project timeline & tasks
│   │   ├── Audits.tsx              # Audit history
│   │   ├── Assets.tsx              # File uploads
│   │   ├── Messages.tsx            # Client communications
│   │   ├── Billing.tsx             # Subscription management
│   │   └── Settings.tsx            # Account settings
│   └── admin/
│       └── AdminDashboard.tsx      # Admin analytics
└── App.tsx                         # Main app with routing
```

## Database Schema

The application uses Supabase with the following tables:

### Core Tables

- **profiles** - Extended user information (business name, industry, role)
- **audits** - Website audit submissions and results
- **projects** - Client website projects
- **subscriptions** - Subscription plan information
- **assets** - Uploaded files and documents
- **tasks** - Project tasks and action items
- **messages** - Client-admin communications

### Security

All tables use Row Level Security (RLS):
- Clients can only access their own data
- Admins have full access to all data
- Anonymous users can submit audits

## Features

### Public Website

1. **Home Page** - Value proposition, how it works, industry showcase, testimonials
2. **Services** - Comprehensive service breakdown
3. **Industries** - Sector-specific solutions
4. **Pricing** - Transparent subscription plans (Starter £297, Growth £497, Pro £797)
5. **Case Studies** - Real client success stories with metrics
6. **About** - Company mission and values
7. **Contact** - Multi-channel contact options
8. **Free Website Audit** - Lead generation tool with instant results

### Free Website Audit

- Simple 5-field form
- Generates instant audit report with:
  - Overall score out of 100
  - Homepage clarity, SEO, conversion, and mobile scores
  - 5 prioritized recommendations
  - Recommended subscription package
- Stores results in database
- Shareable results URL

### Authentication

- Email/password signup and login
- Password reset flow
- Protected routes for authenticated users
- Role-based access (client/admin)

### Client Dashboard

- **Overview** - KPIs, current plan, project status, quick actions
- **My Project** - Timeline, page status, tasks, launch checklist
- **Audit Reports** - Historical audit results
- **Assets** - Upload and manage files (logo, images, documents, credentials)
- **Messages** - Communication with project team
- **Billing** - View plan, upgrade/downgrade, invoice history
- **Settings** - Business info, password change, notifications

### Admin Dashboard

- Total clients, leads, and revenue metrics
- Client status overview with progress tracking
- Recent activity feed
- Task management
- Analytics and reporting

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in `.env`:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Next Integration Steps

### 1. Supabase Storage (File Uploads)

Currently, the Assets page shows UI only. To enable real file uploads:

```typescript
// In Assets.tsx
const handleUpload = async (file: File) => {
  const { data, error } = await supabase.storage
    .from('assets')
    .upload(`${userId}/${file.name}`, file);

  if (!error) {
    // Save file metadata to assets table
    await supabase.from('assets').insert({
      user_id: userId,
      file_name: file.name,
      storage_path: data.path,
      // ... other fields
    });
  }
};
```

### 2. Real-time Features

Add real-time updates for messages and project changes:

```typescript
const subscription = supabase
  .channel('messages')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `recipient_id=eq.${userId}`
  }, (payload) => {
    // Handle new message
  })
  .subscribe();
```

### 3. Payment Integration (Stripe)

Add Stripe for subscription payments:

1. Create Stripe Checkout sessions
2. Handle webhooks for subscription events
3. Update subscription status in database
4. Implement upgrade/downgrade flows

### 4. Email Notifications

Use Supabase Edge Functions to send emails:

- Audit report delivery
- Project updates
- Task assignments
- Monthly reports

### 5. Analytics Integration

Add Google Analytics or Mixpanel for:

- Conversion tracking
- User behavior analysis
- Audit completion rates

### 6. Advanced Audit Logic

Replace mock audit generation with real website analysis:

- Lighthouse API integration
- SEO crawling
- Performance metrics
- Security checks

### 7. Content Management

Add rich text editor for:

- Case study creation
- Blog posts
- Client updates

### 8. Reporting Dashboard

Build advanced reporting with:

- Chart.js or Recharts for visualizations
- Export to PDF functionality
- Scheduled report generation

## Design Philosophy

- **Value Connection Brand** - Emphasizes relationships and tangible value delivery
- **Clean & Modern** - Professional aesthetic suitable for UK business clients
- **Conversion-Focused** - Clear CTAs and trust signals throughout
- **Mobile-First** - Fully responsive across all device sizes
- **Accessible** - WCAG-compliant forms and navigation

## Color Palette

The platform uses a sophisticated black and white theme:

- **Primary:** Black (#000000) - Strong, professional, clear CTAs
- **Secondary:** Gray Scale (#F9FAFB to #111827) - Hierarchy and depth
- **Backgrounds:** White (#FFFFFF) and light grays
- **Borders:** Gray-200, Gray-300 for subtle definition
- **Error States:** Red (#DC2626) - For errors and critical alerts only
- **Interactive States:** Gray-800 for hover, Gray-50 for subtle backgrounds

This monochromatic approach emphasizes clarity, sophistication, and the value-connection brand philosophy.

## Key Differentiators

1. **SaaS Platform, Not Agency** - Positioned as scalable tech platform
2. **Transparent Pricing** - Clear monthly subscriptions in GBP
3. **Full Visibility** - Client dashboard shows all project activity
4. **UK-Focused** - Language, examples, and case studies for UK market
5. **Subscription Model** - Recurring revenue, not project-based

## Support

For questions or issues, please contact hello@webpilot.uk

---

Built with attention to detail and a focus on delivering real value to UK small businesses.
