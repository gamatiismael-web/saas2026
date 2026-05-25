import { getServerSession } from "next-auth";
import { handler } from "@/app/api/auth/[...nextauth]/route";

// Get the current session - NextAuth automatically detects the route handler
export async function getAuthSession() {
  try {
    const session = await getServerSession(handler);
    return session;
  } catch (error) {
    console.error('[v0] Error getting auth session:', error);
    return null;
  }
}

// Re-export for use in API routes
export { handler };
