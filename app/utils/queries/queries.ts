'use server'

import { iCertificationDB } from "../../../helpers/DatabaseTypes"
import { _getCertificationsFromDB } from "../supabase/actions/general.actions"
import { _getApprovedCertificationsDB, _getPendingCertificationsDB } from "../supabase/actions/volunteer.actions"

export const fetchAllCerts = async (id : string) => {
    const list = await _getCertificationsFromDB(id)
    return list.map((cert: iCertificationDB) => ({
        id: cert.id, 
        name: cert.name, 
        description: cert.description, 
        hours: cert.hours, 
        company_name: cert.company_name, 
        company_id: cert.company_id 
    }))
}

export const fetchPendingCerts = async(id: string) => {
    const list = await _getPendingCertificationsDB(id);
    return list.map((cert: iCertificationDB) => ({
        id: cert.id, 
        name: cert.name, 
        description: cert.description, 
        hours: cert.hours, 
        company_name: cert.company_name, 
        company_id: cert.company_id
    }))
}

export const fetchApprovedCerts = async (id: string) => {
    const list = await _getApprovedCertificationsDB(id);
    return list;
}