import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    // ... provider lainnya
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (credentials?.email === "user@example.com" && credentials?.password === "password") {
          // Objek yang dikembalikan HARUS memiliki 'id'
          return {
            id: "1",
            name: "Example User",
            email: "user@example.com",
          };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Saat login, user ada. Simpan id-nya ke token.
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Saat sesi dicek, token ada. Kirim id-nya ke objek session.user.
      // TypeScript sekarang TAHU bahwa session.user memiliki properti 'id'
      if (session.user && token.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
  }
};