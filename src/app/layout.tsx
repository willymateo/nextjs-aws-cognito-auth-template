import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js AWS Cognito Auth Template",
  description: "Next.js AWS Cognito Auth Template",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <html lang="en">
    <body>{children}</body>
  </html>
);

export default RootLayout;
