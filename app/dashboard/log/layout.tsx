import { VolunteerPrivateRoutes } from "../../private_handling/PrivateRoutes"



export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <body>
            <VolunteerPrivateRoutes>
                {children}
            </VolunteerPrivateRoutes>
        </body>
    )
}