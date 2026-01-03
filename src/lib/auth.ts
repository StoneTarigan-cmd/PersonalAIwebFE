// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        console.log("NextAuth authorize function called.");
        console.log("Credentials:", credentials);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        console.log("Fetching to:", `${apiUrl}/api/auth/login`);

        if (!apiUrl) {
          console.error("NEXT_PUBLIC_API_URL is not defined in the server environment.");
          return null;
        }

        try {
          const res = await fetch(`${apiUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          console.log("Backend response status:", res.status);
          console.log("Backend response ok:", res.ok);

          if (!res.ok) {
            const errorData = await res.json();
            console.error("Backend login failed:", errorData);
            throw new Error(errorData.message || 'Login failed');
          }

          const data = await res.json();
          console.log("Backend login success:", data);

          if (data.user) {
            return data.user;
          } else {
            return null;
          }
        } catch (error: any) {
          console.error("Error in authorize function:", error.message);
          throw new Error(error.message);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
  }
};