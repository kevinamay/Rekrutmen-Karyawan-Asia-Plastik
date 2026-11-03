import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { RecruitmentProvider } from "@/context/RecruitmentContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "NexaRecruit AI | Automated Corporate Recruitment Portal",
  description:
    "End-to-end automated corporate recruitment web application featuring AI CV screening, competency assessment, AI HR interview, and final decision dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-slate-50">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full font-sans antialiased text-corporate-900 bg-[#fafbfe]`}
      >
        <RecruitmentProvider>{children}</RecruitmentProvider>
      </body>
    </html>
  );
}
