import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ToastProvider } from "./_components/toast-provider";
import "react-toastify/dist/ReactToastify.css";
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
  title: "Suwave Lojista",
  description: "App do lojista Suwave.",
};

// Aplica o tema salvo antes da primeira pintura para evitar flash de tema errado.
const themeInitScript = `try{var t=localStorage.getItem("suwave:lojista:theme");if(t==="auto"){t=matchMedia("(prefers-color-scheme: dark)").matches?"night":"classic"}if(t&&t!=="classic"){document.documentElement.dataset.theme=t}}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
