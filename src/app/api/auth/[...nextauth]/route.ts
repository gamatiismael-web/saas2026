import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";

export const { handlers: { GET, POST }, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
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
  ],
  callbacks: {
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
