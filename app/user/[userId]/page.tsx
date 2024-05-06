'use client'
import { NavBar } from "../../components/common/navbar";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

import { useQuery } from "react-query";

import { iCertificationDB, iUserDB } from "../../../helpers/DatabaseTypes";
import ProfileCertification from "../../components/common/ProfileCertification";
import { _getUserFromDB } from "../../utils/supabase/actions/general.actions";
import { _getUserCertificationFromDB } from "../../utils/supabase/actions/volunteer.actions";
import PageWrapper from "../../../lib/layouts/PageWrapper";
import Certification from "../../components/common/certification";


const UserProfile = ({ params }: { params: { userId: string } }) => {
    const { user } = useContext(AuthContext)!;
    const [navbar, setNavbar] = useState(false);
    const notSignedIn: boolean = (user) ? false : true;
    const ownProfile: boolean = (user) ? user.uuid === params.userId : false;

    const { isLoading: userLoading, data: userData } = useQuery<iUserDB | null>(
        ['user', params.userId],
        async () => {
            const res = await _getUserFromDB(params.userId);
            return res;
        },
        { enabled: !!params.userId }
    );

    const { isLoading: certsLoading, data: certList } = useQuery<iCertificationDB[]>(
        ['certifications', user],
        async () => {
            const res = await _getUserCertificationFromDB(userData?.id ?? "");
            return res.map((cert: iCertificationDB) => ({
                id: cert.id,
                name: cert.name,
                description: cert.description,
                hours: cert.hours,
                company_name: cert.company_name,
                company_id: cert.company_id
            }))
        },
        { enabled: !!userData?.id }
    );

    const handleNav = (bool: boolean) => {
        setNavbar(bool);
    }

    return (
        (userLoading || certsLoading) ?
            <div className="w-full h-screen flex items-center justify-center">
                <span className="loading loading-dots loading-lg bg-primary"></span>
            </div>
            :
            <PageWrapper>
                    <div className="w-full flex min-h-full flex-col">
                        <div className="flex-none lg:hidden pl-5 pt-5">
                            <button
                                className="btn btn-square btn-ghost hover:text-primary"
                                onClick={() => handleNav(true)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                            </button>
                        </div>
                        <div className="w-full p-5 h-48 md:h-64">
                            <div className="w-full h-full rounded-lg bg-neutral shadow">
                                <div className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col justify-between">
                                            <h1 className="text-lg md:text-2xl text-base-100">{userData?.name}</h1>
                                            <div className="flex items-end">
                                                <h2 className="text-primary text-4xl md:text-6xl">{certList?.length}</h2>
                                                <p className="text-gray-400 text-sm ml-1">certifications</p>
                                            </div>
                                        </div>
                                        {ownProfile && <button className="btn btn-sm btn-primary font-medium">Edit Profile</button>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full p-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {certList?.map((cert, i) => {
                                    return (
                                        <Certification
                                            certID={cert.id}
                                            userID={userData?.id as string}
                                            hours={cert.hours}
                                            name={cert.name}
                                            company_name={cert.company_name}
                                            apply={false}
                                            admin={false}
                                            profile={true}
                                        />
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    </PageWrapper>
    )
}

export default UserProfile;