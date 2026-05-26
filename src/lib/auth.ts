import { getAuthSession as getSession } from "@/lib/auth-config";

// Get the current session
export async function getAuthSession() {
  try {
    const session = await getSession();
    return session;
  } catch (error) {
    console.error('[v0] Error getting auth session:', error);
    return null;
  }
}
