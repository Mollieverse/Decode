import type { Metadata, Viewport } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Decode — Upload anything. Understand everything.",
  description:
    "Turn confusing documents into simple explanations, key takeaways, audio summaries, and quizzes. Powered by AI.",
  keywords: ["AI", "document simplifier", "PDF reader", "study tool", "ELI5"],
  authors: [{ name: "Decode" }],
  openGraph: {
    title: "Decode",
    description: "Upload anything. Understand everything.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Decode",
    description: "Upload anything. Understand everything.",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Decode",
  },
};

export const viewport: Viewport = {
  themeColor: "#8B5CF6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-bg antialiased">
        {children}
      </body>
    </html>
  );
}
