'use server'
import { _addAdminRoleAndDB, _getAdminFromDB } from "../actions/general.actions";
import { createClient } from "../server";

export const adminSignIn = async (email: string, password: string) => {
    const supabase = await createClient();
    const {data, error} = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    })
    if(error){
        console.error("Failed sign in:", error.message);
        return {
            bool: false,
            admin: null,
        };
    }
    _addAdminRoleAndDB(email, data.user.id);

    const admin = await _getAdminFromDB(data.user.id);
    
    return {
        bool: true,
        admin: {
            ...admin
        }
    }
}