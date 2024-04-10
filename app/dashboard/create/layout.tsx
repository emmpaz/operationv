import { AdminPrivateRoutes } from "../../privateWrappers/PrivateRoutes"





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