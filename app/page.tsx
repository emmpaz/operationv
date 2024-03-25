'use client'

import { useContext, useEffect, useLayoutEffect, useState } from "react"
import { AuthContext } from "./context/AuthContext"
import { VolunteerLogin } from "./components/auth/VolunteerLogin";
import { CompanyLogin } from './components/auth/CompanyLogin';
import { redirect, useRouter } from "next/navigation";

export default function Page() {
    const { user } = useContext(AuthContext)!;
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const [choice, setChoice] = useState<string | null>(null);

    const resetChoiceHandler = () => setChoice(null);

    useEffect(() => {
        if (user) {
            router.push('/dashboard');
        }
        else
            setLoading(false);
    }, []);

    if (choice === "vol")
        return <VolunteerLogin resetChoiceHandler={resetChoiceHandler} />
    if (choice === "com")
        return <CompanyLogin resetChoiceHandler={resetChoiceHandler} />

    return (
        loading ?
            <div className="w-full h-screen flex items-center justify-center">
                <span className="loading loading-dots loading-lg bg-primary"></span>
            </div>
            :

            <div className=" w-screen h-screen flex items-center flex-col">
                <div>
                    <h1 className=" mt-10 text-primary">TrueImpact</h1>
                </div>
                <div className="container w-min flex-1 flex justify-center items-center">
                    <button
                        className="btn font-medium bg-primary text-base-100 m-4 btn-wide rounded hover:bg-primary hover:-translate-y-0.5 hover:shadow-lg hover:shadow-secondary border-none"
                        onClick={() => setChoice("vol")}
                    >
                        Volunteer
                    </button>
                    <button
                        className="btn font-medium bg-primary text-base-100 m-4 btn-wide rounded hover:bg-primary hover:-translate-y-0.5 hover:shadow-lg hover:shadow-secondary border-none"
                        onClick={() => setChoice("com")}
                    >
                        Company
                    </button>
                </div>
            </div>
    )
}