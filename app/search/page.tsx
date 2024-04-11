'use client'
import { useQuery } from "react-query"
import { _getAllUsersAndCertifications } from "../utils/supabase/actions/general.actions"
import { iCertificationDB, iUserDB } from "../../helpers/DatabaseTypes";
import { FormEvent, useEffect, useRef, useState } from "react";
import { NavBar } from "../components/common/navbar";
import Image from "next/image";
import img from './test.png';



export default function Page() {

    const { data, isLoading } = useQuery('allUsers', () => _getAllUsersAndCertifications());
    const [list, setList] = useState([]);
    const [navbar, setNavbar] = useState(false);
    const searchText = useRef(null);

    const handleFilter = (e: FormEvent) => {
        e.preventDefault();
        const filtered = data.filter(
            (item) => item.name.toLowerCase().includes(searchText.current.value))
        setList(filtered);
    }

    const handleNav = (bool: boolean) => {
        setNavbar(bool);
    }

    return (
        <div className="flex bg-custom min-h-screen">
            <div className="w-full flex">
                <NavBar open={navbar} handleNav={handleNav} />
                <div className="w-full flex flex-col max-h-screen overflow-y-auto">
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
                    <div className="w-full flex justify-center">
                        <form className="w-1/2 p-3 flex max-w-xl" onSubmit={handleFilter}>
                            <label className="input border-none input-primary flex items-center bg-neutral text-base-100 mr-2 w-full">
                                <input
                                    ref={searchText}
                                    type="text"
                                    className="grow text-base-100"
                                    placeholder="Search for anything..."
                                />
                            </label>
                            <button
                                type='submit'
                                className="btn btn-square btn-neutral"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70 focus:bg-primary"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
                            </button>
                        </form>
                    </div>
                    <div className="flex w-full justify-center">
                        {(list.length == 0) ?
                            <div>
                                {(searchText?.current?.value !== '') ?
                                    "Couldn't find anything" : "Search for something"}
                            </div>
                            :
                            <div className="p-20 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {list.map((item: iUserDB & iCertificationDB) => (
                                    <div className="bg-neutral rounded shadow-sm hover:shadow-md">
                                        <div className="h-36 p-4 text-left flex">
                                            <Image height={100} src={img} alt="test" className=" shrink"/>
                                            <div className=" ml-4">
                                                <div
                                                    className={(item.hours !== undefined) ? " badge-sm badge bg-secondary border-none text-primary" : " badge-sm badge bg-neutral text-primary border-primary"}>
                                                    {(item.hours !== undefined) ? "Certification" : "User"}
                                                </div>
                                                <p className="text-sm font-medium text-base-100">{item.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}