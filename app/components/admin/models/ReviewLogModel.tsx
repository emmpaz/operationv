import { _acceptLoggedHours } from "../../../utils/supabase/db_calls/actions";
import { ModelComponent, ReviewHoursModelProps } from "../../../../helpers/CustomModels";



const ReviewLogModel : ModelComponent<ReviewHoursModelProps> = ({
    reviewee_email,
    reviewee_pendingCert_id,
    reviewee_user_name,
    reviewee_hours_logged,
    reviewee_log_id,
    handleOpen,
    handleRefetch,
}) => {

    const handleAccept = async (e : any) => {
        e.preventDefault();
        if(await _acceptLoggedHours(reviewee_log_id, reviewee_hours_logged, reviewee_pendingCert_id)){
            handleOpen?.(false);
            handleRefetch();
        }
    }

    return(
        <div className=" transition-opacity w-screen fixed inset-0 flex justify-center items-center z-10 bg-gray-500/75">
        <div className="w-1/2 h-1/2 bg-neutral rounded flex justify-center items-center">
            <form className="form-control w-full p-20 max-w-xl flex flex-col items-center">
                <h2>{reviewee_user_name}</h2>
                <div className="flex w-full justify-center">
                <button className="btn btn-primary max-w-xs mx-2" onClick={handleAccept}>Accept :)</button>
                <button className="btn btn-neutral max-w-xs mx-2" onClick={() => handleOpen?.(false)}>Cancel</button>
                </div>
            </form>
        </div>

    </div>
    )

}

export default ReviewLogModel;