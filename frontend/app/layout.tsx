import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Startup Roast — Pitch Your Startup. Get Roasted.",
  description:
    "An instant, brutally honest roast of your startup idea from a panel of fake investors, angry engineers, and caffeine-fueled VCs.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Bowlby+One+SC&family=Inter:wght@400;500;600;700;800&family=Special+Elite&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
