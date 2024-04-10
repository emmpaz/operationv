import { _distributeCertificationToUser } from "../../../utils/supabase/actions/admin.actions";
import { ModelComponent, DistributionModelProps } from "./CustomModels";

const DistributeCertificationModel: ModelComponent<DistributionModelProps> = ({
    receiver_cert_ID,
    receiver_pending_ID,
    receiver_user_ID,
    receiver_name,
    receiver_cert_name,
    handleOpen,
    handleRefetch
}) => {

    const handleDistribute = async (e: any) => {
        e.preventDefault();
        if (await _distributeCertificationToUser(receiver_user_ID, receiver_cert_ID, receiver_pending_ID)) {
            handleOpen?.(false);
            handleRefetch();
        }
    }

    return (
        <div className="transition-opacity w-screen fixed inset-0 flex justify-center items-center z-10 bg-gray-500/75">
            <div className="w-1/2 h-1/2 bg-neutral rounded flex justify-center items-center">
                <form className="form-control w-full p-20 max-w-xl flex flex-col items-center">
                    <h2>Distribute Certification</h2>
                    <p>Email: {receiver_name}</p>
                    <p>Certification: {receiver_cert_name}</p>
                    <div className="flex w-full justify-center">
                        <button className="btn btn-primary max-w-xs mx-2" onClick={handleDistribute}>Distribute</button>
                        <button className="btn btn-neutral max-w-xs mx-2" onClick={() => handleOpen?.(false)}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default DistributeCertificationModel;