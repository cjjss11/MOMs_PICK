import Head from "next/head";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "./Provider";
import Link from "next/link";
import { Button } from "@nextui-org/button";
import NavBar from "./_navbar/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
  manifest: "/manifest.json",
  themeColor: "#fff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#317EFB" />
      </Head>
      <body className={inter.className}>
        <Provider>
          {children}
          <div
            className="w-full"
            style={{
              position: "sticky",
              bottom: "0",
              backgroundColor: "white",
            }}
          >
            <div
              style={{
                height: "77px",
                width: "auto",
              }}
            ></div>
          </div>
          <NavBar />
        </Provider>
      </body>
    </html>
  );
}
