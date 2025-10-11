import { DefaultSession } from "next-auth";

// Perluas tipe Session dari NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Tambahkan properti 'id' yang wajib ada
    } & DefaultSession["user"]; // Gabungkan dengan properti default (name, email, image)
  }

  // Perluas tipe User yang dikembalikan oleh provider
  interface User {
    id: string; // Tambahkan properti 'id'
  }
}

// Perluas tipe JWT yang digunakan dalam callback
declare module "next-auth/jwt" {
  interface JWT {
    id: string; // Tambahkan properti 'id'
  }
}