import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "mindframe — a Lattice node",
  description:
    "Turn source text into a source-tagged concept article and a per-topic workbook.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
