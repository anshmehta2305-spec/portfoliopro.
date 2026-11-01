import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./db";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours session timeout for financial portal security
  },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      name: "Portfolio Pro Credentials",
      credentials: {
        email: { label: "Email / Username", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter both email and password");
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });

        if (!user || !user.isActive) {
          throw new Error("No active user account found with this email address");
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValidPassword) {
          throw new Error("Invalid password credentials");
        }

        // If a specific role was expected and doesn't match, warn or align
        if (credentials.role && credentials.role !== user.role && user.role !== "ADMIN") {
          throw new Error(`This account belongs to ${user.role} role, not ${credentials.role}`);
        }

        // Log audit event
        try {
          await db.auditLog.create({
            data: {
              userId: user.id,
              action: "LOGIN_SUCCESS",
              details: `User logged into role ${user.role}`,
            },
          });
        } catch {
          // Non-blocking
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          arnCode: user.arnCode,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as unknown as { role: string }).role;
        token.arnCode = (user as unknown as { arnCode: string | null }).arnCode;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as unknown as { id: string }).id = token.id as string;
        (session.user as unknown as { role: string }).role = token.role as string;
        (session.user as unknown as { arnCode: string | null }).arnCode = token.arnCode as string | null;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "portfolio-pro-super-secret-key-change-in-production-2026",
};

