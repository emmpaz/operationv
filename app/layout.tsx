import { AuthProvider } from "./context/AuthContext";
import '../styles/global.css';
import ReactQueryProvider from "./context/ReactQueryProvider";
import { NavProvider } from "./context/NavContext";

export const metadata = {
  title: 'TrueImpact',
  description: 'A volunteering certification system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <AuthProvider>
            <NavProvider>
              {children}
            </NavProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
