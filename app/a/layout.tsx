import { AdminPrivateRoutes, AuthPrivateRoutes, VolunteerPrivateRoutes } from "../privateWrappers/PrivateRoutes"



export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <AuthPrivateRoutes>
            <AdminPrivateRoutes>
                {children}
            </AdminPrivateRoutes>
        </AuthPrivateRoutes>
    )
}