'use client'
import { useContext } from "react";
import LoggingHoursList from "../../components/volunteer/loggingHoursList";
import { useQuery } from "react-query";
import { _getTotalHoursApproved, _getTotalHoursPending } from "../../utils/supabase/actions/volunteer.actions";
import { AuthContext } from "../../context/AuthContext";
import { fetchApprovedCerts } from "../../utils/queries/queries";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import PageWrapper from "../../../lib/layouts/PageWrapper";
import { NavHamburger } from "../../../lib/buttons/NavHamburger";
import HeatMapChart from "../../../lib/charts/HeatMap";



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

    return (
        <PageWrapper>
            <NavHamburger />
            <div className="w-full flex justify-center pt-8">
                <h1 className="flex flex-wrap justify-center items-end">
                    <span className="text-9xl text-primary mr-1">{totalHoursCompleted}</span>
                    <span className="min-w-fit font-semibold">total hours logged</span>
                </h1>
                <h1 className="flex flex-wrap justify-center items-end">
                    <span className="text-9xl text-secondary mr-1">{totalHoursPending}</span>
                    <span className="min-w-fit font-semibold">total hours pending</span>
                </h1>
            </div>
            <div className="w-full justify-center flex flex-col p-20 items-center">
                {isLoading ?
                    <LoadingSpinner />
                    :
                    <div className="max-w-2xl">
                        <div className="w-full rounded">
                            <HeatMapChart/>
                        </div>
                        <div className="w-full ">
                            <LoggingHoursList certifications={data} />
                        </div>
                    </div>
                }
            </div>
        </PageWrapper>
    )
}