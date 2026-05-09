import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AIChatBubble from "@/components/shared/AIChatBubble";
import Providers from "@/components/shared/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NexusMarket | AI-Powered Freelance Ecosystem",
  description: "The future of freelancing powered by AI and secure blockchain-ready transactions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
        <AIChatBubble />
      </body>
    </html>
  );
}