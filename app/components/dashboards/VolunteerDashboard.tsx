'use client'

import {useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useQuery} from "react-query";
import { fetchAllCerts, fetchPendingCerts } from "../../utils/queries/queries";
import { NavBar } from "../common/navbar";
import Certification from "../common/certification";
import LoggingHoursList from "../volunteer/loggingHoursList";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { iCertificationDB } from "../../../helpers/DatabaseTypes";
import { _checkMaxApplications } from "../../utils/supabase/actions/volunteer.actions";

const MAX_APPLICATIONS = 5;

export const VolunteerDashboard = () => {
    const { user } = useContext(AuthContext)!;

    const {
        data: maxApplications,
        isLoading: LoadingMaxApplications,
        refetch: maxApp_refetch} = useQuery<boolean>(
            'maxApplications', 
            () => _checkMaxApplications(user.id));

    const { 
        data: availableCerts,
        isLoading: LoadingAvailableCerts,
        refetch: available_refetch } = useQuery<iCertificationDB[]>(
            'availableCerts', 
            () => fetchAllCerts(user.id), 
            {enabled: !LoadingMaxApplications});

    
    const { 
        data: pendingCerts, 
        isLoading: LoadingPendingCerts, 
        refetch: pending_refetch } = useQuery<iCertificationDB[]>(
            'pendingCerts', 
            () => fetchPendingCerts(user.id));

    const [navbar, setNavbar] = useState(false);

    const revalidate = () => {
        maxApp_refetch();
        available_refetch();
        pending_refetch();
    }

    const handleNav = (bool: boolean) => {
        setNavbar(bool);
    }

    return (
        <div className="flex bg-custom">
            <div className="w-full flex">
                <NavBar open={navbar} handleNav={handleNav} />
                <div className="w-full flex flex-col max-h-screen overflow-y-auto">
                    <div className="p-10 flex justify-between items-center">
                        <div className="flex-none lg:hidden">
                            <button
                                className="btn btn-square btn-ghost hover:text-primary"
                                onClick={() => handleNav(true)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                                </svg>
                            </button>
                        </div>
                        <h1 className="text-4xl text-primary">Welcome back {user?.name}!</h1>
                    </div>
                    <div className="flex flex-col md:flex-row w-full p-1 h-72">
                        <div className="w-full lg:w-1/2 bg-neutral md:m-1 rounded shadow-lg overflow-y-auto">
                            <LoggingHoursList />
                        </div>
                        <div className="w-full lg:w-1/2 bg-neutral md:m-1 mt-1 rounded shadow-lg">
                            <h2 className="text-base-100 text-xl p-5">Announcements</h2>

                        </div>
                    </div>
                    <div className="w-full flex p-1">
                        <div className=" m-1 w-full flex flex-col items-center p-2">
                            <div className="w-fit flex flex-col">
                                <h2 className="text-base-100 text-xl py-5">Pending Opportunities</h2>
                                <div className="self-center max-w-screen-xl w-full grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {LoadingPendingCerts ?
                                        <LoadingSpinner/>
                                        :
                                        pendingCerts.map((cert : iCertificationDB, i) => {
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
                    <div className="w-full flex p-1">
                        <div className=" m-1 w-full flex flex-col items-center p-2">
                            <div className="w-fit flex flex-col">
                                <h2 className="text-base-100 text-xl py-5">Find Opportunities</h2>
                                <div className="self-center max-w-screen-xl w-full grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {LoadingMaxApplications || LoadingAvailableCerts ?
                                        <LoadingSpinner/>
                                        :
                                        availableCerts.map((cert : iCertificationDB, i) => {
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
                </div>
            </div>
        </div>
    )
}