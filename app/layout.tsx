import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "LINQMA",
  description: "ویترین دیجیتال کسب‌وکار شما",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
        <Toaster
          position="top-center"
          dir="rtl"
          toastOptions={{
            style: {
              fontFamily: "Vazirmatn, sans-serif",
            },
          }}
        />
      </body>
    </html>
  );
}