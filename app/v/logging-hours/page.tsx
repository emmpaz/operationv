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
import PageWrapper from "../../../lib/layouts/PageWrapper";
import { NavHamburger } from "../../../lib/buttons/NavHamburger";




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
        <PageWrapper>
            <NavHamburger />
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
        </PageWrapper>
    )
}