'use client'
import { useContext, useState } from "react";
import { NavBar } from "../../components/common/navbar";
import LoggingHoursList from "../../components/volunteer/loggingHoursList";
import { useQuery } from "react-query";
import { _getTotalHoursApproved, _getTotalHoursPending } from "../../utils/supabase/actions/volunteer.actions";
import { AuthContext } from "../../context/AuthContext";
import CertificationProgress from "../../components/volunteer/visualizeLoggedHours";
import { fetchApprovedCerts } from "../../utils/queries/queries";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";




export default function Page() {
    const { user } = useContext(AuthContext)!;

    const { data: totalHoursCompleted } = useQuery<number>('totalHoursCompleted', () => _getTotalHoursApproved(user.id));
    const { data: totalHoursPending } = useQuery<number>('totalHoursPending', () => _getTotalHoursPending(user.id));

    const { data, isLoading } = useQuery('approvedCerts',
        () => fetchApprovedCerts(user.id),
        {
            refetchOnMount: "always"
        }
    );

    const [navbar, setNavbar] = useState(false);

    const handleNav = (bool: boolean) => {
        setNavbar(bool);
    }

    return (
        <div className="flex bg-custom min-h-screen">
            <div className="w-full flex">
                <NavBar open={navbar} handleNav={handleNav} />
                <div className="w-full flex flex-col max-h-screen overflow-y-auto">
                    <div className="flex-none lg:hidden m-4">
                        <button
                            className="btn btn-square btn-ghost hover:text-primary"
                            onClick={() => handleNav(true)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    </div>
                    <div className="w-full flex justify-center pt-8">
                        <h1 className="flex flex-wrap justify-center items-end">
                            <span className="text-9xl text-primary mr-1">{totalHoursCompleted}</span>
                            <span className="min-w-fit">total hours logged</span>
                        </h1>
                        <h1 className="flex flex-wrap justify-center items-end">
                            <span className="text-9xl text-secondary mr-1">{totalHoursPending}</span>
                            <span className="min-w-fit">total hours pending</span>
                        </h1>
                    </div>
                    <div className="w-full justify-center flex flex-col-reverse md:flex-row p-10">
                        {isLoading ?
                            <LoadingSpinner />
                            :
                            <>
                                <div className="w-full md:w-1/2">
                                    <LoggingHoursList certifications={data} />
                                </div>
                                <div className="w-full md:w-1/2">
                                    TODO
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}