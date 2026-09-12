import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DAVE — 25",
  description: "A cinematic birthday gallery.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-ink text-bone antialiased">
        <div className="grain-overlay animate-grain" />
        {children}
      </body>
    </html>
  );
}
