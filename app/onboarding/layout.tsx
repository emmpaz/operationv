import { OnboardingDoneRoute } from "../privateWrappers/PrivateRoutes";


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