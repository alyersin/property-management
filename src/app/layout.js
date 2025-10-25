import { Providers } from "./providers";
import { AuthProvider } from "../contexts/AuthContext";

export const metadata = {
  title: "Home Admin",
  description: "Admin dashboard application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <Providers>
          <AuthProvider>
            {children}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
