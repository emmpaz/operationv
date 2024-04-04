'use client'
import { FormEvent, useRef } from "react"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { _createNewCompany } from "../utils/supabase/db_calls/admin.actions";
import { useRouter } from "next/navigation";



export default function Page() {

    const companyName = useRef(null);
    const confirmCompanyName = useRef(null);
    const industry = useRef(null);
    const description = useRef(null);
    const typeOfWork = useRef(null);

    const { executeRecaptcha } = useGoogleReCaptcha();

    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if(companyName.current.value !== confirmCompanyName.current.value) return;

        if (!executeRecaptcha) {
            console.error('not available right now');
            return;
        }
        const gRecaptchaToken = await executeRecaptcha('inquirySubmit');

        const res = await _createNewCompany(
            companyName.current.value, 
            description.current.value,
            typeOfWork.current.value, gRecaptchaToken);
            
        if(res) {
            alert('Company was sent to the registrar! You should receive an email once you company was approved!');
            router.push("/");
        }else{
            alert('Error');
        };

    }

    return (
        <div className="h-screen w-full flex items-center justify-center bg-neutral">
            <form className="flex flex-col w-1/3 min-w-96" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label
                        className="block mb-2 text-sm font-bold text-gray-700"
                    >Company</label>
                    <input
                        required
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-primary focus:shadow-outline text-base-100"
                        ref={companyName}
                    />
                </div>
                <div className="mb-4">
                    <label
                        className="block mb-2 text-sm font-bold text-gray-700"
                    >Re-enter company name</label>
                    <input
                        required
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-primary focus:shadow-outline text-base-100"
                        ref={confirmCompanyName}
                    />
                </div>
                <div className="mb-4">
                    <label
                        className="block mb-2 text-sm font-bold text-gray-700"
                    >Company Industry</label>
                    <input
                        required
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-primary focus:shadow-outline text-base-100"
                        ref={industry}
                    />
                </div>
                <div className="mb-4">
                    <label
                        className="block mb-2 text-sm font-bold text-gray-700"
                    >Brief description of the company</label>
                    <textarea
                        required
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-primary focus:shadow-outline text-base-100"
                        ref={description}
                    />
                </div>
                <div className="mb-4">
                    <label
                        className="block mb-2 text-sm font-bold text-gray-700"
                    >What type of volunteer work can you provide?</label>
                    <textarea
                        required
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-primary focus:shadow-outline text-base-100"
                        ref={typeOfWork}
                    />
                </div>
                <button type='submit' className="btn font-medium rounded bg-primary text-base-100 hover:bg-primary hover:-translate-y-0.5 hover:shadow-lg hover:shadow-secondary border-none">
                    Submit
                </button>
            </form>
        </div>
    )
}