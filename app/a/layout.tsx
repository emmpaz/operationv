import { AdminPrivateRoutes, AuthPrivateRoutes } from "../utils/privateWrappers/PrivateRoutes"



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