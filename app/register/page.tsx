'use client'
import { FormEvent, useRef, useState } from "react"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useRouter } from "next/navigation";
import { _createNewCompany } from "../utils/supabase/actions/admin.actions";
import { http_logoUpload } from "../utils/http/functions";


/**
 * Creating a new company
 * @returns 
 */
export default function Page() {

    const email = useRef(null);
    const companyName = useRef(null);
    const confirmCompanyName = useRef(null);
    const industry = useRef(null);
    const description = useRef(null);
    const typeOfWork = useRef(null);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);


    const { executeRecaptcha } = useGoogleReCaptcha();

    const router = useRouter();


    const [companyMismatch, setCompanyMismatch] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        setLoading(true);
        if (companyName.current.value !== confirmCompanyName.current.value) {
            setCompanyMismatch(true);
            return;
        };

        setCompanyMismatch(false);

        if (!executeRecaptcha) {
            console.error('not available right now');
            return;
        }

        const gRecaptchaToken = await executeRecaptcha('inquirySubmit');

        const form : FormData = new FormData();

        form.append('image', file);
        form.append('name', companyName.current.value);

        const { bool, mes } = await _createNewCompany(
            companyName.current.value,
            description.current.value,
            typeOfWork.current.value,
            email.current.value,
            gRecaptchaToken,
            form);
        
        setLoading(false);
        if (bool) {
            alert(mes);
            router.push("/");
        } else {
            alert(mes);
        };

    }

    const handleFile = async (e: any) => {
        const file: File = e.target.files[0];
        const reader = new FileReader();
        if(!file) return;

        reader.onload = (event : ProgressEvent<FileReader>) => {
            const img = new Image();
            img.onload = () => {
                if(img.width !== img.height){
                    alert('Please upload a square logo');
                    e.target.value = '';
                }
                else setFile(file);
            }
            img.src = event.target.result as string;
        }
        reader.readAsDataURL(file);
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-neutral">
            <form className="flex flex-col w-1/3 min-w-96 m-3" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label
                        className="block mb-2 text-sm font-bold text-gray-700"
                    >Email</label>
                    <input
                        required
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-primary focus:shadow-outline text-base-100"
                        ref={email}
                    />
                </div>
                <div className="mb-4">
                    <label
                        className="block mb-2 text-sm font-bold text-gray-700"
                    >Company Logo</label>
                    <input
                        type="file"
                        className="file-input w-full file-input-md max-w-xs file-input-primary bg-transparent"
                        onChange={handleFile}
                        accept="image/*"
                        required
                    />
                </div>
                <div className="mb-4">
                    {companyMismatch && <label className="block text-xs font-medium text-red-500">Company input fields do not match</label>}
                    <label
                        className="block mb-2 text-sm font-bold text-gray-700"
                    >Company</label>
                    <input
                        required
                        className={`w-full px-3 py-2 bg-gray-100 border rounded focus:outline-primary focus:shadow-outline text-base-100 ${companyMismatch ? "border-red-500" : "border-gray-300"
                            }`}
                        ref={companyName}
                    />
                </div>
                <div className="mb-4">
                    <label
                        className="block mb-2 text-sm font-bold text-gray-700"
                    >Re-enter company name</label>
                    <input
                        required
                        className={`w-full px-3 py-2 bg-gray-100 border rounded focus:outline-primary focus:shadow-outline text-base-100 ${companyMismatch ? "border-red-500" : "border-gray-300"
                            }`}
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
                    {loading && <span className="loading loading-spinner"></span>}
                    Submit
                </button>
            </form>
        </div>
    )
}