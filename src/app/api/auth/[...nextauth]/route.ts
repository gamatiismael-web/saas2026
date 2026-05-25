import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";

// Build providers array - only include Google if credentials are provided
const providers = [
  CredentialsProvider({
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        return null;
      }

      try {
        const result = await query(
          'SELECT id, email, name, password_hash FROM users WHERE email = $1',
          [credentials.email]
        );

        if (result.rows.length === 0) return null;

        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password_hash
        );

        if (!isPasswordValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      } catch (error) {
        console.error("[v0] Auth error:", error);
        return null;
      }
    },
  }),
];

// Only add Google provider if credentials are available
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

const handler = NextAuth({
  providers,
  callbacks: {
    async signIn({ user, account }) {
      // For Google OAuth, create user in database if they don't exist
      if (account?.provider === 'google' && user.email) {
        try {
          // Check if user exists
          const existingUser = await query(
            'SELECT id FROM users WHERE email = $1',
            [user.email]
          );

          // If user doesn't exist, create them
          if (existingUser.rows.length === 0) {
            await query(
              'INSERT INTO users (email, name, role) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING',
              [user.email, user.name || user.email, 'client']
            );
          }
        } catch (error) {
          console.error('[v0] Error creating user from Google OAuth:', error);
          // Still allow sign in even if database error
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
});

export { handler as GET, handler as POST, handler };
