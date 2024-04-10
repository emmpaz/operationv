import { AuthPrivateRoutes } from "../privateWrappers/PrivateRoutes"

export default function PrivateLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <AuthPrivateRoutes>
            {children}
        </AuthPrivateRoutes>

    )
}