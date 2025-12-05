import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: 'ระบบตัดคะแนนความประพฤตินักเรียน-นักศึกษา | วิทยาลัยเทคนิคสิงห์บุรี',
  description: 'ระบบบริหารจัดการคะแนนความประพฤติของนักเรียน-นักศึกษา แผนกวิชาเทคโนโลยีสารสนเทศ วิทยาลัยเทคนิคสิงห์บุรี',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}