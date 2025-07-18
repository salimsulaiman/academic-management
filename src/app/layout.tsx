import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import { ThemeProvider as AppThemeProvider } from "@/contexts/ThemeContext";
import theme from "./theme";
import Sidebar from "@/components/Sidebar";
import { SidebarProvider } from "@/contexts/SidebarContext";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Academic Grade Management System",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.variable}>
      <body className={`antialiased flex bg-gray-50 min-h-screen text-gray-900 dark:bg-gray-900 dark:text-white`}>
        <AppRouterCacheProvider options={{ key: "css", enableCssLayer: true }}>
          <MuiThemeProvider theme={theme}>
            <AppThemeProvider>
              <SidebarProvider>
                <Sidebar />
                {children}
              </SidebarProvider>
            </AppThemeProvider>
          </MuiThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
