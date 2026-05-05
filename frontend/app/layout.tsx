import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import Footer from "@/components/Footer";
import "./globals.css";
import Header from "@/components/Header";

const openSans = Open_Sans({
  weight: "400",
  subsets: ["cyrillic", "latin"]
})

export const metadata: Metadata = {
  title: "Hekr Store",
  description: "Сайт сервиса оптово-розничной торговли одеждой Hekr Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${openSans.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <div className="mt-[200px]">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
