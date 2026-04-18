import type { Metadata } from "next";
import { Cairo, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-plex-arabic",
});

export const metadata: Metadata = {
  title: "منصة إنجاز التعليمية",
  description: "منصة عربية احترافية لإدارة الأداء التعليمي والزيارات الصفية والتقارير المدرسية.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} ${plexArabic.variable} font-[var(--font-plex-arabic)]`}>
        {children}
      </body>
    </html>
  );
}
