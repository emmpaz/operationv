'use client'

import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext";
import { SkillsComponent } from "./components/SkillsComponent";
import { InterestComponent } from "./components/InterestComponent";
import { CompletedOnboarding } from "./components/CompletedOnboarding";


export default function Page(){

    const [page, setPage] = useState<number>(
        parseInt(localStorage.getItem('onboarding_page')) || 0);

    const handleSubmit = () => {
        localStorage.setItem('onboarding_page', (page + 1).toString());
        setPage((prev) => prev + 1);
    }

    const handlePrev = () => {
        localStorage.setItem('onboarding_page', (page - 1).toString());
        setPage((prev) => prev - 1);
    }

    const renderForm = () => {
        switch(page){
            case 0:
                return <SkillsComponent handleSubmit={handleSubmit}/>;
            case 1:
                return <InterestComponent handleSubmit={handleSubmit}/>;
            case 2:
                return <CompletedOnboarding/>
            default:
                return
        }
        
    }
    
    return(
            <div className="w-full flex h-screen bg-custom justify-center items-center">
                {renderForm()}
            </div>
    )
}