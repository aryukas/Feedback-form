// app/layout.tsx
import "./styles/globals.css";
import { AuthProvider } from "@/lib/auth";

export const metadata = {
  title: "Inventory System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
