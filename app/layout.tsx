import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Karol-Ann Mozjesik | Dallas-Fort Worth Real Estate",
  description: "Personally guided real estate across Dallas-Fort Worth.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="en"><body>{children}</body></html>;
}
