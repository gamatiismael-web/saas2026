# Bug Report & Error Analysis - gamatiismael-web/saas2026

**Report Generated:** 2026-05-19  
**Scope:** Critical bugs, runtime errors, and edge cases that could break the app

---

## Critical Issues

### 1. **Vite Environment Variable Syntax in Multiple Files**
**Severity:** CRITICAL - Runtime Error

**Affected Files:**
- `src/pages/dashboard/Settings.tsx` (lines 14-15)
- `src/pages/dashboard/Analytics.tsx` (line 67)
- `src/pages/Audit.tsx` (lines 50-51)
- `src/components/dashboard/WebsiteSetupModal.tsx` (lines 12-13)

**Issue:**
Using Vite environment variable syntax (`import.meta.env.VITE_*`) instead of Next.js/browser syntax (`process.env.NEXT_PUBLIC_*`). When Supabase env vars are missing or use different naming, this causes immediate runtime crashes with "undefined" errors or "Cannot read property of undefined" when accessing the URL/Key.

**Root Cause:**
Environment variables were set up for Next.js (using `process.env.NEXT_PUBLIC_*` naming convention) but several files still reference the old Vite syntax.

**How It Presents:**
```
[Error] Cannot read properties of undefined (reading 'includes')
[Error] TypeError: SUPABASE_URL is undefined
Failed to call Supabase functions - 404/401 errors
```

**Suggested Fix:**
Replace all instances of:
- `import.meta.env.VITE_SUPABASE_URL` → `process.env.NEXT_PUBLIC_SUPABASE_URL`
- `import.meta.env.VITE_SUPABASE_ANON_KEY` → `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `import.meta.env.VITE_GA4_SERVICE_ACCOUNT_EMAIL` → Create fallback or properly validate

---

### 2. **Missing Supabase Environment Variables - No Graceful Fallback**
**Severity:** CRITICAL - Runtime Crash

**Affected File:** `src/lib/supabase.ts` (lines 3-7)

**Issue:**
The `supabase.ts` file throws an error immediately when the component loads if env vars are missing. This prevents ANY page load - even unauthenticated pages like Home, Pricing, or Contact will crash because `AuthContext` imports this module at the top level.

**Root Cause:**
```typescript
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}
```

This is a synchronous error thrown during module initialization, crapping the entire app.

**How It Presents:**
```
Error: Missing Supabase environment variables
    at https://vm-*.vusercontent.net/src/lib/supabase.ts:5:9
[ENTIRE APP BREAKS - BLANK PAGE]
```

**Suggested Fix:**
Implement lazy initialization or deferred error handling:
- Create a separate validation function
- Show a helpful error page instead of crashing
- Only validate when Supabase functions are actually called
- Add environment variable validation in a config check utility

---

### 3. **Weak Error Handling with `catch (err: any)`**
**Severity:** MEDIUM - Potential Runtime Errors

**Affected Files:**
- `src/pages/auth/Login.tsx` (lines 46, 57)
- `src/pages/auth/Signup.tsx` (lines 86, 98)
- `src/pages/auth/ForgotPassword.tsx` (line 38)
- `src/pages/Audit.tsx` (line 137)
- `src/pages/dashboard/Settings.tsx` (lines 128, 169, 195)
- `src/pages/dashboard/Analytics.tsx` (line 90)
- `src/components/dashboard/WebsiteSetupModal.tsx` (lines 140, 160, 180, 224)

**Issue:**
Using `catch (err: any)` with `.message` property access without null/undefined checks. If an error object doesn't have a `.message` property (some async errors, abort errors, etc.), accessing `err.message` will fail.

**Example From `src/pages/auth/Login.tsx` (lines 45-49):**
```typescript
catch (err: any) {
  setError(err.message || 'Invalid email or password.');  // ← Fails if err is null or string
  setLoading(false);
}
```

**How It Presents:**
```
TypeError: Cannot read property 'message' of null
TypeError: Cannot read property 'message' of undefined
```

**Suggested Fix:**
```typescript
catch (error) {
  const errorMessage = 
    error instanceof Error ? error.message : 'An error occurred. Please try again.';
  setError(errorMessage);
}
```

---

### 4. **AuditResults Page - Missing ID Handling & Unsafe Type Assertion**
**Severity:** MEDIUM - Potential Crashes

**Affected File:** `src/pages/AuditResults.tsx` (line 12)

**Issue:**
```typescript
const { id } = useParams<{ id: string }>();
```

The component doesn't validate that `id` exists before using it. If the URL is `/audit/results/` without an ID, the `id` will be `undefined`, causing queries and rendering issues.

**Root Cause:**
- No validation of the route parameter
- Type assertion assumes `id: string` but it could be `undefined`
- The `useEffect` checks `if (!id) return;` (line 18) but this doesn't prevent render issues

**How It Presents:**
```
Empty page with spinner
404 errors in console
Audit not found even when it exists
```

**Suggested Fix:**
```typescript
const { id } = useParams<{ id?: string }>();

if (!id) {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="pt-32 pb-16 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Invalid Audit</h1>
        <Link to="/audit"><Button>Start New Audit</Button></Link>
      </div>
      <Footer />
    </div>
  );
}
```

---

### 5. **AuthCallback - Race Condition & Potential Infinite Redirect Loop**
**Severity:** MEDIUM - UX Breakage / Infinite Loops

**Affected File:** `src/pages/auth/AuthCallback.tsx` (multiple issues)

**Issues:**
1. Multiple code paths can trigger redirects (lines 33, 39, 47, 53, 72, 88-92)
2. The timeout at line 89 may redirect even if a redirect already happened (refs prevent this but it's fragile)
3. No validation that `window.location.href` is a valid callback URL
4. Session exchange can fail silently in edge cases

**How It Presents:**
```
Stuck in auth callback loop
Redirects to login, then back to callback, repeat
White page that won't load
```

**Suggested Fix:**
- Add a "max redirects" counter
- Clear auth state if callback fails after N retries
- Add a timeout that shows an error page instead of silently failing

---

### 6. **Contact Form - No Actual Email Sending**
**Severity:** MEDIUM - User Expectation Mismatch

**Affected File:** `src/pages/Contact.tsx` (line 22)

**Issue:**
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  console.log('Contact form submitted:', formData);  // ← Only logs to console!
  setSubmitted(true);
};
```

The form shows "Thank You!" message but doesn't actually send an email. The data is only logged to the console. Users will think their message was sent when it wasn't.

**How It Presents:**
User fills out contact form → sees "thank you" → no email received → frustration

**Suggested Fix:**
Implement actual email sending via:
- Supabase Edge Function (`send-contact-email`)
- Server Action
- API endpoint
- Third-party service (SendGrid, etc.)

---

### 7. **Settings Page - Unsafe Supabase Environment Variable Access**
**Severity:** HIGH - Crashes on Page Load

**Affected File:** `src/pages/dashboard/Settings.tsx` (lines 14-15)

**Issue:**
```typescript
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

These variables are used in the module scope but never validated. If they're undefined, the component will crash when trying to use them.

**How It Presents:**
Settings page won't load

**Suggested Fix:**
Remove these constants and use the `supabase` client that's already imported and properly initialized.

---

### 8. **Analytics Page - Missing Fallback for Undefined GA4 Property**
**Severity:** MEDIUM - Silent Failures

**Affected File:** `src/pages/dashboard/Analytics.tsx` (line 67)

**Issue:**
```typescript
const propertyId = profile?.ga4_property_id;
// ... later
const res = await fetch(
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ga4-data`,  // ← Crashes if env var undefined
  ...
);
```

Additionally, if `propertyId` is null/undefined, the API call proceeds anyway, which will fail server-side.

**How It Presents:**
```
404 errors calling /functions/v1/ga4-data
"notConfigured" is undefined, causing TypeError
```

**Suggested Fix:**
```typescript
if (!propertyId) {
  setNotConfigured(true);
  return;  // Don't make the API call
}
```

---

### 9. **Audit Page - Missing Error Handling for API Calls**
**Severity:** MEDIUM - Silent Failures

**Affected File:** `src/pages/Audit.tsx` (lines 48-62)

**Issue:**
```typescript
const analyzeWebsite = async (url: string) => {
  try {
    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-website`;
    // ...
  } catch (error) {
    console.error('Error calling analyze-website function:', error);  // ← Only logs, doesn't rethrow
    throw error;  // Rethrows but promise rejection not properly handled
  }
};
```

The function uses old Vite env variable syntax AND if the function call fails, there's no user-facing feedback about what went wrong.

**How It Presents:**
```
Audit submission fails silently
Console shows errors but user sees "There was an error..."
No indication of what the actual problem is
```

---

## Edge Cases & Potential Errors

### 10. **AuthContext - Potential Race Condition on Initial Load**
**Severity:** LOW - Race Condition

**Affected File:** `src/contexts/AuthContext.tsx` (lines 29-45)

**Issue:**
```typescript
useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setUser(session?.user ?? null);
    if (session?.user) {
      loadProfile(session.user.id, session.user);  // ← Async, but waiting handled implicitly
    }
  });
  // ...
}, []);
```

If `loadProfile` throws an error, it's caught but `loading` state might not be set to `false` in all error paths.

**How It Presents:**
Rare: Protected pages show spinner indefinitely
Impact: Low, only in specific error conditions

---

### 11. **Missing Type Safety on Audit Recommendations**
**Severity:** LOW - Potential Runtime Type Errors

**Affected File:** `src/lib/supabase.ts` (line 43)

**Issue:**
```typescript
recommendations: Array<{
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}>;
```

But in `src/pages/AuditResults.tsx` (line 413), the code tries to map over `audit.recommendations` without validating it's an array or that each item has the expected structure.

**How It Presents:**
```
TypeError: Cannot read property 'map' of undefined
TypeError: rec.priority is undefined
```

**Suggested Fix:**
Add validation:
```typescript
{audit.recommendations?.map((rec) => (
  // ...
)) ?? <p>No recommendations available</p>}
```

---

### 12. **Missing Input Validation on Audit Form**
**Severity:** LOW - Data Integrity

**Affected File:** `src/pages/Audit.tsx` (lines 97-140)

**Issue:**
No validation that:
- Website URL is actually a valid URL
- Business name is not empty or just whitespace
- Industry/Goal selections are valid

**How It Presents:**
Empty/invalid data sent to Supabase
API errors from backend
Poor user experience

**Suggested Fix:**
Add URL validation before submission:
```typescript
try {
  new URL(formData.websiteUrl);
} catch {
  setError('Please enter a valid website URL');
  return;
}
```

---

### 13. **WebsiteSetupModal - Missing Validation for GA4 Property ID**
**Severity:** MEDIUM - Invalid Data Storage

**Affected File:** `src/components/dashboard/WebsiteSetupModal.tsx` (line 80)

**Issue:**
GA4 Property ID is accepted as any string without validation. The standard format is numeric (e.g., `"123456789"`), but the form doesn't enforce this.

**How It Presents:**
Invalid GA4 IDs stored in database
API calls to Google Analytics fail
Analytics page shows errors

**Suggested Fix:**
```typescript
if (ga4PropertyId && !/^\d+$/.test(ga4PropertyId)) {
  setError('GA4 Property ID must be numeric');
  return;
}
```

---

### 14. **Missing Loading State on Google OAuth Flows**
**Severity:** LOW - UX Degradation

**Affected File:** `src/pages/auth/Login.tsx` and `src/pages/auth/Signup.tsx`

**Issue:**
When user clicks "Continue with Google", the button shows "Redirecting to Google..." but if the redirect takes >2 seconds, users might click again, causing duplicate OAuth requests.

**How It Presents:**
Multiple OAuth windows opening
Confusing user experience

---

### 15. **Calendly Script Injection Without Error Handling**
**Severity:** LOW - Silent Failures

**Affected File:** `src/pages/AuditResults.tsx` (lines 36-46)

**Issue:**
```typescript
const script = document.createElement('script');
script.src = 'https://assets.calendly.com/assets/external/widget.js';
script.async = true;
document.body.appendChild(script);
```

No error handling if the script fails to load. No check for load/error events.

**How It Presents:**
Calendly widget silently doesn't appear
No error message to user
Users can't book consultations

**Suggested Fix:**
```typescript
script.onerror = () => console.warn('Failed to load Calendly widget');
script.onload = () => console.log('Calendly widget loaded');
document.body.appendChild(script);
```

---

## Supabase Environment Variables - Risk Assessment

### Current Configuration Risks:

1. **Crash on Missing Env Vars**: If `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` are missing, the entire app crashes at the `src/lib/supabase.ts` module level.

2. **No Fallback for Vite Env Syntax**: Multiple files reference old `import.meta.env.VITE_*` which will be `undefined`, causing cascading errors.

3. **No Environment Validation on Startup**: There's no configuration check page or graceful degradation.

### Recommended Env Variable Handling:

```typescript
// src/lib/supabase.ts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { flowType: 'pkce' },
  });
} else {
  console.warn('Supabase environment variables not configured');
}

export { supabase };
export const isSupabaseConfigured = Boolean(supabase);
```

Then in components, check `isSupabaseConfigured` before making calls.

---

## Summary Table

| Issue | Severity | Type | Files Affected | User Impact |
|-------|----------|------|-----------------|-------------|
| Vite env syntax | CRITICAL | Runtime Error | 4 files | App crashes on load |
| Missing env vars crash | CRITICAL | Runtime Error | 1 file | App won't start |
| `catch (err: any)` | MEDIUM | Type Error | 10+ files | Occasional crashes |
| Missing ID validation | MEDIUM | Logic Error | 1 file | Page won't load |
| AuthCallback race condition | MEDIUM | UX Issue | 1 file | Infinite redirects |
| Contact form not sending | MEDIUM | Feature Bug | 1 file | No emails received |
| Settings env access | HIGH | Runtime Error | 1 file | Page crashes |
| Analytics undefined fallback | MEDIUM | Logic Error | 1 file | Silent failures |
| Audit API errors | MEDIUM | Error Handling | 1 file | Poor error messages |
| Missing type validation | LOW | Type Error | 2 files | Rare crashes |
| Missing URL validation | LOW | Data Integrity | 1 file | Invalid data stored |
| GA4 ID not validated | MEDIUM | Logic Error | 1 file | API failures |
| Calendly script errors | LOW | Silent Failure | 1 file | Widget not displayed |

---

## Recommended Fix Priority

1. **P0 (Fix Immediately):** Issues #1, #2 - App won't load
2. **P1 (Fix This Week):** Issues #3, #4, #5, #6, #7, #8 - Core functionality broken
3. **P2 (Fix Soon):** Issues #9, #12, #13 - Data integrity and UX
4. **P3 (Nice to Have):** Issues #10, #11, #14, #15 - Edge cases and polish
