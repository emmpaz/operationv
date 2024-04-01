import { useEffect, useState } from "react";
import { _getReviewHourLogs } from "../../../utils/supabase/db_calls/actions";
import { iCertificationDB, iHoursLoggingDB, iPendingCertificationDB, iUserDB } from "../../../../helpers/DatabaseTypes";
import { ModelComponent, ReviewHoursModelProps, useModel } from "../../../../helpers/CustomModels";
import ReviewLogModel from "../models/ReviewLogModel";
import { useQuery } from "react-query";

interface FlattenedHoursLogged extends iHoursLoggingDB {
    PendingCertifications: FlattenedPendingCert,
    HoursLogging: iHoursLoggingDB | undefined
}

interface FlattenedPendingCert extends iPendingCertificationDB {
    Certifications: iCertificationDB,
    Users: iUserDB | undefined
}

const ReviewHoursList = () => {

    const { data, isLoading, refetch } = useQuery('reviewList', () => _getReviewHourLogs());

    const { showModel, isOpen, ModelComponent, modelProps, setIsOpen } = useModel<ReviewHoursModelProps>();

    const handleRefetch = () => {
        refetch();
    }

    const handleReview = (props : ReviewHoursModelProps) => {
        showModel(
            ReviewLogModel,
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
                {isOpen && ModelComponent && <ModelComponent {...modelProps as ReviewHoursModelProps} />}
                {(data.length > 0) ?
                    data.map((hourLogged: FlattenedHoursLogged, i) => {
                        return (
                            <div key={i} className="px-5 py-2 flex justify-between hover:bg-accent cursor-pointer"
                                onClick={() => handleReview(
                                    {
                                        reviewee_user_name: hourLogged.PendingCertifications.Users?.name as string,
                                        reviewee_email: hourLogged.PendingCertifications.Users?.email as string,
                                        reviewee_pendingCert_id: hourLogged.pending_certification_id,
                                        reviewee_log_id: hourLogged.id as string,
                                        reviewee_hours_logged: hourLogged.hours_logged
                                    }
                                )}>
                                <div className="flex justify-end flex-col">
                                    <p className="text-base-100 text-3xl">{hourLogged.PendingCertifications.Users?.name}</p>
                                    <p className="text-base-100">{hourLogged.PendingCertifications.Certifications.name}</p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <p className="mb-3">{hourLogged.date_logged?.slice(0, 10)}</p>
                                    <p>
                                        <span className="text-5xl text-primary mr-1">{hourLogged.hours_logged}</span>
                                        <span className="text-base-100">hours</span>
                                    </p>
                                </div>
                            </div>
                        )
                    }) 
                    :
                    <div className="h-full flex justify-center items-center">
                        <p>Currently there are no reviews needed :)</p>
                    </div>
                }
            </div>
    )
}


export default ReviewHoursList;