import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "User Content - Parent App",
  description: "Chat interface for generating dynamic UI and video content",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
