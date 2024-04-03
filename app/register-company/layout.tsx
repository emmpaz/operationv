import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3"






export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {

    const reCaptchaKey: string | undefined = process.env.NEXT_PUBLIC_SITE_KEY;
  
    return (
      <html lang="en">
        <body>
          <GoogleReCaptchaProvider 
            reCaptchaKey={reCaptchaKey ?? 'NOT DEFINED'}>
            {children}
          </GoogleReCaptchaProvider>
        </body>
      </html>
    )
  }