'use server'
import { createClient } from "../server";

interface SignUpData {
    name?: string;
    email: string;
    password: string;
    company?: string;
}

export const adminSignUp = async ({email, password }: SignUpData) => {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
        email,
        password
    })
    if (error) {
        console.log("error signing up admin: " + error.message);
        return false
    }
    if(data){
        return true
    }

}