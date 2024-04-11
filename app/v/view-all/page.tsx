'use client'

import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useQuery } from "react-query";
import { _checkMaxApplications } from "../../utils/supabase/actions/volunteer.actions";
import { iCertificationDB } from "../../../helpers/DatabaseTypes";
import { fetchAllCerts } from "../../utils/queries/queries";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import Certification from "../../components/common/certification";



export default function Page() {
    const { user } = useContext(AuthContext)!;

    const {
        data: maxApplications,
        isLoading: LoadingMaxApplications,
        refetch: maxApp_refetch } = useQuery<boolean>(
            'maxApplications',
            () => _checkMaxApplications(user.id));

    const {
        data: availableCerts,
        isLoading: LoadingAvailableCerts,
        refetch: available_refetch } = useQuery<iCertificationDB[]>(
            'availableCerts',
            () => fetchAllCerts(user.id),
            { enabled: !LoadingMaxApplications });

    const revalidate = () => {
        maxApp_refetch();
        available_refetch();
    }

    return (
        <div className="w-full flex p-1">
            <div className=" m-1 w-full flex flex-col items-center p-2">
                <div className="w-fit flex flex-col">
                    <h2 className="text-base-100 text-xl py-5">Find Opportunities</h2>
                    <div className="self-center max-w-screen-xl w-full grid grid-cols-2 md:grid-cols-3 gap-4">
                        {LoadingMaxApplications || LoadingAvailableCerts ?
                            <LoadingSpinner />
                            :
                            availableCerts.map((cert: iCertificationDB, i) => {
                                return (
                                    <Certification
                                        key={i}
                                        certID={cert.id}
                                        userID={user?.id as string}
                                        hours={cert.hours}
                                        name={cert.name}
                                        company_name={cert.company_name}
                                        apply={true}
                                        maxApplied={maxApplications}
                                        onApply={revalidate}
                                        admin={false}
                                    ></Certification>
                                )
                            })}
                    </div>
                </div>
            </div>
        </div>
    )
}