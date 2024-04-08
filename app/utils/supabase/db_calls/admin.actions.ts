'use server'

import { DBNames } from "../../../../helpers/Enums";
import { createClient } from "../server";

export const _createNewCompany = async (
    name: string, 
    descriptions: string, 
    volunteer_work: string,
    email: string, 
    token : string) => {
    /**
     * need to convert json object to json string
     */
    let res: Response;
    try{
        res = await fetch('http://localhost:3000/api/recaptcha', {
            method: 'POST',
            body: JSON.stringify({"token": token}),
            headers: {
                Accept: 'application/json, text/plain, */*',
                "Content-Type": "application/json",
            }
        });
    }catch(e: any){
        console.error(e);
        return {
            mes: e,
            bool: false
        };
    }

    const {success, message} = await res.json();

    if(!success) return {
        bool: false,
        mes: message
    };

    const supabase = await createClient();

    const {data, error} = await supabase
                        .from(DBNames.COMPANIES_DB)
                        .insert({
                            name,
                            descriptions,
                            volunteer_work,
                            is_verified : false,
                            email
                        })

    if(error){
        console.error(error.message);
        return {
            mes: error.message,
            bool: false,
        };
    }
    return {
        mes: 'Company was sent to the registrar! You should receive an email once you company was approved!',
        bool: true,    
    };
}