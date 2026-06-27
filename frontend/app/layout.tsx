import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import Footer from "@/components/Footer";
import "./globals.css";
import Header from "@/components/Header";
import AuthGuard from "@/components/AuthGuard";

const openSans = Open_Sans({
  weight: "400",
  subsets: ["cyrillic", "latin"]
})
export const viewport = {
  width: 'device-width',
  initialScale: 1,
};
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
        <AuthGuard>
          <div className="my-[150px] md:my-[200px]">
            {children}
          </div>
        </AuthGuard>
        <Footer />
      </body>
    </html>
  );
}
