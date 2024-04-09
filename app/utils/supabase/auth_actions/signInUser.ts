'use server'
import { _addUserRoleAndDB, _getUserFromDB } from "../actions/general.actions";
import { createClient } from "../server";


const errorHandling = (func : string, mes : string) => {
    if(func === 'SIGNIN'){
        switch(mes){
            case 'Email not confirmed':
                return 'Please confirm email';
            case 'Invalid login credentials':
                return 'Incorrect email or password';
            case 'Too many requests':
                return 'Too many attempts, please try again later';
            default:
                return 'Unkown authentication error: ' + mes;
        }
    }
    if(func === "SIGNUP"){}
}

export const signInUser = async (
    email: string, 
    password: string) => {

    
    const supabase = await createClient();
    
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    })

    if(error){
        const error_mes : string = errorHandling('SIGNIN', error.message) as string;
        return {
            invalid_bool : true,
            mes : error_mes,
            user: null,
        };
    }

    //if user is not in User DB
    _addUserRoleAndDB(data.user.id, email);

    //set user state
    const user = await _getUserFromDB(data.user.id)

    return {
        invalid_bool : false, 
        mes: 'Success',
        user: {
            ...user,
            role: data.user.user_metadata.role}}
}