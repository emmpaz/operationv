'use server'
import { iCertificationDB, iHoursLoggingDB, iPendingCertificationDB, iUserDB } from "../../../../helpers/DatabaseTypes";
import { CertificationStatus, DBNames } from "../../../../helpers/Enums";


import { http_handleImageUpload } from "../../http_functions/functions";
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
        localStorage.removeItem('name');
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
                    .eq('user_id', userID);
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

