import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import { Analytics } from '@vercel/analytics/next';

const sourceSans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NasloN Market",
  description: "Comercio de jogos e video games",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${sourceSans.variable} antialiased`}>
        <Header />
        {children}
        <Analytics />
      </body>
    </html>
  );
}