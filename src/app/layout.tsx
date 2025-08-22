import type { Metadata } from "next";
import Script from "next/script";
import { Poppins } from "next/font/google"; // ✅ Next.js way for fonts
import "./globals.css";

const poppins = Poppins({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JYOTI NETRA SEVA & JYOTI CHASHMA SAGAR – Eyeglasses & Sunglasses",
  description:
    "Sagar's trusted opticians & eye care. Premium frames, trendy eyewear, and personalized service.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        {children}

        {/* ✅ Keep Bootstrap + FontAwesome CDN */}
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          rel="stylesheet"
        />

        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
