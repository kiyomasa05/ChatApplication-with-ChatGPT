import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppProvider } from "../context/AppContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChatApplication-with-ChatGPT",
  description: "Applicatin that You can play with ChatGPT",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
