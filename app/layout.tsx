import type { Metadata } from "next";
import { Anton, Jost, Playfair_Display } from "next/font/google";
import "./globals.css";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "DAVE — The Gallery",
  description: "David Ajibua — captured, kept, celebrated",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${anton.variable} ${jost.variable} ${playfair.variable} font-body`}>
        <div className="grain" />
        {children}
      </body>
    </html>
  );
}
