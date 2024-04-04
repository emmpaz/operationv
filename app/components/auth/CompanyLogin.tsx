'use client'

import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { _getCompaniesFromDB } from "../../utils/supabase/db_calls/actions";
import { adminSignIn } from "../../utils/supabase/user_handling/signInAdmin";
import { adminSignUp } from "../../utils/supabase/user_handling/signUpAdmin";
import Link from "next/link";

interface iCompanyDB {
    name: string,
    description: string,
    is_verified: boolean
}

export const CompanyLogin = (props: {resetChoiceHandler: () => void}) => {

    const { user, userHandler } = useContext(AuthContext)!;
    const router = useRouter();

    const [signUp, setSignUp] = useState(false);

    const dropdownRef = useRef<HTMLUListElement>(null);
    const [search_company, setSearch_company] = useState<string>("");

    const company = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirm_passwordRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        const fetchCompanies = async () => {
            const list = await _getCompaniesFromDB().then((res) => {
                return res.map((com: iCompanyDB) => ({
                    name: com.name,
                    description: com.description,
                    is_verified: com.is_verified
                }))
            })
            setCompanyList(list);
        }
        fetchCompanies();
    }, [])

    const [companyList, setCompanyList] = useState<iCompanyDB[]>([])

    const handleCompanyChoice = (com: string) => {
        setSearch_company(com);
        if (company.current)
            company.current.value = com;
        dropdownRef.current?.blur();
    }

    const handleSignIn = async (e: any) => {
        e.preventDefault();
        if (emailRef.current && passwordRef.current) {
            const email = emailRef.current.value;
            const password = passwordRef.current.value;
            if (email === "" || password === "")
                return
            const { bool, admin } = await adminSignIn(email, password);

            if (bool) {
                userHandler(admin);
                if (localStorage.getItem('company'))
                    localStorage.removeItem('company');
                if (localStorage.getItem('name'))
                    localStorage.removeItem('name');

                emailRef!.current!.value = "";
                passwordRef!.current!.value = ""
                router.push('/dashboard');
            }
        }
    }


    const handleSignUp = async (e: any) => {
        e.preventDefault();
        if (emailRef.current && passwordRef.current && confirm_passwordRef.current) {
            const email = emailRef.current.value;
            const password = passwordRef.current.value;
            const cPassword = confirm_passwordRef.current.value;
            if (email === "" || password === "" || cPassword === "") {
                return
            }
            if (password !== cPassword) {
                return
            }

            const response = await adminSignUp({ email: email, password: password});

            if (response) {
                localStorage.setItem('name', "");
                localStorage.setItem('company', search_company ?? "");
                emailRef!.current!.value = "";
                passwordRef!.current!.value = ""
            }
        }
    }

    if (!signUp) {
        return (
            <div
                className="h-screen flex justify-center items-center"

            >
                <div className="w-full max-w-sm">
                    <button
                        onClick={props.resetChoiceHandler}
                        className="btn btn-ghost font-medium mb-4 bg-transparent text-primary rounded btn-sm"
                    >Go back</button>
                    <h1 className="mb-4 text-4xl text-base-100">Welcome back</h1>
                    <form className="mb-4" onSubmit={handleSignIn}>
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-bold text-gray-700">
                                Email
                            </label>
                            <input
                                ref={emailRef}
                                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-primary focus:shadow-outline text-base-100"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-bold text-gray-700">
                                Password
                            </label>
                            <input
                                ref={passwordRef}
                                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-primary focus:shadow-outline text-base-100"
                                type="password"
                            />
                        </div>
                        <div className="flex justify-between">
                            <button
                                type="submit"
                                className="btn btn-primary font-medium text-base-100 rounded hover:bg-primary hover:-translate-y-0.5 hover:shadow-lg hover:shadow-secondary border-none"
                            >
                                Login
                            </button>
                            <button
                                className="btn font-medium btn-link"
                                type="button"
                                onClick={() => setSignUp(true)}
                            >
                                New Admin? Register here
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        )
    }
    return (
        <div
            className="h-screen flex justify-center items-center"
        >
            <div className="w-full max-w-sm">
                <button
                    onClick={props.resetChoiceHandler}
                    className="btn btn-ghost font-medium mb-4 bg-transparent text-primary rounded btn-sm"
                >Go back</button>
                <h1 className="mb-4 text-4xl text-base-100">Hey there! </h1>
                <form className="mb-4">
                    <div className="mb-4">
                        <label
                            className="block mb-2 text-sm font-bold text-gray-700"
                        >Company</label>
                        <div className="dropdown w-full">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-primary focus:shadow-outline text-base-100"
                                    placeholder="Search for a company"
                                    ref={company}
                                />
                            </div>
                            <ul
                                tabIndex={0}
                                id="companies-list"
                                className="dropdown-content bg-neutral z-[1] p-2 menu rounded shadow w-full mt-2 h-40"
                                ref={dropdownRef}
                            >
                                {companyList.map((com, i) => {
                                    return (
                                        <li
                                            key={i}
                                            onClick={() => handleCompanyChoice(com.name)}
                                            className=""
                                        ><a className="text-primary">{com.name}</a></li>
                                    )
                                })}
                            </ul>
                        </div>
                        <Link
                                href="/register"
                                className="font-medium btn-link text-sm"
                            >
                                Can't find your company? Register here!
                            </Link>
                    </div>
                    <div className="mb-4">
                        <label
                            className="block mb-2 text-sm font-bold text-gray-700"
                        >Email</label>
                        <input
                            className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-primary focus:shadow-outline text-base-100"
                            ref={emailRef}
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block mb-2 text-sm font-bold text-gray-700"
                        >Password</label>
                        <input
                            className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-primary focus:shadow-outline text-base-100"
                            ref={passwordRef}
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block mb-2 text-sm font-bold text-gray-700"
                        >Confirm Password</label>
                        <input
                            className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-primary focus:shadow-outline text-base-100"
                            ref={confirm_passwordRef}
                        />
                    </div>
                    <div className="flex justify-between">
                        <button
                            className="btn btn-primary font-medium text-base-100 rounded hover:bg-primary hover:-translate-y-0.5 hover:shadow-lg hover:shadow-secondary border-none"
                            onClick={handleSignUp}
                        >
                            Sign Up
                        </button>
                        <div className="flex flex-col">
                            <button
                                className="btn font-medium btn-link"
                                onClick={() => setSignUp(false)}
                            >
                                Already have an account?
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )

}