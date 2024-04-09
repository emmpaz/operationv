'use server'

import { iCertificationDB } from "../../../../helpers/DatabaseTypes";
import { CertificationStatus, DBNames } from "../../../../helpers/Enums";
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

export const _getCompanyIdFromDB = async () => {
    const supabase = await createClient();

    const {data, error : userError} = await supabase.auth.getUser()
    
    if(userError){
        throw new Error(userError.message)
    }

    const {data : id, error} = await supabase
                            .from(DBNames.COMPANIES_DB)
                            .select()
                            .eq('name', data.user.user_metadata.company as string)
                            .eq('is_verified', true)
    
    if(!id){
        throw new Error('Company not found or not verified');
    }
    
    return {
        id: id[0].id.toString(),
        company: data.user.user_metadata.company
    }
}

export default async function _addNewCertificationDB(
    props : iCertificationDB,
    ){
    try{
            const supabase = await createClient();
        const {data, error : insertError} = await supabase
                            .from(DBNames.CERTIFICATIONS_DB)
                            .insert({
                                ...props,
                                created_at : new Date().toISOString(),
                            }).select()

        if(insertError){
            console.log(insertError);
            throw new Error(insertError.message);
        }
        if(data){
            return {
                bool : true,
                id: data[0].id as string
            }
        }
    }catch(e : any){
        console.log("error", e);
    }
    return {
        bool: false,
        id: null
    };
        
}

export const _getCompanyCertificationsFromDB = async () => {
    const supabase = await createClient();

    const c : string = (await supabase.auth.getUser()).data.user?.user_metadata.company;
    
    const {data, error} = await supabase
                    .from(DBNames.COMPANIES_DB)
                    .select(`
                        ${DBNames.CERTIFICATIONS_DB}(
                            *
                        )
                    `).eq('name', c);

    if(error){
        console.log(error.message)
        return []
    }
    if(!data){
        return []
    }
    //extraction all Certifications
    const list = data.map((cert: any) => cert.Certifications);
    return list;
}

export const _getCompanyApplicationsFromDB = async () => {
    const supabase = await createClient();
    const c : string = (await supabase.auth.getUser()).data.user?.user_metadata.company;

    const {data, error} = await supabase
                    .from(DBNames.CERTIFICATIONS_DB)
                    .select(`
                            *,
                            ${DBNames.PENDING_CERTIFICATIONS_DB}(
                                *,
                                ${DBNames.USERS_DB}(
                                    *
                                )
                            )
                    `)
                    .eq('company_name', c)
                    .match({
                        'PendingCertifications.status' : CertificationStatus.PENDING
                    });

    if(error){
        console.log(error.message);
        return [];
    }
    /**
     * List of certifications
     * Certification : {
     *        PendingCertifications: [
     *              {
     *                  Users : {}
     *                  data...
     *                  
     *              }
     *              ,
     *              {}
     *        ],
     *        data...
     * }
     * 
     */
    return data;
}

export const _getReviewCertificationsFromDB = async () => {
    const supabase = await createClient();

    const c : string = (await supabase.auth.getUser()).data.user?.user_metadata.company;

    const {data, error} = await supabase
                    .from(DBNames.CERTIFICATIONS_DB)
                    .select(`
                            *,
                            ${DBNames.PENDING_CERTIFICATIONS_DB}(
                                *,
                                ${DBNames.USERS_DB}(
                                    *
                                )
                            )
                    `)
                    .eq('company_name', c)
                    .match({
                        'PendingCertifications.status' : CertificationStatus.COMPLETION_REVIEW
                    });

    if(error){
        console.log(error.message);
        return [];
    }
    /**
     * List of certifications
     * Certification : {
     *        PendingCertifications: [
     *              {
     *                  Users : {}
     *                  data...
     *                  
     *              }
     *              ,
     *              {}
     *        ],
     *        data...
     * }
     * 
     */
    return data;
}

export const _distributeCertificationToUser = async (
    userID: string, 
    certificationID: string, 
    pendingCertificationID: string
    ) => {
        const supabase = await createClient();

    const {error: insertError} = await supabase
                .from(DBNames.USER_CERTIFICATIONS_DB)
                .insert({
                    certification_id: certificationID,
                    id: userID,
                    created_at : new Date().toISOString()
                });
    
    if(insertError){
        console.error(insertError.message);
        return false;
    }

    const {error: deleteError} = await supabase
                .from(DBNames.PENDING_CERTIFICATIONS_DB)
                .delete()
                .eq('id', pendingCertificationID);
    
    if(deleteError){
        console.log(deleteError.message);
        return false;
    }

    return true;

}

export const _acceptApplication = async (pendingCert_ID : string) => {
    const supabase = await createClient();

        const {data: updateData, error: updateError} = await supabase
                            .from(DBNames.PENDING_CERTIFICATIONS_DB)
                            .update({
                                approved_at: new Date().toISOString(),
                                status: CertificationStatus.APPROVED,
                            })
                            .eq('id', pendingCert_ID);

        if(updateError){
            console.error("failed to update pending certification");
            return;
        }
}

export const _declineApplication = async (pendingCert_ID : string, decline_message : string) => {
    const supabase = await createClient();

    const {data, error} = await supabase
                        .from(DBNames.PENDING_CERTIFICATIONS_DB)
                        .update({
                            status: CertificationStatus.DENIED,
                            denied_reason: decline_message
                        })
                        .eq('id', pendingCert_ID);

    
}

export const _getReviewHourLogs = async () => {
    const supabase = await createClient();

    const {data, error} = await supabase
                        .from(DBNames.HOURS_LOGGING_DB)
                        .select(`
                                *,
                                ${DBNames.PENDING_CERTIFICATIONS_DB}(
                                    *,
                                    ${DBNames.USERS_DB}(
                                        *
                                    ),
                                    ${DBNames.CERTIFICATIONS_DB}(
                                        *
                                    )
                                )
                        `)
                        .match({
                            'PendingCertifications.Certifications.company_name' : (await supabase.auth.getUser()).data.user?.user_metadata.company as string
                        })
                        .eq('review_hours', true)
                        .order('date_logged', {ascending: true})
    if(error){
        console.error(error.message)
        return []
    }
    return data;
}

export const _acceptLoggedHours = async (
    loggingID: string, 
    hoursLogged: number, 
    pendingID: string
    ) => {
        const supabase = await createClient();

    const { data: pendingData, error: pendingError } = await supabase
                        .from(DBNames.PENDING_CERTIFICATIONS_DB)
                        .select('hours_completed')
                        .eq('id', pendingID);
                
    if(pendingError){
        console.error(pendingError.message);
        return false;
    }

    const currentCompleted = pendingData[0].hours_completed ?? 0;

    const {data: updateData, error: updateError} = await supabase
                        .from(DBNames.PENDING_CERTIFICATIONS_DB)
                        .update({
                            hours_completed: currentCompleted + hoursLogged
                        })
                        .eq('id', pendingID)

    if(updateError){
        console.log(updateError);
        return false;
    }

    const {data, error} = await supabase
                        .from(DBNames.HOURS_LOGGING_DB)
                        .update({
                            review_hours: false
                        })
                        .eq('id', loggingID);

    if(error){
        console.log(error.message);
        return false
    }

    return true;
}