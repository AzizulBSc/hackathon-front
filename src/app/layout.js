import "./globals.css";

export const metadata = {
  title: "SmartSupport - Customer Support System",
  description: "AI-powered customer support ticketing system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
