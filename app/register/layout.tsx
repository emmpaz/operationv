import RecaptchaWrapper from "../context/RecaptchaWrapper"

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {

    return (
          <RecaptchaWrapper>
            {children}
          </RecaptchaWrapper>
    )
  }