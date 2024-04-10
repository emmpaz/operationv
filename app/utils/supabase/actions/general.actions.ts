'use server'
import { iCertificationDB, iHoursLoggingDB, iPendingCertificationDB, iUserDB } from "../../../../helpers/DatabaseTypes";
import { CertificationStatus, DBNames } from "../../../../helpers/Enums";

import { createClient } from "../server";

export const _getUserFromDB = async (userID : string) => {

    const supabase = await createClient();

    const { data } = await supabase
                    .from(DBNames.USERS_DB)
                    .select()
                    .eq('uuid', userID);
    
    if(data?.length){
        return data[0]
    }
    
    return null
}

export const _addUserRoleAndDB = async (id : string, email: string) => {
    const supabase = await createClient();

    //check if user is in the database
    const { data: user } = await supabase
        .from(DBNames.USERS_DB)
        .select('*')
        .eq('email', email);

    if (!user?.length) {
        await supabase.auth.updateUser({
            data: {
                role: 'volunteer'
            }
        })

        const { error: insertError } = await supabase.from(DBNames.USERS_DB).insert<iUserDB>({
            uuid: id,
            name: localStorage.getItem('name')?.toString() as string ?? "",
            email: email,
            created_at: new Date().toISOString()
        })

        if (insertError) {
            console.log(insertError.message);
            return false;
        }
    }
}

export const _getAdminFromDB = async (userID : string) => {
    const supabase = await createClient();

    const { data } = await supabase
                    .from(DBNames.USERS_DB)
                    .select()
                    .eq('uuid', userID)
    if(data?.length){
        return data[0]
    }
    return null

}

export const _addAdminRoleAndDB = async (email: string, id : string) => {
    const supabase = await createClient();

    //check if user is in the database
    const { data: user } = await supabase
        .from(DBNames.USERS_DB)
        .select('*')
        .eq('email', email);

    if (!user?.length) {
        await supabase.auth.updateUser({
            data: {
                role: 'admin',
                company : localStorage.getItem('company') as string ?? ""
            }
        })

        const { error: insertError } = await supabase.from(DBNames.USERS_DB).insert<iUserDB>({
            uuid: id,
            name: localStorage.getItem('name')?.toString() as string ?? "",
            email: email,
            created_at: new Date().toISOString()
        })

        if (insertError) {
            console.log(insertError.message);
            return false;
        }
    }
}


export const _getCertificationsFromDB = async(userID: string) => {
    const supabase = await createClient();

    const {data: certs, error} = await supabase
                    .from(DBNames.CERTIFICATIONS_DB)
                    .select(`
                        *,
                        ${DBNames.USER_CERTIFICATIONS_DB}(
                            *
                        )
                    `);

    const {data: CertsPending, error: PendingError} = await supabase
                                        .from(DBNames.PENDING_CERTIFICATIONS_DB)
                                        .select(`
                                            *
                                        `).eq('user_id', userID);

    if(PendingError){
        console.log(PendingError.message);
    }
    if(certs?.length == 0){
        return []
    }
    if(error){
        console.log(error.message)
        return []
    }
    const CertsNotObtained = certs.filter((res) => {
        const hasCert = res.UserCertifications.some((uc: { id: string; }) => uc.id == userID);
        const PendingCert = CertsPending?.some((cp: {certification_id: string}) => cp.certification_id == res.id);

        return !hasCert && !PendingCert
    })

    return CertsNotObtained;
}

export const _getCompaniesFromDB = async () => {
    const supabase = await createClient();

    const {data : companies} = await supabase
                        .from(DBNames.COMPANIES_DB)
                        .select()
                        .eq('is_verified', true)

    if(!companies?.length){
        return []
    }

    return companies;
    
}