import { AuthPrivateRoutes, OnboardingPrivateRoutes, VolunteerPrivateRoutes } from "../utils/privateWrappers/PrivateRoutes"



export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <AuthPrivateRoutes>
            <VolunteerPrivateRoutes>
                <OnboardingPrivateRoutes>
                    {children}
                </OnboardingPrivateRoutes>
            </VolunteerPrivateRoutes>
        </AuthPrivateRoutes>
    )
}