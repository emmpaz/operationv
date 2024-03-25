'use server';

import { iUserDB } from "../../../../helpers/DatabaseTypes";
import { _addUserRoleAndDB, _getUserFromDB } from "../db_calls/actions";
import { createClient } from "../server";

export const findUserSession = async (): Promise<iUserDB | null> => {
    const supabase =  await createClient();
    const { data : user, error: getError } = await supabase.auth.getUser();

    if(getError){
        return null;
    }
    const { data, error } = await supabase.from('Users').select().eq('uuid', user.user.id);
    if (error) {
        console.log("error in getting user from db: " + error);
    }

    if (data.length) {
        const userData = data[0];
        return {
            ...userData,
            role: user.user.user_metadata.role
        };
    }
    else{
        return null;
    }

}