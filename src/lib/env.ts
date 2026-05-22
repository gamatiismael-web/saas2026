// Validate required environment variables at startup
export function validateEnvVars() {
  const requiredVars = [
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'PGHOST',
    'PGDATABASE',
    'PGUSER',
    'AWS_REGION',
    'AWS_ROLE_ARN',
  ];

  const missing = requiredVars.filter((v) => !process.env[v]);

  if (missing.length > 0) {
    console.error(
      '[v0] Missing required environment variables:',
      missing.join(', ')
    );
    console.error('[v0] Please set these in your .env.local file');
    throw new Error(`Missing env vars: ${missing.join(', ')}`);
  }

  console.log('[v0] All required environment variables are set');
}

// Optional: Check for Google OAuth vars
export function hasGoogleOAuth() {
  return process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;
}
