import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { SolanaWalletProvider } from "@/components/providers/wallet-provider";
import { LanguageProvider } from "@/contexts/language-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Multando - Report Traffic Infractions",
  icons: { icon: "/favicon.png", apple: "/logo.png" },
  description: "Report traffic infractions, earn rewards, and help make roads safer for everyone.",
  keywords: ["traffic infractions", "report", "rewards", "road safety"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-white font-sans antialiased dark:bg-surface-900">
        <QueryProvider>
          <LanguageProvider>
            <SolanaWalletProvider>{children}</SolanaWalletProvider>
          </LanguageProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
