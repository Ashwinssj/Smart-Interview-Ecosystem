import { Metadata } from "next";
import Link from "next/link";
import { GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  title: "Auth | Smart Interview Ecosystem",
  description: "Sign in or create an account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2" aria-label="Smart Interview Ecosystem Home">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-semibold text-xl text-slate-950">SmartInterview</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center pt-16 pb-12 px-4">
        {children}
      </main>

      <footer className="bg-slate-950 border-t border-slate-800 py-8">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 text-center">
          <p className="text-slate-500 text-sm">
            © 2024 Smart Interview Ecosystem. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}