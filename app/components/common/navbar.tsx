'use client'
import { useRouter } from "next/navigation"
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { signOut } from "../../utils/supabase/user_handling/signOutUser";



export const NavBar = (
    props: {
        noUser?: boolean,
        open: boolean,
        handleNav?: (bool : boolean) => void
    }
) => {
    const router = useRouter();
    const {user, userHandler} = useContext(AuthContext)!;

    useEffect(() => {
        const handleResize = () => {
            if(window.innerWidth > 1024) 
                props.handleNav!(false);
        }

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const signOutHandler = () => {
        signOut();
        userHandler(null);
    }

    return (
        <nav className="min-h-full">
            <div className="lg:w-72 lg:block bg-neutral rounded hidden h-full">
                {!props.noUser &&
                    <div className="flex flex-col justify-start h-full w-full">
                        <button
                            className="btn w-20 btn-primary m-2 rounded"
                            onClick={() => signOutHandler()}
                        >Logout</button>
                        {user?.role == 'volunteer' && <button
                            className="btn w-20 btn-primary m-2 rounded"
                            onClick={() => router.push(`/user/${user?.uuid}`)}
                        >Profile</button>}
                    </div>
                }
                {props.noUser &&
                    <div className="flex flex-col justify-start h-full w-full">
                        <button
                            className="btn btn-primary m-2 rounded"
                            onClick={() => router.push('/')}
                        >Sign in/Sign up</button>
                    </div>
                }
                <div>
                    <svg className="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
            </div>
            {/*mobile nav bar below */}
            <div className={`lg:hidden top-0 fixed left-0 h-full w-full z-10 ${props.open ? 'visible opacity-1 fixed inset-0 ' : 'opacity-0 pointer-events-none'} overflow-hidden transition-all duration-300`}>
                <div className="flex h-full w-full">
                    <div className={`bg-neutral h-full opacity-100 w-72 ${props.open ? '' : 'w-0'} overflow-hidden trasition-all duration-300`}>
                        {!props.noUser &&
                            <div className="flex flex-col justify-start h-full w-full">
                                <button
                                    className="btn w-20 btn-primary m-2 rounded"
                                    onClick={() => signOutHandler()}
                                >Logout</button>
                                <button
                                    className="btn w-20 btn-primary m-2 rounded"
                                    onClick={() => router.push(`/user/${user?.uuid}`)}
                                >Profile</button>
                            </div>
                        }
                        {props.noUser &&
                            <div className="flex flex-col justify-start h-full w-full">
                                <button
                                    className="btn btn-primary m-2 rounded"
                                    onClick={() => router.push('/')}
                                >Sign in/Sign up</button>
                            </div>
                        }
                    </div>
                    <div className={`w-full opacity-70 ${props.open ? 'bg-gray-700' : 'bg-opacity-0'} transition-all duration-300`}>
                        <div className="flex-none">
                            <button
                                className="btn btn-square btn-ghost"
                                onClick={() => props.handleNav!(false)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-10 h-10 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 L18 6 M6 6 l12 12"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}