import { Toast } from "@/components";
import "./globals.css";
import QueryProvider from "@/provider/queryProvider";
import type { Metadata } from "next";
import { Geist } from 'next/font/google'

const geistSans = Geist({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: {
    default: "FlowDesk - Multi-Tenant Business Management SaaS",
    template: "%s | FlowDesk",
  },
  description:
    "FlowDesk is a modular multi-tenant SaaS platform built with MERN Stack for managing businesses, clients, staff, billing, attendance, scheduling, token queues, reports, notifications, and more.",
  keywords: [
    "FlowDesk",
    "CALMS",
    "Business Management System",
    "Learning Management System",
    "Multi Tenant SaaS",
    "MERN Stack SaaS",
    "Queue Management System",
    "Token Management",
    "Billing System",
    "Attendance Management",
    "Scheduling System",
    "Staff Management",
    "Client Management",
    "Driving Institute Software",
    "Coaching Center Software",
    "Clinic Management",
    "Gym Management",
    "Salon Management",
    "Business ERP",
    "SaaS Billing",
    "Analytics Dashboard",
  ],

  authors: [
    {
      name: "Cornor Tech Private Limited",
    },
  ],

  creator: "Cornor Tech Private Limited",
  publisher: "Cornor Tech Private Limited",
  applicationName: "FlowDesk",
  category: "Business & Productivity",
  metadataBase: new URL("https://flowdesk.cornortech.com"),
  alternates: {
    canonical: "/",
  },

  // openGraph: {
  //   title: "FlowDesk - Multi-Tenant Business Operations Platform",
  //   description:
  //     "A complete modular SaaS platform for business operations, billing, attendance, scheduling, token queues, analytics, and client management.",
  //   url: "https://flowdesk.cornortech.com",
  //   siteName: "FlowDesk",
  //   type: "website",
  //   locale: "en_US",

  //   images: [
  //     {
  //       url: "/og-image.png",
  //       width: 1200,
  //       height: 630,
  //       alt: "FlowDesk SaaS Platform",
  //     },
  //   ],
  // },

  // twitter: {
  //   card: "summary_large_image",
  //   title: "FlowDesk - Business Management SaaS",
  //   description:
  //     "Modular multi-tenant MERN SaaS platform for businesses and institutions.",
  //   images: ["/og-image.png"],
  // },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // icons: {
  //   icon: "/favicon.ico",
  //   shortcut: "/favicon.ico",
  //   apple: "/apple-touch-icon.png",
  // },

  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${geistSans.className} bg-gray-50`}>
          <QueryProvider>
            {children}
            <Toast />
          </QueryProvider>
      </body>
    </html>
  );
}
