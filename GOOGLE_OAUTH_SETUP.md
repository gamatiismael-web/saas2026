# Google OAuth Setup Guide - Step by Step

## Overview
This guide walks you through enabling Google login for your WebPilot SaaS application using NextAuth.js and Google OAuth 2.0.

## Prerequisites
- Google Account
- Vercel Project (or local dev environment)
- Access to Google Cloud Console

---

## Step 1: Create a Google Cloud Project

1. Go to **[Google Cloud Console](https://console.cloud.google.com/)**
2. Sign in with your Google Account
3. Click the **Project Dropdown** at the top left
4. Click **NEW PROJECT**
5. Enter project name: `WebPilot SaaS`
6. Click **CREATE**
7. Wait 1-2 minutes for the project to be created

---

## Step 2: Enable Google+ API

1. In the Google Cloud Console, search for **"Google+ API"** in the search bar
2. Click **Google+ API** from results
3. Click the **ENABLE** button
4. Wait for activation to complete

---

## Step 3: Create OAuth 2.0 Credentials

1. In the left sidebar, click **Credentials**
2. Click **CREATE CREDENTIALS** → **OAuth client ID**
3. You'll see "You'll need to create a consent screen first"
   - Click **CONFIGURE CONSENT SCREEN**

### Step 3a: Configure OAuth Consent Screen

1. Select **External** user type (unless you have Google Workspace)
2. Click **CREATE**
3. Fill in the form:
   - **App name**: WebPilot SaaS
   - **User support email**: your-email@gmail.com
   - **Developer contact**: your-email@gmail.com
4. Click **SAVE AND CONTINUE**
5. **Scopes**: Click **ADD OR REMOVE SCOPES**
   - Search for and select: `email`, `profile`
   - Click **UPDATE**
6. Click **SAVE AND CONTINUE**
7. **Test users**: Optional - add test accounts if needed
8. Click **SAVE AND CONTINUE**
9. Review and click **BACK TO DASHBOARD**

### Step 3b: Get Your OAuth Credentials

1. Go back to **Credentials** in the left sidebar
2. Click **CREATE CREDENTIALS** → **OAuth client ID**
3. Select **Web application**
4. Name: `WebPilot Login`
5. Under **Authorized redirect URIs**, add:
   - **Development**: `http://localhost:3000/api/auth/callback/google`
   - **Production**: `https://your-domain.com/api/auth/callback/google`
   
   Replace `your-domain.com` with your actual domain
6. Click **CREATE**
7. **IMPORTANT**: Copy and save these credentials:
   - **Client ID** (long string ending in `.apps.googleusercontent.com`)
   - **Client Secret** (sensitive - keep secure)

---

## Step 4: Add Environment Variables

### Local Development (.env.local)

Create or update `.env.local` in your project root:

```env
# Google OAuth
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>

# Database (Aurora PostgreSQL)
PGHOST=your-aurora-endpoint.rds.amazonaws.com
PGDATABASE=webpilot_prod
PGUSER=postgres
AWS_REGION=us-east-1
AWS_ROLE_ARN=arn:aws:iam::YOUR_ACCOUNT:role/YOUR_ROLE
```

### Generate NEXTAUTH_SECRET

Run this command in your terminal:

```bash
openssl rand -base64 32
```

Copy the output and paste into `NEXTAUTH_SECRET`

### Production (Vercel)

1. Go to **Vercel Dashboard** → Your Project
2. Go to **Settings** → **Environment Variables**
3. Add:
   - `GOOGLE_CLIENT_ID` = (your client ID)
   - `GOOGLE_CLIENT_SECRET` = (your client secret)
   - `NEXTAUTH_URL` = `https://your-domain.vercel.app` (or custom domain)
   - `NEXTAUTH_SECRET` = (generated secret from above)
4. Click **SAVE**

---

## Step 5: Test Locally

1. Make sure `.env.local` is filled with your credentials
2. Start your dev server:
   ```bash
   npm run dev
   ```
3. Go to `http://localhost:3000/auth/login`
4. You should see a **"Sign in with Google"** button
5. Click it and follow Google's login flow
6. You should be redirected to `/dashboard` after successful login

---

## Step 6: Handle First-Time Google Users

When a user signs in with Google for the first time, we need to create them in the database. Update the NextAuth callback to handle this:

The callback should automatically create a new user record if they don't exist. Check `src/app/api/auth/[...nextauth]/route.ts` for the JWT callback logic.

---

## Step 7: Troubleshooting

### Error: "Invalid Client"
- Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are exactly copied
- Verify they're in `.env.local` (development) or Vercel Environment Variables (production)

### Error: "Redirect URI mismatch"
- Your redirect URI in the login button must match exactly what you set in Google Cloud Console
- Development: Must be `http://localhost:3000/api/auth/callback/google`
- Production: Must match your deployed domain exactly

### Google Button Not Appearing
- Check that `signIn('google')` is being called in the login page
- Verify NextAuth is properly configured in `src/app/api/auth/[...nextauth]/route.ts`

### User Created But Not Logged In
- Check Aurora PostgreSQL connection is working
- Verify user table has the correct schema with email, name, id columns
- Check server logs for database errors

---

## Step 8: Customize Google Button (Optional)

You can customize the Google sign-in button styling:

```jsx
<button
  onClick={() => signIn('google')}
  className="w-full bg-white border border-gray-300 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
>
  <img src="/google-icon.svg" alt="Google" className="h-5 w-5" />
  Sign in with Google
</button>
```

---

## Security Considerations

- **Never commit secrets** to git - use `.env.local` (in `.gitignore`)
- **Use HTTPS** in production - Google requires secure redirect URIs
- **Store client secret securely** - use Vercel environment variables for production
- **Validate tokens** - NextAuth handles this automatically

---

## Next Steps

After Google login is working:
1. Test the user creation flow
2. Verify user data is saved to Aurora PostgreSQL
3. Test logout functionality
4. Set up email verification (optional)
5. Deploy to production with production redirect URI

---

## Support

If you encounter issues:
1. Check the NextAuth documentation: https://next-auth.js.org/providers/google
2. Review the error logs in browser console (F12)
3. Check server logs: `npm run dev` output
4. Verify environment variables are set correctly
