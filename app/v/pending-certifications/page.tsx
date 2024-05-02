'use client'

import { useContext, useState } from "react";
import { iCertificationDB } from "../../../helpers/DatabaseTypes";
import { useQuery } from "react-query";
import { fetchPendingCerts } from "../../utils/queries/queries";
import { _checkMaxApplications } from "../../utils/supabase/actions/volunteer.actions";
import { AuthContext } from "../../context/AuthContext";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import Certification from "../../components/common/certification";
import { NavHamburger } from "../../../lib/buttons/NavHamburger";
import PageWrapper from "../../../lib/layouts/PageWrapper";
import PendingCertsSankey from "../../../lib/charts/PendingCertsSankey";

export default function Page() {

    const { user } = useContext(AuthContext)!;

    const {
        data: maxApplications,
        isLoading: LoadingMaxApplications,
    } = useQuery<boolean>(
        'maxApplications',
        () => _checkMaxApplications(user.id));

    const {
        data: pendingCerts,
        isLoading: LoadingPendingCerts,
    } = useQuery<iCertificationDB[]>(
        'pendingCerts',
        () => fetchPendingCerts(user.id));

    return (
        <PageWrapper>
            <div className="p-10 flex justify-between items-center">
                <NavHamburger />
                <h1 className="text-4xl text-primary">Welcome back {user?.name}!</h1>
            </div>
            <div className="w-full flex justify-center px-5">
                
                <PendingCertsSankey/>
            </div>
            <div className="w-full flex p-1">
                <div className=" m-1 w-full flex flex-col items-center p-2">
                    <div className="w-full flex flex-col px-20 py-10">
                        <h2 className="text-base-100 font-semibold text-lg mb-2">Pending Opportunities</h2>
                        <div className="self-center max-w-screen-xl w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {LoadingPendingCerts ?
                                <LoadingSpinner />
                                :
                                pendingCerts.map((cert: iCertificationDB, i) => {
                                    return (
                                        <Certification
                                            key={i}
                                            certID={cert.id}
                                            userID={user?.id as string}
                                            hours={cert.hours}
                                            name={cert.name}
                                            company_name={cert.company_name}
                                            apply={false}
                                            maxApplied={true}
                                            admin={false}
                                        ></Certification>
                                    )
                                })}
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    )
}