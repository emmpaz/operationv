'use client'
import { FormEvent, useContext, useRef } from "react"
import { AuthContext } from "../../context/AuthContext";


export default function Page() {

    const titleRef = useRef(null);
    const contentRef = useRef(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-neutral">
            <form className="flex flex-col w-1/2 min-w-96 m-3">
                <label className="form-control w-full mb-1">
                    <div className="label">
                        <span className="label-text text-base-100">Title</span>
                    </div>
                    <input
                        className="input bg-neutral focus:input-primary input-bordered rounded focus:border-none text-base-100"
                        ref={titleRef}
                        required
                    />
                </label>
                <label className="form-control w-full mb-1">
                    <div className="label">
                        <span className="label-text text-base-100">Content</span>
                    </div>
                    <textarea
                        className="textarea bg-neutral focus:input-primary input-bordered rounded focus:border-none text-base-100"
                        ref={contentRef}
                        required
                    />
                </label>
                <button
                    className="btn rounded border-primary bg-primary hover:bg-primary text-base-100 mt-4"
                    type="submit"
                >
                    Create Announcement
                </button>
            </form>
        </div>
    )
}