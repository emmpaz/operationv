'use client'

import { useRouter } from "next/navigation";
import { useContext, useEffect, useState, createContext } from "react";
import { AuthContext } from "./AuthContext";
import { signOut } from "../utils/supabase/auth_actions/signOutUser";



interface NavContextType {
    handleNav: (bool : boolean) => void,
    navbar: boolean,
}

interface NavProviderProps {
    children: React.ReactNode
}

export const NavContext = createContext<NavContextType | null>(null);


export const NavProvider : React.FC<NavProviderProps> = ({children}) => {
    const router = useRouter();
    const [navbar, setNavbar] = useState(false);
    
    const handleNav = (bool: boolean) => {
        setNavbar(bool);
    }
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1024)
                setNavbar(false);
        }

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return(
        <NavContext.Provider value={{handleNav, navbar}}>
            {children}
        </NavContext.Provider>
    )
}