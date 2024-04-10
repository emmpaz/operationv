'use client'
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import image from './test.png';
import Link from "next/link";
import { signOut } from "../../utils/supabase/auth_actions/signOutUser";

export const NavBar = (
    props: {
        noUser?: boolean,
        open: boolean,
        handleNav?: (bool: boolean) => void
    }
) => {
    const router = useRouter();
    const { user, userHandler } = useContext(AuthContext)!;

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1024)
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
        <nav className="h-full">
            <div className="lg:w-72 lg:block bg-neutral rounded hidden h-full sitcky">
                {!props.noUser &&
                    <div className="flex flex-col justify-start h-full w-full">
                        <div className="flex items-center justify-center p-14">
                            <Image src={image} alt="logo" className="w-full"></Image>
                        </div>
                        <ul className="menu p-4 w-full">
                                    <li>
                                        <Link href="/v/pending-certifications">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                            Currently Pending
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/v/logging-hours">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            Log hours
                                        </Link>
                                    </li>
                                </ul>
                        <div className="flex-grow"></div>
                        <div className="p-4 w-full flex flex-col">
                            <button className="btn btn-ghost mb-1 rounded text-primary border-outline border-primary">Profile</button>
                            <button
                                className="btn btn-primary mb-1 rounded hover:bg-primary hover:-translate-y-0.5 hover:shadow-lg hover:shadow-secondary border-none"
                                onClick={() => signOutHandler()}
                            >Logout</button>
                        </div>
                    </div>
                }
                {props.noUser &&
                    <div className="flex flex-col justify-start h-full w-full">
                        <div className="flex items-center justify-center p-4">
                            <img src="/path/to/logo.png" alt="Logo" className="h-10 w-10 mr-2" />
                            <span className="text-xl font-bold">Volunteer Portal</span>
                        </div>
                        <ul className="menu p-4 w-full">
                            <li>
                                <a href="/about">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    About
                                </a>
                            </li>
                            <li>
                                <a href="/contact">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    Contact
                                </a>
                            </li>
                        </ul>
                        <div className="flex-grow"></div>
                        <Link
                            className="btn btn-primary m-4 rounded hover:bg-primary hover:-translate-y-0.5 hover:shadow-lg hover:shadow-secondary border-none"
                            href="/"
                        >Sign in/Sign up</Link>
                    </div>
                }
            </div>
            {/*mobile nav bar below */}
            <div className={`lg:hidden top-0 fixed left-0 h-full w-full z-10 ${props.open ? 'visible opacity-1 fixed inset-0 ' : 'opacity-0 pointer-events-none'} overflow-hidden transition-all duration-300`}>
                <div className="flex h-full w-full">
                    <div className={`bg-neutral h-full opacity-100 w-72 ${props.open ? '' : 'w-0'} overflow-hidden trasition-all duration-300`}>
                        {!props.noUser &&
                            <div className="flex flex-col justify-start h-full w-full">
                                <div className="flex items-center justify-center p-14">
                            <Image src={image} alt="logo" className="w-full"></Image>
                        </div>
                                <ul className="menu p-4 w-full">
                                    <li>
                                        <Link href="/v/pending-certifications">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                            Currently Pending
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/v/logging-hours">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            Log hours
                                        </Link>
                                    </li>
                                </ul>
                                <div className="flex-grow"></div>
                                <div className="p-4 w-full flex flex-col">
                                    <button className="btn btn-ghost mb-1 rounded text-primary border-outline border-primary">Profile</button>
                                    <button
                                        className="btn btn-primary mt-1 rounded hover:bg-primary hover:-translate-y-0.5 hover:shadow-lg hover:shadow-secondary border-none"
                                        onClick={() => signOutHandler()}
                                    >Logout</button>
                                </div>
                            </div>
                        }
                        {props.noUser &&
                            <div className="flex flex-col justify-start h-full w-full">
                                <div className="flex items-center justify-center p-4">
                                    <img src="/path/to/logo.png" alt="Logo" className="h-10 w-10 mr-2" />
                                    <span className="text-xl font-bold">Volunteer Portal</span>
                                </div>
                                <ul className="menu p-4 w-full">
                                    <li>
                                        <a href="/about">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            About
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/contact">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                            Contact
                                        </a>
                                    </li>
                                </ul>
                                <div className="flex-grow"></div>
                                <Link
                                    className="btn btn-primary m-4 rounded hover:bg-primary hover:-translate-y-0.5 hover:shadow-lg hover:shadow-secondary border-none"
                                    href="/"
                                >Sign in/Sign up</Link>
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