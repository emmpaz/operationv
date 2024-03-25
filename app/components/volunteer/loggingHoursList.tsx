'use client'
import { useContext } from "react";
import { iCertificationDB, iHoursLoggingDB, iPendingCertificationDB } from "../../../helpers/DatabaseTypes";
import { AuthContext } from "../../context/AuthContext";
import { useQuery } from "react-query";
import { fetchApprovedCerts } from "../../../utils/fetch_queries/queries";
import { useRouter } from "next/navigation";
import { closetTailWindSize } from "../../../helpers/MathHelpers";




interface FlattenedPendingCert extends iPendingCertificationDB {
    Certifications: iCertificationDB,
    HoursLogging: iHoursLoggingDB | undefined
}

const LoggingHoursList = () => {
    const { user } = useContext(AuthContext)!;
    const router = useRouter();
    const { data: approvedCerts, isLoading } = useQuery('approvedCerts', () => fetchApprovedCerts(user.id));

    const handleNewLog = (cert_name: string, pending_cert_name: string) => {
        const params = new URLSearchParams({
            cert_name: cert_name,
            pending_cert_name: pending_cert_name
        });

        router.push(`log?${params.toString()}`);
    }
    return (
        <div className="h-full divide-y">
            {isLoading ?
                <div className="w-full h-screen flex items-center justify-center">
                    <span className="loading loading-dots loading-lg bg-primary"></span>
                </div>
                :
                approvedCerts.map((certInfo: FlattenedPendingCert) => {
                    const progress = closetTailWindSize(certInfo.hours_completed / certInfo.hours_required);
                    return (
                        <div className="flex py-5 w-full justify-between" key={certInfo.id}>
                            <div className="flex flex-col pl-2">
                                <p className="text-base-100">{certInfo.Certifications.name}</p>
                                <p className="text-sm">{certInfo.Certifications.company_name}</p>
                                {certInfo.HoursLogging && certInfo.HoursLogging.review_hours && <span className="badge badge-sm badge-secondary mt-2">Reviews needed</span>}
                            </div>
                            <div className="pr-2">
                                <div>
                                    <span>{parseInt((progress * 100).toString())}%</span>
                                </div>
                                <div className="flex w-20 h-1">
                                    <div className={`bg-primary`} style={{ width: `${progress * 100}%` }}></div>
                                    <div className="bg-gray-200" style={{ width: `${(1 - progress) * 100}%` }}></div>
                                </div>
                                <div className="flex justify-end items-end mt-2">
                                    <button
                                        className="btn btn-primary btn-xs"
                                        onClick={() =>
                                            handleNewLog(
                                                certInfo.Certifications.name,
                                                certInfo.id as string)
                                        }
                                    >Log</button>
                                </div>
                            </div>
                        </div>
                    )
                })}
        </div>
    )
}

export default LoggingHoursList;