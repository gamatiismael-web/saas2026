# Google Login Implementation Checklist

## What's Been Completed ✅

### Code Changes
- ✅ Added `signIn` import from 'next-auth/react' to signup page
- ✅ Added `handleGoogleSignIn()` function to signup page
- ✅ Added "Sign up with Google" button on signup page
- ✅ Login page already has "Sign in with Google" button and handler
- ✅ Added `signIn` callback to NextAuth to auto-create users from Google OAuth
- ✅ NextAuth configured with GoogleProvider (credentials + client secret in env)

### Files Updated
1. `/src/app/auth/signup/page.tsx` - Added Google OAuth button and handler
2. `/src/app/auth/[...nextauth]/route.ts` - Added signIn callback for auto user creation
3. `/src/app/auth/login/page.tsx` - Already has Google button (no changes needed)

---

## What You Need To Do (Step by Step)

### Step 1: Get Google OAuth Credentials

Follow the guide in `GOOGLE_OAUTH_SETUP.md` to:
1. Create a Google Cloud Project
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Get your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

**Time**: 10-15 minutes

### Step 2: Set Environment Variables (Development)

Create or update `.env.local` in your project root:

```env
# Google OAuth Credentials (from Google Cloud Console)
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
```

To generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

**Time**: 5 minutes

### Step 3: Test Locally

1. Make sure `.env.local` is saved with your credentials
2. Restart your dev server:
   ```bash
   npm run dev
   ```
3. Go to `http://localhost:3000/auth/login`
4. Click **"Sign in with Google"** button
5. You'll be redirected to Google login
6. After successful login, you should be redirected to `/dashboard`
7. Try signup: Go to `/auth/signup` and click **"Sign up with Google"**

**Time**: 5 minutes

### Step 4: Verify Database User Creation

After Google login, verify the user was created in Aurora PostgreSQL:

```sql
-- Check if user was created
SELECT id, email, name, role FROM users WHERE email = 'your-google-email@gmail.com';
```

If the user exists, Google OAuth is working correctly!

**Time**: 2 minutes

### Step 5: Deploy to Production (Vercel)

1. Go to **Vercel Dashboard** → Your Project
2. Click **Settings** → **Environment Variables**
3. Add these variables:
   - `GOOGLE_CLIENT_ID` = (from Google Cloud Console)
   - `GOOGLE_CLIENT_SECRET` = (from Google Cloud Console)
   - `NEXTAUTH_URL` = `https://your-domain.vercel.app` (or your custom domain)
   - `NEXTAUTH_SECRET` = (the secret you generated in Step 2)
4. Click **SAVE**
5. Redeploy your app
6. Update Google OAuth redirect URI in Google Cloud Console to production URL:
   - Add: `https://your-domain.vercel.app/api/auth/callback/google`

**Time**: 10 minutes

---

## Testing Checklist

After implementation, verify:

- [ ] Login page shows "Sign in with Google" button
- [ ] Signup page shows "Sign up with Google" button
- [ ] Clicking Google button redirects to Google login
- [ ] After Google login, you're redirected to `/dashboard`
- [ ] Dashboard shows correct user info
- [ ] User record created in Aurora PostgreSQL
- [ ] Logout works correctly
- [ ] Can login again with same Google account
- [ ] Trying to signup with existing Google account logs in instead

---

## How It Works

### Flow Diagram

```
User clicks "Sign in with Google"
         ↓
NextAuth redirects to Google OAuth page
         ↓
User logs in with Google
         ↓
Google redirects back to /api/auth/callback/google
         ↓
NextAuth signIn callback runs:
  - Checks if user exists in database
  - If not, creates user with email, name, and 'client' role
         ↓
JWT token created with user ID
         ↓
User redirected to /dashboard
         ↓
Dashboard displays user info from session
```

### Key Files

- **NextAuth Config**: `/src/app/api/auth/[...nextauth]/route.ts`
  - Handles both Credentials and Google providers
  - Auto-creates users from Google OAuth
  
- **Login Page**: `/src/app/auth/login/page.tsx`
  - Has Google sign-in button
  
- **Signup Page**: `/src/app/auth/signup/page.tsx`
  - Has Google sign-up button (same OAuth flow)

- **Database Function**: `/src/lib/db.ts`
  - Queries Aurora PostgreSQL for users

---

## Troubleshooting

### "Invalid Client" Error
- Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are exactly correct
- Make sure they're in `.env.local` (development) or Vercel env vars (production)
- Verify you're using the Web application credentials, not Desktop app

### "Redirect URI mismatch" Error
- Development: Must use `http://localhost:3000/api/auth/callback/google`
- Production: Must use `https://your-domain.com/api/auth/callback/google`
- Make sure exactly one redirect URI matches what's set in Google Cloud Console

### Google Button Not Appearing
- Check browser console (F12) for errors
- Verify NextAuth is properly configured
- Check that `NEXTAUTH_URL` is set in `.env.local`

### User Not Created in Database
- Check that Aurora PostgreSQL is connected
- Verify the `users` table has the correct schema with email, name, id columns
- Check server logs for database errors

### Session Not Loading
- Make sure `NEXTAUTH_SECRET` is set in env vars
- Check that JWT token is being created correctly
- Try clearing browser cookies and logging in again

---

## Security Notes

- Store credentials securely - never commit to git
- Use `.env.local` for local development (it's in `.gitignore`)
- Use Vercel Environment Variables for production
- Google OAuth uses secure HTTPS in production
- Never expose `GOOGLE_CLIENT_SECRET` in client code

---

## Next Steps

Once Google OAuth is working:
1. Add GitHub OAuth (optional)
2. Add email verification
3. Add profile customization page
4. Connect analytics
5. Set up email notifications

---

## Support Resources

- NextAuth.js Google Provider: https://next-auth.js.org/providers/google
- Google OAuth Setup: GOOGLE_OAUTH_SETUP.md
- NextAuth Docs: https://next-auth.js.org/
- Vercel Environment Variables: https://vercel.com/docs/projects/environment-variables
