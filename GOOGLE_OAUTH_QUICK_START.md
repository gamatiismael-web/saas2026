# Google OAuth - Quick Start Guide

## Issue Fixed

The login page was showing an error because `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` environment variables were not set. 

**What was changed:**
1. Made Google provider optional - only loads if env vars are provided
2. Added provider detection to login/signup pages
3. Google button only shows if provider is available
4. App works perfectly with just email/password login

## Quick Start (3 Steps)

### Step 1: Get Google OAuth Credentials (5 mins)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: "WebPilot SaaS"
3. Enable "Google+ API"
4. Create OAuth 2.0 Web Application credentials
5. Copy Client ID and Client Secret

### Step 2: Configure Redirect URIs in Google Cloud

In Google Cloud Console for your OAuth app, add these two sections:

**Authorized JavaScript origins:**
```
http://localhost:3000
```

**Authorized redirect URIs:**
```
http://localhost:3000/api/auth/callback/google
```

### Step 3: Set Environment Variables

Create `.env.local` in your project root:

```env
# Email/Password Auth (Always Required)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<run: openssl rand -base64 32>

# Google OAuth (Optional - only if you have credentials)
GOOGLE_CLIENT_ID=<your-client-id-from-step-1>
GOOGLE_CLIENT_SECRET=<your-client-secret-from-step-1>
```

### Step 4: Test

```bash
npm run dev
```

- Go to `http://localhost:3000/auth/login`
- Should see "Sign in with Google" button
- Click it to test

## For Production Deployment

When deploying to production (e.g., `https://yourdomain.com`):

1. In Google Cloud Console, add production redirect URIs:
   - **JavaScript origin:** `https://yourdomain.com`
   - **Redirect URI:** `https://yourdomain.com/api/auth/callback/google`

2. In your Vercel project settings, add production env vars:
   - `NEXTAUTH_URL=https://yourdomain.com`
   - `NEXTAUTH_SECRET=<use-a-different-random-secret>`
   - `GOOGLE_CLIENT_ID=<your-client-id>`
   - `GOOGLE_CLIENT_SECRET=<your-client-secret>`

## How It Works

- **Without Google credentials:** App shows "Google login not configured" message
- **With Google credentials:** Google login button appears and works normally
- **Fallback:** Users can always login with email/password

## Troubleshooting

**Error: "Google login not configured"**
- ✓ Normal if you haven't set env vars yet
- Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env.local

**Error: "Invalid origin: URIs must not contain a path"**
- This is for JavaScript origins only - do NOT include path
- Use just the domain: `http://localhost:3000`
- Redirect URIs are in a different field and should include path

**Error: "client_id is required"**
- Fixed! Google provider now optional
- Restart dev server after setting env vars
