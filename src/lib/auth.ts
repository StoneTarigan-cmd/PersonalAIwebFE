// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "./supabase";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Cari pengguna di Supabase berdasarkan email
        const { data: user, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', credentials.email)
          .single(); // .single() untuk mendapatkan satu objek

        if (error || !user) {
          return null; // Pengguna tidak ditemukan
        }

        // Bandingkan password yang dimasukkan dengan password yang di-hash
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null; // Password tidak cocok
        }

        // --- TAMBAHKAN PENGECEKAN VERIFIKASI ---
        if (!user.is_verified) {
          // Anda bisa melempar error yang lebih spesifik di sini jika mau
          // tapi untuk saat ini, kita cukup hentikan login.
          return null; 
        }
        // --- AKHIR PENGECEKAN ---

        // Jika berhasil, kembalikan data user
        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
        };
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
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
  }
};