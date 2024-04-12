import { CertificationStatus } from "./Enums"

export interface iUserDB {
    id? : string
    uuid : string,
    created_at? : string,
    name: string,
    email : string
    role: string,
    completed_onboarding?: boolean,
    
}

export interface iCertificationDB {
    id? : string,
    name: string,
    description : string,
    hours: number,
    company_id: string
    created_at?: string
    company_name: string
}

export interface iPendingCertificationDB{
    id? : string,
    requested_at: string,
    approved_at?: string,
    certification_id: string,
    user_id: string,
    status: CertificationStatus,
    denied_reason?: string,
    hours_completed: number,
    hours_required: number
}

export interface iHoursLoggingDB{
    id?: string,
    date_logged: string | null,
    hours_logged: number,
    description: string,
    pending_certification_id: string,
    review_hours: boolean
}