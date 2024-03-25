'use client'
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { signInUser } from "../../utils/supabase/user_handling/signInUser";
import { signUpUser } from "../../utils/supabase/user_handling/signUpUser";

type Error = {
    bool: boolean,
    mes: string
}

export const VolunteerLogin = (props: { resetChoiceHandler: () => void }) => {
    const { userHandler } = useContext(AuthContext)!;

    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const router = useRouter();

    const [signup, setSignup] = useState(false);
    const [confirmEmail, SetConfirmEmail] = useState(false);

    const [invalid, setInvalid] = useState<Error>({ bool: false, mes: "" });


    const handleSignIn = async (e: any) => {
        e.preventDefault();
        if (emailRef.current && passwordRef.current) {
            const email = emailRef.current.value;
            const password = passwordRef.current.value;
            if (email === "" || password === "")
                return

            setInvalid({ ...invalid, bool: false });

            const response = await signInUser(email, password);
            const {user, mes, invalid_bool} = response;
            userHandler(user);

            if (!invalid_bool) {
                if(localStorage.getItem('name'))
                    localStorage.removeItem('name');
                
                emailRef!.current!.value = "";
                passwordRef!.current!.value = ""
                router.push("/dashboard");
            }
            else {
                setInvalid({ bool: invalid_bool, mes: mes as string });
            }
        }
    }

    const handleSignUp = async (e: any) => {
        e.preventDefault();
        if (emailRef.current && passwordRef.current && nameRef.current) {
            const name = nameRef.current.value;
            const email = emailRef.current.value;
            const password = passwordRef.current.value;
            if (name === "" || email === "" || password === "")
                return

            const response = await signUpUser({name, email, password});
            if (response) {
                nameRef!.current!.value = "";
                emailRef!.current!.value = "";
                passwordRef!.current!.value = "";
                localStorage.setItem('name', name as string);
                setSignup(false);
                SetConfirmEmail(true);
            }
        }
    }
    if (!signup) {
        return (
            <div
                className="h-screen flex justify-center items-center"
            >
                <div className="w-full max-w-sm">
                    <button
                        onClick={props.resetChoiceHandler}
                        className="btn font-medium mb-4 bg-transparent border border-primary text-primary rounded hover:bg-primary hover:text-base-100 btn-sm"
                    >Go back</button>
                    <h1 className="mb-4 text-4xl text-base-100">Welcome back</h1>
                    <div className="flex w-full">
                        {
                            invalid.bool && <p className="text-error text-sm mb-4">{invalid.mes}</p>
                        }
                    </div>
                    <div className="flex w-full">
                        {confirmEmail && <p className="text-primary text-sm mb-4">Go confirm your email :)</p>}
                    </div>
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
                                className="btn font-medium rounded border-primary bg-primary hover:bg-primary text-base-100"
                            >
                                Login
                            </button>
                            <button
                                className="btn font-medium btn-link"
                                type="button"
                                onClick={() => setSignup(true)}
                            >
                                New User? Sign up
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
                    className="btn font-medium mb-4 bg-transparent border border-primary text-primary rounded hover:bg-primary hover:text-base-100 btn-sm"
                >Go back</button>
                <h1 className="mb-4 text-4xl text-base-100">Hello!</h1>
                <form className="mb-4">
                    <div className="mb-4">
                        <label
                            className="block mb-2 text-sm font-bold text-gray-700"
                        >Full name</label>
                        <input
                            className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-primary focus:shadow-outline"
                            ref={nameRef}
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block mb-2 text-sm font-bold text-gray-700"
                        >Email</label>
                        <input
                            className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-primary focus:shadow-outline"
                            ref={emailRef}
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block mb-2 text-sm font-bold text-gray-700"
                        >Password</label>
                        <input
                            className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-primary focus:shadow-outline"
                            ref={passwordRef}
                        />
                    </div>
                    <div className="flex justify-between">
                        <button
                            className="btn font-medium rounded border-primary bg-primary hover:bg-primary text-base-100"
                            onClick={handleSignUp}
                        >
                            Sign Up
                        </button>
                        <button
                            className="btn font-medium btn-link"
                            onClick={() => setSignup(false)}
                        >
                            Already have an account?
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}