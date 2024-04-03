
import { useQuery } from "react-query";
import { LoadingSpinner } from "./LoadingSpinner";



const ProfileCertification =
    (props:
        {
            certID: string | undefined,
            userID?: string,
            hours: number,
            name: string,
            company_name: string,
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

        return (
            <div className="card card-compact w-full bg-neutral rounded shadow-lg">
                {isLoading ?
                    <LoadingSpinner/>
                    :
                    <>
                        <figure><img className="rounded" src={data} alt={props.name} /></figure>
                        <div className="card-body">
                            <p className="card-title text-base-100">{props.name}</p>
                            <p>{props.company_name}</p>
                            <div className="card-actions justify-end">
                                <button className="btn btn-primary rounded">
                                    View
                                </button>
                            </div>
                        </div>
                    </>
                }</div>
        )
    }

export default ProfileCertification;