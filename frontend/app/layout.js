import "./globals.css";

export const metadata = {
  title: "DNA Analysis Dashboard",
  description: "Analyze DNA sequences for protein encoding",
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
