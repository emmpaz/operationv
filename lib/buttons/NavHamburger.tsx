import { useContext } from "react";
import { NavContext } from "../../app/context/NavContext";






export const NavHamburger = () => {
    const { handleNav } = useContext(NavContext)!;
    
    return (
        <div className="flex-none lg:hidden p-2">
            <button
                className="btn btn-square btn-ghost hover:text-primary"
                onClick={() => handleNav(true)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>
        </div>
    )
}