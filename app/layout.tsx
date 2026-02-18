import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TalentFlow AI | AI-Powered Applicant Tracking System",
  description:
    "Streamline your hiring process with AI-powered candidate screening, intelligent matching, and seamless pipeline management.",
  keywords: [
    "ATS",
    "Applicant Tracking System",
    "AI Recruiting",
    "Hiring Software",
    "HR Tech",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}

        {/* Global Toast Notifications */}
        <Toaster
          position="bottom-right"
          expand={false}
          richColors
          closeButton
          duration={4000}
          toastOptions={{
            style: {
              borderRadius: "var(--radius)",
              boxShadow: "var(--shadow-soft-lg)",
            },
            classNames: {
              toast: "font-sans text-sm",
              title: "font-semibold",
              description: "text-muted-foreground",
              success: "border-success/30",
              error: "border-destructive/30",
              warning: "border-warning/30",
              info: "border-info/30",
            },
          }}
        />
      </body>
    </html>
  );
}
