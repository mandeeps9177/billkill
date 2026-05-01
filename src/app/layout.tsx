import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthContext";

export const metadata: Metadata = {
  title: "Billkill — Split your BLR airport ride",
  description: "Match with fellow travellers flying to or from Bengaluru airport. Save up to 60% on cab fares.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Roboto:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#F8F9FA]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
