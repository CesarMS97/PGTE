
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PGTE | Gestión Técnica Eléctrica",
    template: "%s | PGTE",
  },
  description:
    "Plataforma de Gestión Técnica Eléctrica. Sistema web para gestionar viviendas, levantamientos eléctricos y cotizaciones de servicios eléctricos.",
  applicationName: "PGTE",
  keywords: [
    "PGTE",
    "gestión técnica eléctrica",
    "levantamientos eléctricos",
    "cotizaciones eléctricas",
    "gestión de viviendas",
  ],
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
