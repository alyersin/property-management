import { Providers } from "./providers";
import { AuthProvider } from "../contexts/AuthContext";
// import { Inter } from "next/font/google";
import { Lexend } from "next/font/google";

// const inter = Inter({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
//   variable: "--font-inter",
// });

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lexend",
});

export const metadata = {
  title: "Home Admin",
  description: "Admin dashboard application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={lexend.className} suppressHydrationWarning={true}>
        <Providers>
          <AuthProvider>
            {children}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
