import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Pastikan baris ini persis seperti ini

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };