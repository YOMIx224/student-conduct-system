import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: 'ระบบตัดคะแนนพฤติกรรมนักเรียน-นักศึกษา',
  description: 'ระบบตัดคะแนนพฤติกรรมนักเรียน-นักศึกษา แผนกวิชาเทคโนโลยีสารสนเทศ วิทยาลัยเทคนิคสิงห์บุรี',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="antialiased">{children}</body>
    </html>
  );
}