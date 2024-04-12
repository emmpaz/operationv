'use client'

import { useContext, useState } from "react";
import { NavBar } from "../../components/common/navbar"
import { iCertificationDB } from "../../../helpers/DatabaseTypes";
import { useQuery } from "react-query";
import { fetchPendingCerts } from "../../utils/queries/queries";
import { _checkMaxApplications } from "../../utils/supabase/actions/volunteer.actions";
import { AuthContext } from "../../context/AuthContext";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import Certification from "../../components/common/certification";
import { NavHamburger } from "../../../lib/buttons/NavHamburger";
import PageWrapper from "../../../lib/layouts/PageWrapper";



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


    const [navbar, setNavbar] = useState(false);

    const handleNav = (bool: boolean) => {
        setNavbar(bool);
    }

    return (
        <PageWrapper>
            <div className="p-10 flex justify-between items-center">
                <NavHamburger />
                <h1 className="text-4xl text-primary">Welcome back {user?.name}!</h1>
            </div>
            <div className="w-full flex justify-center pt-8">
                <h1 className="flex flex-wrap justify-center items-end">
                    <span className="text-9xl text-primary mr-1">12</span>
                    <span className="min-w-fit">approved applications</span>
                </h1>
                <h1 className="flex flex-wrap justify-center items-end">
                    <span className="text-9xl text-red-500 mr-1">2</span>
                    <span className="min-w-fit">denied applications</span>
                </h1>
            </div>
            <div className="w-full flex p-1">
                <div className=" m-1 w-full flex flex-col items-center p-2">
                    <div className="w-full flex flex-col p-20">
                        <h2 className="text-base-100 text-3xl">Pending Opportunities</h2>
                        <div className="self-center max-w-screen-xl w-full grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                            maxApplied={false}
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