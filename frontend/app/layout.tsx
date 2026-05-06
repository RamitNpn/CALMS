import { Toast } from "@/components";
import "./globals.css";
import QueryProvider from "@/provider/queryProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CALMS - Management System",
  description: "Comprehensive All-in-One Learning Management System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="bg-gray-50">
        <QueryProvider>{children}
              <Toast />
        </QueryProvider>
      </body>
    </html>
  );
}