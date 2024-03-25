'use client'
import { use, useContext, useEffect } from "react"
import { AuthContext } from "../context/AuthContext"
import { VolunteerDashboard } from "../components/dashboards/VolunteerDashboard";
import  AdminDashboard from "../components/dashboards/AdminDashboard";
import { useRouter } from "next/navigation";





export default function Page(){
    const {user} = useContext(AuthContext)!;
    if(user.role === "volunteer")
        return <VolunteerDashboard/>;
    if(user.role === "admin")
        return <AdminDashboard/>;
}