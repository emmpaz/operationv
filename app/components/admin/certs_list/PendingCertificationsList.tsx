import { useEffect, useState } from "react"
import { _getCompanyApplicationsFromDB } from "../../../../utils/supabase/db_calls/API_calls";
import { iUserDB } from "../../../../helpers/DatabaseTypes";
import { CertificationStatus } from "../../../../helpers/Enums";
import AdminCertification from "../certification_models/AdminCertification";
import DeclineModel from "../models/DeclineModel";
import { ModelComponent, ApplicationModelProps, useModel } from "../../../../helpers/CustomModels";
import { useQuery } from "react-query";


interface iPendingCertificationAdminDB {
    id: string,
    certification_id: string,
    user_id: string,
    approved_at: string | null,
    requested_at: string,
    denied_reason: string | null,
    hours_completed: number,
    hours_required: number,
    status: CertificationStatus,
    Users: iUserDB
}

interface iCertificationWithPendingCertsDB {
    id: string,
    name: string,
    description: string,
    hours: number,
    company_id: string
    created_at: string
    company_name: string
    PendingCertifications: iPendingCertificationAdminDB[]
}

const PendingCertificationsList = (

) => {

    const [pendingCerts, setPendingCerts] = useState<iCertificationWithPendingCertsDB[]>([]);

    const {data, isLoading} = useQuery('pendingList', () =>  _getCompanyApplicationsFromDB());

    const { showModel, isOpen, ModelComponent, modelProps, setIsOpen } = useModel<ApplicationModelProps>();

    const handleModel = (
        model: ModelComponent<ApplicationModelProps>,
        props : ApplicationModelProps
    ) => {
        showModel(model, {
            ...props,
            handleOpen: setIsOpen
        }
        )
    }

    useEffect(() => {
        if(data){
            setPendingCerts(data);
        }
    }, [])


    return (
        isLoading ?
            <div className="w-full h-full flex items-center justify-center">
                <span className="loading loading-dots loading-lg bg-primary"></span>
            </div>
            :
            
            <div className="self-center max-w-screen-xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isOpen && ModelComponent && <ModelComponent {...modelProps as ApplicationModelProps} />}
                {
                    pendingCerts.map((cert: iCertificationWithPendingCertsDB) => {
                        return (
                            cert.PendingCertifications.map((pc: iPendingCertificationAdminDB, i) => {
                                return (
                                    <AdminCertification
                                        key={i}
                                        pendingID={pc.id}
                                        cert_name={cert.name}
                                        user_id={pc.Users.id as string}
                                        user_name={pc.Users.name}
                                        user_email={pc.Users.email}
                                        requested_at={pc.requested_at}
                                        company_name={cert.company_name}
                                        handleApplication={handleModel}
                                    />
                                )
                            })
                        )
                    })
                }
            </div>
    )

}

export default PendingCertificationsList;