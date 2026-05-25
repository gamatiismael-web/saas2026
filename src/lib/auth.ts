import { getServerSession } from "next-auth";
import { handler } from "@/app/api/auth/[...nextauth]/route";

// Get the current session
export async function getAuthSession() {
  return await getServerSession(handler);
}

// Re-export for use in client components
export { handler };
