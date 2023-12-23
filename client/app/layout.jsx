import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";

import "./globals.css";
import Provider from "@/providers/ReactQueryProvider";
import StoreProvider from "@/providers/StoreProvider";
import NextAuthProvider from "@/providers/NextAuthProvider";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider session={session}>
          <StoreProvider>
            <Provider>
              <Navbar />
              <main>{children}</main>
            </Provider>
          </StoreProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
