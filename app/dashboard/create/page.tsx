'use client'
import { useRouter } from "next/navigation";
import { useState } from "react";
import _addNewCertificationDB, { _getCompanyIdFromDB } from "../../utils/supabase/db_calls/actions";
import { http_handleImageUpload } from "../../utils/http_functions/functions";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";



const CreateCertification = () => {
    const router = useRouter();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [hours, setHours] = useState(0);

    const [imagePreview, SetImagePreview] = useState("");

    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const {id, company} = await _getCompanyIdFromDB();
        const form : FormData = new FormData();
        form.append('image', file);
        const {bool, id : filename} = await _addNewCertificationDB({
            name, 
            description,
            hours: hours,
            company_id: id,
            company_name: company,
        })
        if(bool){
            form.append('name', filename);
            if(http_handleImageUpload(form)) router.push('/dashboard');
        }
    }

    const handlePreview = async (e: any) => {
        const file: File = e.target.files[0];
        if (file) {
            SetImagePreview(URL.createObjectURL(file));
            setFile(file);
        }
    }

    return (
        <div className="w-screen">
            <button
                className="btn btn-primary m-4"
                onClick={() => router.push('/dashboard')}
            >
                Back
            </button>
            <div className="w-full flex justify-center">
                {(name && imagePreview) ?
                    <div className="w-96">
                        <div className="card card-compact w-full bg-neutral rounded shadow-lg">
                            <figure>
                                <img src={imagePreview}></img>
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title">{name}</h2>
                            </div>
                        </div>
                    </div>
                    :
                    <LoadingSpinner/>
                }

            </div>
            <div className="w-screen flex h-screen justify-center items-center">
                <form onSubmit={handleSubmit} className="flex flex-col w-1/2 max-w-lg items-center">
                    <label className="form-control w-full mb-1">
                        <div className="label">
                            <span className="label-text text-base-100">Certification Image</span>
                        </div>
                        <input
                            type="file"
                            className="file-input w-full file-input-md max-w-xs file-input-primary bg-transparent"
                            onChange={handlePreview}
                            accept="image/*"
                            required
                        />
                    </label>
                    <label className="form-control w-full mb-1">
                        <div className="label">
                            <span className="label-text text-base-100">Name of Certification</span>
                        </div>
                        <input
                            className="input bg-neutral focus:input-primary input-bordered focus:border-none text-base-100"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </label>
                    <label className="form-control w-full mb-1">
                        <div className="label">
                            <span className="label-text text-base-100">Enter the description</span>
                        </div>
                        <textarea
                            className="textarea bg-neutral focus:input-primary input-bordered focus:border-none text-base-100"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </label>
                    <label className="form-control w-full mb-1">
                        <div className="label">
                            <span className="label-text text-base-100">Enter amount of hours needed</span>
                        </div>
                        <input
                            className="input bg-neutral input-bordered focus:input-primary focus:border-none text-base-100"
                            type="number"
                            value={hours}
                            onChange={(e) => setHours(parseInt(e.target.value))}
                            required
                        />
                    </label>
                    <button
                        className="btn rounded border-primary bg-primary hover:bg-primary text-base-100 mt-4"
                        type="submit">Create</button>
                </form>
            </div>
        </div>
    )
}

export default CreateCertification;