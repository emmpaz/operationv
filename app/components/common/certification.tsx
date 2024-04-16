import { useQuery } from "react-query";
import { LoadingSpinner } from "./LoadingSpinner";
import { _applyToCertificationDB } from "../../utils/supabase/actions/volunteer.actions";
import image from './google.png';




const Certification =
    (props:
        {
            certID: string | undefined,
            userID?: string,
            hours: number,
            name: string,
            company_name: string,
            apply: boolean,
            maxApplied?: boolean,
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
            <div className="flex p-7 w-full bg-neutral rounded shadow-lg relative">
                <div className="flex flex-col w-full">
                    <div className="flex w-full">
                        {isLoading ?
                            <LoadingSpinner />
                            :
                            <div style={{ width: '64px', height: '64px' }}>
                                <img src={image.src} alt="cert image" />
                            </div>
                        }
                        <div className="ml-3">
                            <p className=" font-semibold text-base-100 line-clamp-1">{props.name}</p>
                            <p className=" text-sm">{props.company_name}</p>
                        </div>
                    </div>
                    <div className="flex justify-end pt-3">
                        <button className="btn btn-primary btn-sm rounded font-medium">
                            View
                        </button>
                        {/**is admin */}
                        {props.admin &&
                            (<button className="btn btn-primary rounded font-medium">
                                Edit
                            </button>)
                        }
                        {/**not admin but can still apply if max not reached*/}
                        {!props.maxApplied && props.apply && !props.admin &&
                            (<button className="btn btn-primary btn-sm rounded font-medium" onClick={handleApply}>
                                Apply
                            </button>)
                        }
                        {/**not admin and already applied*/}
                        {!props.maxApplied && !props.apply && !props.admin &&
                            (<button className="btn btn-primary btn-sm rounded font-medium" onClick={handleApply} disabled>
                                Applied
                            </button>)
                        }
                        {/**max reached */}
                        {props.maxApplied && !props.admin &&
                            (<button className="btn btn-primary btn-sm rounded font-medium" onClick={handleApply} disabled>
                                Max Reached
                            </button>)
                        }
                    </div>
                </div>
            </div>
        )
    }

export default Certification;