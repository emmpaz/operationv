import { OnboardingDoneRoute } from "../utils/privateWrappers/PrivateRoutes"


export default function RootLayout({
    children
} : {
    children : React.ReactNode
}){

    return(
        <OnboardingDoneRoute>
            {children}
        </OnboardingDoneRoute>
    )
} 