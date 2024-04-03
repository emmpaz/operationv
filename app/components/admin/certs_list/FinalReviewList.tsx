import { useQuery } from "react-query";
import { _getReviewCertificationsFromDB } from "../../../utils/supabase/db_calls/actions";
import { CertificationStatus } from "../../../../helpers/Enums";
import { iUserDB } from "../../../../helpers/DatabaseTypes";
import { useState } from "react";
import { DistributionModelProps, useModel } from "../../../../helpers/CustomModels";
import DistributeCertificationModel from "../models/DistributeCertificationModel";
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
 * this list is displaying certifications that are ready to be distributed
 * to the volunteers that have completed the required hours.
 * @returns 
 */
const FinalReviewList = () => {

    const { data, isLoading, refetch } = useQuery<iCertificationWithPendingCertsDB[]>('distributionList', () => _getReviewCertificationsFromDB());
    const [noReviews, setNoReviews] = useState(true);
    
    const { 
        showModel, 
        isVisible, 
        ModelComponent, 
        modelProps, 
        handleVisibility } = useModel<DistributionModelProps>();

    const handleRefetch = () => {
        refetch();
    }

    const handleDistribution = (props : DistributionModelProps) => {
        showModel(DistributeCertificationModel,
            {
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

            <div className="h-full divide-y">
                {isVisible && ModelComponent && <ModelComponent {...modelProps as DistributionModelProps} />}
                {data?.map((cert: iCertificationWithPendingCertsDB) => {
                        return (
                            cert.PendingCertifications.map((pc: iPendingCertificationAdminDB, i) => {
                                if(noReviews)
                                    setNoReviews(false)
                                return (
                                    <div key={i} className="px-5 py-2 flex justify-between hover:bg-accent cursor-pointer"
                                        onClick={() => handleDistribution(
                                            {
                                                receiver_cert_ID: cert.id,
                                                receiver_cert_name: cert.name,
                                                receiver_name: pc.Users.name,
                                                receiver_pending_ID: pc.id,
                                                receiver_user_ID: pc.Users.id as string
                                            }
                                        )}>
                                        <div className="flex justify-end flex-col">
                                            <p className="text-base-100 text-3xl">{pc.Users?.name ?? 'Unknown name'}</p>
                                            <p className="text-base-100">{pc.Users?.email ?? 'Unknown email'}</p>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <p>
                                                <span className="text-lg text-primary mr-1">{cert.name ?? 'Unknown certification name'}</span>
                                            </p>
                                        </div>
                                    </div>
                                )
                            })
                        )
                    })
                }
               {noReviews &&
                <div className="h-full flex justify-center items-center">
                    <p>Currently there are no distributions needed :)</p>
                </div>}
            </div>
    )
}

export default FinalReviewList;