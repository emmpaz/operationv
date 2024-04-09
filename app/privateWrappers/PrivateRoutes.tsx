'use client';

import { useContext, useEffect } from "react"
import { AuthContext } from "../context/AuthContext"
import { useRouter } from "next/navigation";


interface PrivateRoutesProps{
    children: React.ReactNode
}

export const AuthPrivateRoutes: React.FC<PrivateRoutesProps> = ({children}) => {
    const {user} = useContext(AuthContext)!;
    const router = useRouter();
    useEffect(() => {
        if(!user)
            router.push('/')
    }, [user])
    if(!user) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <span className="loading loading-dots loading-lg bg-primary"></span>
            </div>
        )
    };

    return <>{children}</>
}

export const VolunteerPrivateRoutes: React.FC<PrivateRoutesProps> = ({children}) => {
    const {user} = useContext(AuthContext)!;
    const router = useRouter();
    useEffect(() => {
        if(user.role !== "volunteer")
            router.push('/')
    }, [user])
    if(user.role !== "volunteer"){
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <span className="loading loading-dots loading-lg bg-primary"></span>
            </div>
        )
    };

    return <>{children}</>
}

export const AdminPrivateRoutes: React.FC<PrivateRoutesProps> = ({children}) => {
    const {user} = useContext(AuthContext)!;
    const router = useRouter();
    useEffect(() => {
        if(user.role !== "admin")
            router.push('/')
    }, [user])
    if(user.role !== "admin"){
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <span className="loading loading-dots loading-lg bg-primary"></span>
            </div>
        )
    };

    return <>{children}</>
}