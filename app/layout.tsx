// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";               // <- BẮT BUỘC: import global CSS đúng path

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTA from "@/components/CTA";
import ChatWidgets from "@/components/ChatWidgets.client";
import MessengerBtn from "@/components/MessengerBtn";
import HeaderShell from "@/components/HeaderShell";

export const metadata: Metadata = {
  title: "MCBROTHER JSC",
  description:
    "MCBROTHER JSC – Giải pháp máy móc chế biến & đóng gói thực phẩm.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
     <body className="min-h-screen bg-surface text-gray-900 antialiased selection:bg-primary/10 selection:text-primary">
        <HeaderShell />

        {children}       
        <Footer />
        <CTA />
        {/* <MessengerBtn /> */}
      </body>
    </html>
  );
}
