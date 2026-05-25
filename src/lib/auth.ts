import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth-config";

// Get the current session
export async function getAuthSession() {
  try {
    const session = await getServerSession(authConfig);
    return session;
  } catch (error) {
    console.error('[v0] Error getting auth session:', error);
    return null;
  }
}
