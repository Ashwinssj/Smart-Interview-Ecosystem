import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = ({ variable: "--font-mono", subsets: ["latin"] } as any);

export const metadata: Metadata = {
  title: "Smart Interview Ecosystem | AI-Powered Placement Platform",
  description: "Where Preparation Meets Opportunity. AI-powered placement platform with resume screening, adaptive assessments, and realistic mock interviews.",
  keywords: ["placement", "interview preparation", "AI mock interview", "resume screening", "campus placement"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable} antialiased`}>
      <body className="bg-slate-50 text-slate-950 min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}