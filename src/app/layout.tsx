import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { auth } from "../../auth";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { ModeToggle } from "@/components/ui/mode-toggle";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={cn("antialiased overflow-x-hidden", poppins.variable)}>
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <div className="absolute top-0 z-[-2] h-screen w-screen bg-background bg-[radial-gradient(ellipse_80%80%_at_50%-20%,rgba(146,227,169,0.3),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%80%_at_50%-20%,rgba(94,161,255,0.3),rgba(0,0,0,0))]"></div>{" "}
            <Toaster richColors />
            {children}
            <div className="fixed left-[0%] bottom-[0%]">
              <ModeToggle />
            </div>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
