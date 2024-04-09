import { _applyToCertificationDB } from "../../utils/supabase/db_calls/actions";
import { useQuery } from "react-query";
import { LoadingSpinner } from "./LoadingSpinner";
import Image from "next/image";





const Certification =
    (props:
        {
            certID: string | undefined,
            userID?: string,
            hours: number,
            name: string,
            company_name: string,
            apply: boolean,
            admin: boolean,
            onApply?: () => void
        }) => {

        const { data, isLoading } = useQuery(['certImage', props.certID],
            async () => {
                const res = await fetch('/api/certimage?' + new URLSearchParams({
                    id: props.certID
                }))
                if (res.status == 200) {
                    const blob = await res.blob();
                    return await URL.createObjectURL(blob);
                }
            });

        const handleApply = async () => {
            if (await _applyToCertificationDB(props.certID as string, props.userID as string, props.hours)) {
                props.onApply();
                return
            }
            alert('Failed to apply');
        }

        return (
            <div className="card card-compact w-full bg-neutral rounded shadow-lg relative">
                {isLoading ?
                    <LoadingSpinner/>
                    :
                    <figure className="relative w-full">
                        <div className="">
                            <Image src={data} alt="cert image" width={100} height={100}/>
                        </div>
                    </figure>
                    }
                <div className="card-body">
                    <p className="card-title text-base-100">{props.name}</p>
                    <p>{props.company_name}</p>
                    <div className="card-actions justify-end">
                        <button className="btn btn-primary rounded font-medium">
                            View
                        </button>
                        {/**is admin */}
                        {props.admin &&
                            (<button className="btn btn-primary rounded font-medium">
                                Edit
                            </button>)
                        }
                        {/**not admin but can still apply */}
                        {props.apply && !props.admin &&
                            (<button className="btn btn-primary rounded font-medium" onClick={handleApply}>
                                Apply
                            </button>)
                        }
                        {/**not admin and already applied*/}
                        {!props.apply && !props.admin &&
                            (<button className="btn btn-primary rounded font-medium" onClick={handleApply} disabled>
                                Applied
                            </button>)
                        }
                    </div>
                </div>
            </div>
        )
    }

export default Certification;