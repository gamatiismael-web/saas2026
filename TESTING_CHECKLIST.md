# Testing & Verification Checklist

## Pre-Deployment Testing

### 1. Database Connection Tests
- [ ] Aurora PostgreSQL connection established
- [ ] All schema tables created successfully
- [ ] Data migration from Supabase completed
- [ ] No connection errors in application logs

**Verification:**
```bash
# Check if database is accessible
npm run build  # Should not fail due to DB connection issues
```

### 2. Authentication Flow Tests

#### Email/Password Signup
- [ ] Navigate to `/auth/signup`
- [ ] Fill in name, email, password
- [ ] Password validation works (minimum 8 characters)
- [ ] Duplicate email detection works
- [ ] User redirects to login after successful signup
- [ ] New user record appears in Aurora database

#### Email/Password Login
- [ ] Navigate to `/auth/login`
- [ ] Login with valid credentials succeeds
- [ ] Invalid credentials show error message
- [ ] User redirects to dashboard after login
- [ ] Session persists across page refreshes

#### Google OAuth Login
- [ ] Google login button appears
- [ ] Click redirects to Google login
- [ ] After Google approval, user is logged in
- [ ] User profile is created in database
- [ ] Email account linking works (if reusing existing email)

#### Logout
- [ ] Logout button works
- [ ] User redirected to home page
- [ ] Session is cleared
- [ ] Cannot access protected pages after logout

### 3. Protected Routes Test
- [ ] Anonymous users redirected to login when accessing `/dashboard`
- [ ] Anonymous users redirected to login when accessing `/audit/results`
- [ ] Authenticated users can access protected pages
- [ ] User can only see their own data

### 4. Home Page Rendering
- [ ] Hero section loads correctly
- [ ] Navigation links work (Services, Pricing, About, Contact)
- [ ] Sign Up button links to `/auth/signup`
- [ ] Client Login button links to `/auth/login`
- [ ] No console errors on page load

### 5. API Endpoint Tests

#### Signup API (`/api/auth/signup`)
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Password123"}'
```
Expected: 201 Created with user object

#### NextAuth Providers
```bash
curl http://localhost:3000/api/auth/providers
```
Expected: JSON with available auth providers (credentials, google)

### 6. Data Fetching Tests

#### User Profile Fetch
- [ ] After login, user profile data loads
- [ ] Business name, industry, website URL display correctly
- [ ] Profile update form works
- [ ] Changes persist in Aurora database

#### Audit Data
- [ ] User's audits list loads
- [ ] Audit details page shows correct data
- [ ] New audit can be created
- [ ] Audit appears in user's list

#### SEO Data (if applicable)
- [ ] SEO settings save correctly
- [ ] Keywords can be added/removed
- [ ] Rankings display correctly

### 7. Error Handling Tests

#### Network Errors
- [ ] Database connection lost: show graceful error message
- [ ] API timeout: retry logic or user-friendly error
- [ ] Invalid input: validation errors display correctly

#### Validation Errors
- [ ] Email format validation on signup
- [ ] Password strength validation (minimum 8 chars)
- [ ] URL format validation on audit form
- [ ] GA4 ID validation (numeric only)

### 8. Browser Console Tests
- [ ] No JavaScript errors on any page
- [ ] No 404 errors for assets
- [ ] No CORS errors
- [ ] No missing environment variable errors
- [ ] NextAuth debug messages appear in development

### 9. Responsive Design Tests
- [ ] Desktop view (1920px): All elements display correctly
- [ ] Tablet view (768px): Layout adapts properly
- [ ] Mobile view (375px): Touch-friendly buttons, readable text
- [ ] Navigation menu collapses on mobile

### 10. Performance Tests
- [ ] Home page loads within 3 seconds
- [ ] Dashboard loads within 2 seconds
- [ ] No layout shift during page load
- [ ] Images are optimized (Next.js Image component)

## Post-Deployment Testing (on Vercel)

### 1. Live Environment Tests
- [ ] App loads from `https://your-domain.vercel.app`
- [ ] Authentication works with production database
- [ ] User data persists
- [ ] No error tracking (Sentry, if configured)

### 2. Email Verification (if implemented)
- [ ] Signup verification email sends
- [ ] Email link redirects correctly
- [ ] User email is marked verified

### 3. Data Persistence
- [ ] Create user account
- [ ] Log out
- [ ] Log back in
- [ ] User data is still accessible

### 4. Multi-browser Testing
- [ ] Chrome latest version
- [ ] Firefox latest version
- [ ] Safari latest version
- [ ] Edge latest version

## Rollback Checklist

If testing reveals critical issues:

1. [ ] Document the issue with screenshots/logs
2. [ ] Identify affected functionality
3. [ ] Revert code: `git revert <commit-hash>`
4. [ ] Redeploy: `git push`
5. [ ] Verify production is back to stable state

## Sign-off

**Tested by:** _________________  
**Date:** _________________  
**Environment:** ☐ Local ☐ Staging ☐ Production  
**Status:** ☐ Pass ☐ Pass with issues ☐ Fail  

**Issues Found:**
- Issue 1: ___________________
- Issue 2: ___________________
- Issue 3: ___________________

**Ready for Production:** ☐ Yes ☐ No
