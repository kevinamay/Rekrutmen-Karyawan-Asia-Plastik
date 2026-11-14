import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { RecruitmentProvider } from "@/context/RecruitmentContext";
import { SplashScreen } from "@/components/common/SplashScreen";

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
  title: "CV. Asia Plastik | Portal Rekrutmen Karyawan",
  description:
    "Portal Rekrutmen Resmi CV. Asia Plastik. Peluang karir di industri manufaktur plastik terkemuka dengan sistem seleksi modern dan transparan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full bg-slate-50 scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full font-sans antialiased text-slate-800 bg-white`}
      >
        <SplashScreen />
        <RecruitmentProvider>{children}</RecruitmentProvider>
      </body>
    </html>
  );
}
