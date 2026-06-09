import { Toast } from "@/components";
import "./globals.css";
import QueryProvider from "@/provider/queryProvider";
import type { Metadata } from "next";
import { Geist } from "next/font/google";

const geistSans = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Public Driving Management System (PDMS)",
    template: "%s | PDMS",
  },

  description:
    "Public Driving Management System (PDMS) is a comprehensive platform for managing driving schools, students, instructors, training schedules, attendance, payments, licenses, examinations, and operational workflows.",

  keywords: [
    "PDMS",
    "Public Driving Management System",
    "Driving School Management",
    "Driving Institute Software",
    "Driving Training Management",
    "Student Management System",
    "Instructor Management",
    "Driving Test Management",
    "License Training System",
    "Vehicle Management",
    "Attendance Management",
    "Training Scheduling",
    "Driving School ERP",
    "Driving Education Platform",
    "Transportation Training Software",
    "Driving Course Management",
    "Cornor Tech",
  ],

  authors: [
    {
      name: "Cornor Tech Private Limited",
    },
  ],

  creator: "Cornor Tech Private Limited",
  publisher: "Cornor Tech Private Limited",

  applicationName: "Public Driving Management System (PDMS)",
  category: "Education & Transportation",

  metadataBase: new URL("https://flowtest.cornortech.com"),

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Public Driving Management System (PDMS)",
    description:
      "A complete platform for managing driving schools, instructors, students, training schedules, attendance, examinations, and payments.",

    url: "https://flowtest.cornortech.com",
    siteName: "PDMS",
    type: "website",
    locale: "en_US",

    images: [
      {
        url: "/DrivingLogo.png",
        width: 1200,
        height: 630,
        alt: "Public Driving Management System (PDMS)",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Public Driving Management System (PDMS)",
    description:
      "Manage driving schools, instructors, students, training sessions, exams, attendance, and payments from a single platform.",
    images: ["/DrivingLogo.png"],
  },

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

  icons: {
    icon: "/DrivingLogo.png",
    shortcut: "/DrivingLogo.png",
    apple: "/DrivingLogo.png",
  },

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
