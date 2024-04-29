import { useRouter } from "next/navigation";
import { useQuery } from "react-query";
import { iCertificationDB } from "../../../helpers/DatabaseTypes";
import { useEffect, useState } from "react";
import { NavBar } from "../common/navbar";
import ReviewHoursList from "../admin/certs_list/ReviewHoursList";
import FinalReviewList from "../admin/certs_list/FinalReviewList";
import PendingCertificationsList from "../admin/certs_list/PendingCertificationsList";
import Certification from "../common/certification";
import { LoadingSpinner } from "../common/LoadingSpinner";
import Link from "next/link";
import { _getCompanyCertificationsFromDB } from "../../utils/supabase/actions/admin.actions";
import PageWrapper from "../../../lib/layouts/PageWrapper";



const AdminDashboard = () => {
    const router = useRouter();
    const {data: certs, isLoading} = useQuery('activeCerts', () => _getCompanyCertificationsFromDB());

    const [activeCerts, setActiveCerts] = useState<iCertificationDB[]>([]);

    const [navbar, setNavbar] = useState(false);

    useEffect(() => {
        if(certs){
            setActiveCerts(certs[0].map((cert: iCertificationDB) => ({ 
                id: cert.id, 
                name: cert.name, 
                description: cert.description, 
                hours: cert.hours, 
                company_name: cert.company_name,
                company_id: cert.company_id 
            })))
        }
    }, [certs])

    const handleNav = (bool: boolean) => {
        setNavbar(bool);
    }

    return (
        <PageWrapper>
                <div className="w-full flex flex-col max-h-screen overflow-y-auto">
                    <div className="p-10 flex justify-between items-center">
                        <div className="flex-none lg:hidden">
                            <button 
                                className="btn btn-square btn-ghost hover:text-primary"
                                onClick={() => handleNav(true)}
                                >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                            </button>
                        </div>
                        <div className="p-10 w-fit ">
                            <h1 className="text-4xl text-primary">Welcome admin</h1>
                        </div>
                        <Link
                            className="btn btn-primary"
                            href="/dashboard/create"
                        >New Certification</Link>
                    </div>
                    <div className="flex flex-col md:flex-row w-full p-1 h-80">
                        <div className="w-full lg:w-1/2 bg-neutral md:m-1 rounded shadow-lg overflow-y-auto min-h-10">
                            <ReviewHoursList />
                        </div>
                        <div className="w-full lg:w-1/2 bg-neutral md:m-1 mt-1 rounded shadow-lg overflow-y-auto">
                            <FinalReviewList/>

                        </div>
                    </div>
                    <div className="w-full flex p-1">
                        <div className=" w-full flex flex-col items-center p-2">
                            <div className="w-full flex flex-col">
                                <h2 className="text-base-100 text-xl py-5">Volunteer Applications</h2>
                                <PendingCertificationsList />
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex p-1">
                        <div className="w-full flex flex-col items-center p-2">
                            <div className="w-full flex flex-col">
                                <h2 className="text-base-100 text-xl py-5">All Active Certifications</h2>
                                {isLoading ?
                                    <LoadingSpinner/>
                                    :
                                    <div className="self-center max-w-screen-xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {activeCerts.map((cert, i) => {
                                            return (
                                                <Certification
                                                    key={i}
                                                    certID={cert.id}
                                                    hours={cert.hours}
                                                    name={cert.name}
                                                    company_name={cert.company_name}
                                                    apply={false}
                                                    admin={true}
                                                />
                                            )
                                        })}
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </PageWrapper>
    )

}

export default AdminDashboard;