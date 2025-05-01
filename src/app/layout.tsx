"use client";

import AddTartar from "@/components/add-tartar";
import "./globals.css";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isNewRoute = pathname === "/new";

  return (
    <html lang="en">
      <body className="max-h-screen h-screen flex flex-col items-center justify-between px-4">
        <header className="flex items-center justify-center h-20 bg-background">
          <h1 className="text-3xl font-bold text-foreground">Tartares</h1>
        </header>
        <main>
          {children}
          {!isNewRoute && <AddTartar />}
        </main>
      </body >
    </html >
  );
}
