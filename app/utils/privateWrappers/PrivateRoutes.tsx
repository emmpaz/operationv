'use client';

import { useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import { AuthContext } from "../../context/AuthContext";


interface PrivateRoutesProps{
    children: React.ReactNode
}

export const AuthPrivateRoutes: React.FC<PrivateRoutesProps> = ({children}) => {
    const {user, isLoading} = useContext(AuthContext)!;
    const router = useRouter();
    useEffect(() => {
        if(!user) router.push('/')

    }, [isLoading, user])
    if(isLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <span className="loading loading-dots loading-lg bg-primary"></span>
            </div>
        )
    };

    if(!user) return (
        <div className="w-full h-screen flex items-center justify-center">
            <span className="loading loading-dots loading-lg bg-primary"></span>
        </div>
    );

    return <>{children}</>
}

export const VolunteerPrivateRoutes: React.FC<PrivateRoutesProps> = ({children}) => {
    const {user, isLoading} = useContext(AuthContext)!;
    const router = useRouter();
    

    if(user.role !== 'volunteer'){
        router.push('/');
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <span className="loading loading-dots loading-lg bg-primary"></span>
            </div>
        );
    }

    return <>{children}</>
}

export const OnboardingPrivateRoutes: React.FC<PrivateRoutesProps> = ({children}) => {
    const {user, isLoading} = useContext(AuthContext)!;
    const router = useRouter();

    if(user && !user.completed_onboarding){
        router.push('/onboarding');
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <span className="loading loading-dots loading-lg bg-primary"></span>
            </div>
        );
    }

    return <>{children}</>
}

export const OnboardingDoneRoute: React.FC<PrivateRoutesProps> = ({children}) => {
    const {user, isLoading} = useContext(AuthContext)!;
    const router = useRouter();

    if(user && user.completed_onboarding){
        router.push('/v/dashboard');
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <span className="loading loading-dots loading-lg bg-primary"></span>
            </div>
        );
    }
    return <>{children}</>
}

export const AdminPrivateRoutes: React.FC<PrivateRoutesProps> = ({children}) => {
    const {user, isLoading} = useContext(AuthContext)!;
    const router = useRouter();
    

    if(user.role !== 'admin'){
        router.push('/');
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <span className="loading loading-dots loading-lg bg-primary"></span>
            </div>
        );
    }

    return <>{children}</>
}