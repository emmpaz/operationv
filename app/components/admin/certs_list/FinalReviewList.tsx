import { useQuery } from "react-query";
import { _getReviewCertificationsFromDB } from "../../../utils/supabase/db_calls/actions";
import { CertificationStatus } from "../../../../helpers/Enums";
import { iUserDB } from "../../../../helpers/DatabaseTypes";
import { useEffect, useState } from "react";
import { ApplicationModelProps, DistributionModelProps, ModelComponent, ReviewHoursModelProps, useModel } from "../../../../helpers/CustomModels";
import ReviewLogModel from "../models/ReviewLogModel";
import DistributeCertificationModel from "../models/DistributeCertificationModel";

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

const FinalReviewList = () => {

    const { data, isLoading, refetch } = useQuery('distributionList', () => _getReviewCertificationsFromDB());
    const [noReviews, setNoReviews] = useState(true);
    const { showModel, isOpen, ModelComponent, modelProps, setIsOpen } = useModel<DistributionModelProps>();

    const handleRefetch = () => {
        refetch();
    }

    const handleDistribution = (props : DistributionModelProps) => {
        showModel(DistributeCertificationModel,
            {
                ...props,
                handleOpen: setIsOpen,
                handleRefetch
            }
        )
    }
    

    return (
        isLoading ?
            <div className="w-full h-full flex items-center justify-center">
                <span className="loading loading-dots loading-lg bg-primary"></span>
            </div>
            :

            <div className="h-full divide-y">
                {isOpen && ModelComponent && <ModelComponent {...modelProps as DistributionModelProps} />}
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
                                            <p className="text-base-100 text-3xl">{pc.Users.name}</p>
                                            <p className="text-base-100">{pc.Users.email}</p>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <p>
                                                <span className="text-lg text-primary mr-1">{cert.name}</span>
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