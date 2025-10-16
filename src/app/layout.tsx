import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";

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
    <body>
      <SessionProvider>{children}</SessionProvider>
    </body>
  </html>
);

export default RootLayout;
