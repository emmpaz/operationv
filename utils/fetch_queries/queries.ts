'use server'
import { cache } from "react"
import { iCertificationDB } from "../../helpers/DatabaseTypes"
import { _getApprovedCertificationsDB, _getCertificationsFromDB, _getPendingCertificationsDB } from "../supabase/db_calls/API_calls"

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