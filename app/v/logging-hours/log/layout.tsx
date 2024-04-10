import { VolunteerPrivateRoutes } from "../../../privateWrappers/PrivateRoutes"



export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <body>
                {children}
        </body>
    )
}