'use server'
import { iHoursLoggingDB, iPendingCertificationDB } from "../../../../helpers/DatabaseTypes";
import { CertificationStatus, DBNames } from "../../../../helpers/Enums";

import { createClient } from "../server";

/**
 * Get the certifications obtained by volunteer
 * @param userID 
 * @returns certifications list
 */
export const _getUserCertificationFromDB = async (userID : string) => {
    const supabase = await createClient();

    const {data: UserCerts, error} = await supabase
                    .from(DBNames.USERS_DB)
                    .select(`
                        *,
                        Certifications(
                            *
                        )
                    `)
                    .eq('id', userID)
    
    if(UserCerts?.length == 0){
        return []
    }
    if(error)
        return []
    
    return UserCerts[0].Certifications
}

export const _applyToCertificationDB = async (
    certification_id : string, 
    user_id : string, 
    hours_required : number
    ) => {
        const supabase = await createClient();

    const {data, error} = await supabase
                        .from(DBNames.PENDING_CERTIFICATIONS_DB)
                        .insert<iPendingCertificationDB>({
                            requested_at: new Date().toISOString(),
                            certification_id: certification_id,
                            user_id: user_id,
                            status: CertificationStatus.PENDING,
                            hours_completed: 0,
                            hours_required: hours_required
                        })

    if(error){
        console.log(error.message)
        return false
    }

    return true
}

export const _getPendingCertificationsDB = async (userID : string) => {
    const supabase = await createClient();

    const {data, error} = await supabase
                    .from(DBNames.PENDING_CERTIFICATIONS_DB)
                    .select(`
                        ${DBNames.CERTIFICATIONS_DB}(
                            *
                        )
                    `)
                    .match({
                        'status' : CertificationStatus.PENDING
                    })
                    .eq('user_id', userID)

    if(error){
        console.log(error.message);
        return []
    }
    if(!data){
        return []
    }
    const list = data.map((cert: any) => cert.Certifications)
    return list;
}

export const _checkMaxApplications = async (userID: string ) => {
    const supabase = await createClient();

    const {data, error} = await supabase
                    .from(DBNames.PENDING_CERTIFICATIONS_DB)
                    .select(`
                        ${DBNames.CERTIFICATIONS_DB}(
                            *
                        )
                    `)
                    .match({
                        'status' : CertificationStatus.PENDING
                    })
                    .eq('user_id', userID)

    if(error){
        console.log(error.message);
        return true;
    }
    if(!data) return true;

    return data.length >= 5;
}

export const _getApprovedCertificationsDB = async (userID: string) => {
    const supabase = await createClient();

        const {data, error} = await supabase
                    .from(DBNames.PENDING_CERTIFICATIONS_DB)
                    .select(`
                        *,
                        ${DBNames.CERTIFICATIONS_DB}(
                            *
                        ),
                        ${DBNames.HOURS_LOGGING_DB}(
                            *
                        )
                    `)
                    .match({
                        'status' : CertificationStatus.APPROVED
                    })
                    .eq('user_id', userID);
    if(error){
        console.log(error.message);
        return [];
    }
    if(!data) 
        return [];

    const list = data.map((pendingCert: any) => {
        const reviewNeeded : boolean = pendingCert.HoursLogging.some((entry : iHoursLoggingDB) => entry.review_hours);
        return {
            ...pendingCert,
            reviewNeeded: reviewNeeded
        }
    })
    return list;
}

export const _addNewHourLog = async (
    description: string, 
    hours: number, 
    pendingCert_ID: string
    ) => {
        const supabase = await createClient();

    const {data, error} = await supabase
                        .from(DBNames.HOURS_LOGGING_DB)
                        .insert({
                            description: description,
                            hours_logged: hours,
                            review_hours: true,
                            date_logged: new Date().toISOString(),
                            pending_certification_id: pendingCert_ID
                        })

    if(error){
        console.error(error.message);
        return false;
    }
    return true;
}   

