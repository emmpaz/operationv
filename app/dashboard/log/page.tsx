'use client';

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { _addNewHourLog } from "../../utils/supabase/db_calls/actions";

const LogHours = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const hoursRef = useRef<HTMLInputElement>(null);

    const handleNewLog = async (e: any) => {
        e.preventDefault();
        if (descriptionRef.current && hoursRef.current) {
            if (await _addNewHourLog(descriptionRef.current.value, parseInt(hoursRef.current.value), searchParams.get('pendingCert_ID') as string)) {
                router.push('/');
            }
        }
    }

    return (
        <div className="w-full h-screen bg-custom flex justify-center items-center">
            <div className="bg-neutral rounded-lg p-8 shadow-lg">
                <form onSubmit={handleNewLog} className="flex flex-col gap-4">
                    <h2 className="text-base-100 text-xl font-semibold mb-4">New Entry for {searchParams.get('cert_name')}</h2>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-base-100">Hours</span>
                        </label>
                        <input
                            className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-primary focus:shadow-outline text-base-100"
                            type="number"
                            ref={hoursRef}
                            placeholder="Enter hours"
                            required
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-base-100">Description</span>
                        </label>
                        <textarea
                            className="px-3 py-2 focus:outline-primary bg-gray-100 focus:ring-primary rounded border-gray-300 text-base-100"
                            ref={descriptionRef}
                            placeholder="Enter description"
                            required
                        />
                    </div>
                    <button
                        className="btn btn-primary mt-4"
                        type="submit"
                    >Log Hours</button>
                </form>
            </div>
        </div>
    )
}

export default LogHours;