import { useQuery } from "react-query";
import { LoadingSpinner } from "./LoadingSpinner";
import { _applyToCertificationDB } from "../../utils/supabase/actions/volunteer.actions";



const companyCache: { [key: string]: string } = {};

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
            profile?: boolean
            onApply?: () => void
        }) => {

        const { data, isLoading } = useQuery(['certImage', props.company_name],
            async () => {
                if (companyCache[props.company_name]) return companyCache[props.company_name];

                const res = await fetch('/api/certimage?' + new URLSearchParams({
                    company_name: props.company_name
                }))
                if (res.status == 200) {
                    const blob = await res.blob();
                    const link = await URL.createObjectURL(blob);
                    companyCache[props.company_name] = link;
                    return link;
                }
            });

        const handleApply = async () => {
            if (await _applyToCertificationDB(props.certID as string, props.userID as string, props.hours)) {
                props.onApply();
                return
            }
            alert('Failed to apply');
        };

        return (
            <div className="flex p-6 w-full bg-neutral rounded shadow-lg relative">
                <div className="flex flex-col w-full">
                    <div className="flex border justify-between">
                        <div className="flex items-center">
                            {isLoading ?
                                <LoadingSpinner />
                                :
                                <div className="w-16 h-16 flex-shrink-0">
                                    <img src={data} alt="cert image" />
                                </div>
                            }
                            <div className="ml-3 overflow-hidden">
                                <p className=" font-semibold text-base-100 truncate">{props.name}</p>
                                <p className=" text-xs">{props.company_name}</p>
                            </div>
                        </div>
                        {props.profile && <div>
                            <p className="text-sm">1/12/2023</p>
                            <p className="text-xs text-right">received</p>
                        </div>}
                    </div>
                    <div className="flex justify-end pt-6">
                        <button className="btn btn-primary btn-xs rounded font-medium">
                            View
                        </button>
                        {/**is admin */}
                        {props.admin &&
                            (<button className="btn btn-primary btn-xs rounded font-medium">
                                Edit
                            </button>)
                        }
                        {/**not admin but can still apply if max not reached*/}
                        {!props.maxApplied && props.apply && !props.admin &&
                            (<button className="btn btn-primary btn-xs rounded font-medium" onClick={handleApply}>
                                Apply
                            </button>)
                        }
                        {/**not admin and already applied*/}
                        {!props.maxApplied && !props.apply && !props.admin &&
                            (<button className="btn btn-primary btn-xs rounded font-medium" onClick={handleApply} disabled>
                                Applied
                            </button>)
                        }
                        {/**max reached */}
                        {props.maxApplied && !props.admin &&
                            (<button className="btn btn-primary btn-xs rounded font-medium" onClick={handleApply} disabled>
                                Max Reached
                            </button>)
                        }
                    </div>
                </div>
            </div>
        )
    }

export default Certification;