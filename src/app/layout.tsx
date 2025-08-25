import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import { AppProviders } from "./providers";   // ✅ wrap for i18n

export const metadata: Metadata = {
  title: "JYOTI NETRA SEVA & JYOTI CHASHMA SAGAR – Eyeglasses & Sunglasses",
  description: "Sagar's trusted opticians & eye care. Premium frames, trendy eyewear, and personalized service.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;700&family=Quicksand:wght@400;600&family=Raleway:wght@400;700&family=Nunito+Sans:wght@400;700&family=Montserrat:wght@400;700&display=swap" rel="stylesheet"/>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"/>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" rel="stylesheet"/>
      </head>
      <body>
        <ThemeProvider>
          <AppProviders>{children}</AppProviders> {/* ✅ i18n context */}
        </ThemeProvider>
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
