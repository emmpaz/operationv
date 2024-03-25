import { AuthPrivateRoutes } from "../private_handling/PrivateRoutes"

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