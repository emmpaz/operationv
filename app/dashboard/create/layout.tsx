import { AdminPrivateRoutes } from "../../private_handling/PrivateRoutes"





export default function PrivateLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <AdminPrivateRoutes>
            {children}
        </AdminPrivateRoutes>

    )
}