import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Analytics } from "@vercel/analytics/next";

const sourceSans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NasloN Market",
  description: "Comercio de Games e Colecionaveis",
  metadataBase: new URL("https://www.nnmarket.shop"),
  openGraph: {
    title: "NasloN Market",
    description: "Comercio de Games e Colecionaveis",
    url: "https://www.nnmarket.shop",
    siteName: "NasloN Market",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${sourceSans.variable} antialiased flex flex-col min-h-screen`}>
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}