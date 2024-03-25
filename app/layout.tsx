import { AuthProvider } from "./context/AuthContext";
import '../styles/global.css';
import { AuthPrivateRoutes } from "./private_handling/PrivateRoutes";
import ReactQueryProvider from "./context/ReactQueryProvider";
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
              {children}
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
