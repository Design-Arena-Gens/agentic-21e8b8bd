import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Card Reminders",
  description: "Multi-person credit card bill reminders",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="header">
            <h1>Credit Card Reminders</h1>
          </header>
          <main>{children}</main>
          <footer className="footer">? {new Date().getFullYear()} Card Reminders</footer>
        </div>
      </body>
    </html>
  );
}
