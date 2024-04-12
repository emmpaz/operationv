'use client'

import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext";
import { SkillsComponent } from "./components/SkillsComponent";


export default function Page(){

    const {user} = useContext(AuthContext)!;

    const [page, setPage] = useState<number>(
        parseInt(localStorage.getItem('onboarding_page')) || 0);

    const handleSubmit = () => {

    }

    const handlePrev = () => {
        localStorage.setItem('onboarding_page', (page - 1).toString());
        setPage(page - 1);
    }

    const renderForm = () => {
        switch(page){
            case 0:
                return <SkillsComponent/>;
        }
    }
    
    return(
            <div className="w-full flex h-screen bg-custom justify-center items-center">
                {renderForm()}
            </div>
    )
}