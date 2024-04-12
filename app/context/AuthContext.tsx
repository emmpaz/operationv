'use client'
import { createContext, useState, useEffect } from "react";
import { iUserDB } from "../../helpers/DatabaseTypes";
import { useRouter } from "next/navigation";
import { findUserSession } from "../utils/supabase/auth_actions/findUserSession";

interface AuthContextType {
    user: iUserDB | null,
    userHandler: (user: iUserDB | null) => void;
    isLoading: boolean
}

interface AuthProviderProps {
    children: React.ReactNode
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<iUserDB | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const userHandler = (user: iUserDB | null) => setUser(user);

    useEffect(() => {
        const fetchUser = async () => {
            setUser(await findUserSession());
            setIsLoading(false);
        }
        fetchUser();
    }, [])

    if(isLoading){
        return(
            <div className="w-full h-screen flex items-center justify-center">
                    <span className="loading loading-dots loading-lg bg-primary"></span>
            </div>
        )
    }

    return (
        <AuthContext.Provider value={{ user, userHandler, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}