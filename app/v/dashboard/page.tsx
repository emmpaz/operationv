'use client'

import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useQuery } from "react-query";
import { _checkMaxApplications } from "../../utils/supabase/actions/volunteer.actions";
import { NavBar } from "../../components/common/navbar";
import PageWrapper from "../../../lib/layouts/PageWrapper";
import { NavHamburger } from "../../../lib/buttons/NavHamburger";


export default function Page() {

    const { user } = useContext(AuthContext)!;

    const {
        data: maxApplications,
        isLoading: LoadingMaxApplications,
        refetch: maxApp_refetch } = useQuery<boolean>(
            'maxApplications',
            () => _checkMaxApplications(user.id));

    const [navbar, setNavbar] = useState(false);

    const handleNav = (bool: boolean) => {
        setNavbar(bool);
    }
    return (
        <PageWrapper>
            <div className="p-10 flex justify-between items-center">
                <NavHamburger/>
                <h1 className="text-4xl text-primary">Welcome back {user?.name}!</h1>
            </div>
            <div className="flex flex-col md:flex-row w-full p-1 h-72">
                <div className="w-full lg:w-1/2 bg-neutral md:m-1 rounded shadow-lg overflow-y-auto">
                    Upcoming events
                </div>
                <div className="w-full lg:w-1/2 bg-neutral md:m-1 mt-1 rounded shadow-lg">
                    <h2 className="text-base-100 text-xl p-5">Announcements</h2>

                </div>
            </div>
            <div className="w-full flex p-1">
                <div className=" m-1 w-full flex flex-col items-center p-2">
                    <div className="w-1/2 flex flex-col">
                        <h2 className="text-base-100 text-xl py-5">Find Opportunities</h2>
                        <div className="w-full h-96 bg-neutral md:m-1 mt-1 rounded shadow-lg">

                        </div>
                        <h2 className="text-base-100 text-xl py-5">Recommened Opportunites</h2>
                        <div className="w-full h-96 bg-neutral md:m-1 mt-1 rounded shadow-lg">

                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    )
}