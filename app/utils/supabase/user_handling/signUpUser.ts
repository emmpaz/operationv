'use server'

import { createClient } from "../client";

interface SignUpData {
    name?: string;
    email: string;
    password: string;
    company?: string;
}

export const signUpUser = async ({ name, email, password }: SignUpData) => {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
    })
    if (error) {
        console.log("error in signing up volunteer : " + error.message);
        return false;
    }
    if (data) {
        return true;
    }
}