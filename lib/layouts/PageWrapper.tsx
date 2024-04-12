'use client'



import { NavBar } from "../../app/components/common/navbar"
import { NavHamburger } from "../buttons/NavHamburger"



export default function Page({
    children
}: { children: React.ReactNode }
) {

    return (
        <div className="flex bg-custom min-h-screen">
            <div className="w-full flex">
                <NavBar />
                <div className="w-full flex flex-col max-h-screen overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    )
}