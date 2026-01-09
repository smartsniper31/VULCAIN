import type { Metadata } from "next";
import Providers from "../components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "VULCAIN | Trend Intelligence",
  description: "Aero-Dark Trend Intelligence Engine",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`antialiased aero-dark-bg`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
