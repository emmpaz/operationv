
import { _getCompanyApplicationsFromDB } from "../../../utils/supabase/db_calls/actions";
import { iUserDB } from "../../../../helpers/DatabaseTypes";
import { CertificationStatus } from "../../../../helpers/Enums";
import AdminCertification from "../certification_models/AdminCertification";
import { ModelComponent, ApplicationModelProps, useModel } from "../../../../helpers/CustomModels";
import { useQuery } from "react-query";
import { LoadingSpinner } from "../../common/LoadingSpinner";


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
/**
 * this is the list of certifications that displays all the
 * applications
 * @returns the list of certifications that applicants applied for
 */
const PendingCertificationsList = () => {

    const {data, isLoading, refetch} = useQuery<iCertificationWithPendingCertsDB[]>('pendingList', () =>  _getCompanyApplicationsFromDB());

    const { showModel, isVisible, ModelComponent, modelProps, handleVisibility } = useModel<ApplicationModelProps>();

    const handleRefetch = () =>{
        refetch();
    }

    const handleModel = (
        model: ModelComponent<ApplicationModelProps>,
        props : ApplicationModelProps
    ) => {
        showModel(model, {
            ...props,
            handleOpen: handleVisibility,
            handleRefetch
        }
        )
    }


    return (
        isLoading ?
            <LoadingSpinner/>
            :
            
            <div className="self-center max-w-screen-xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isVisible && ModelComponent && <ModelComponent {...modelProps as ApplicationModelProps} />}
                { data.length > 0 ?
                    data.map((cert: iCertificationWithPendingCertsDB) => {
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
                    :
                    <div className="h-full flex justify-center items-center">
                        <p>Currently there are no applications :)</p>
                    </div>
                }
            </div>
    )

}

export default PendingCertificationsList;