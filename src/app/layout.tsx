import Providers from "./components/Providers"; // Impor komponen Providers baru
import "./globals.css";

export const metadata = {
  title: "Design With Us - Login",
  description: "Login page for Design With Us",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {/* Ganti SessionProvider dengan komponen Providers */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}