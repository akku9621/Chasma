import { AppProviders } from "../providers"; // ✅ i18n + context (adjust path if needed)

export const metadata = {
  title: "Authentication",
  description: "Login and Signup pages",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* ✅ Wrap with AppProviders for i18n + context */}
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
