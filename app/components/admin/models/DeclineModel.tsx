import { useRef } from "react";
import { _declineApplication } from "../../../../utils/supabase/db_calls/API_calls";
import { ApplicationModelProps, ModelComponent } from "../../../../helpers/CustomModels";
import { http_sendEmail } from "../../../../utils/http_functions/functions";

const DeclineModel: ModelComponent<ApplicationModelProps> = ({
    application_id,
    application_user_email,
    application_user_name,
    application_cert,
    application_company,
    handleOpen
}) => {

    const message_ref = useRef<HTMLTextAreaElement>(null);

    const handleDecline = (e: any) => {
        e.preventDefault();
        _declineApplication(application_id, (message_ref.current) ? message_ref.current.value : "");
        http_sendEmail(application_cert, 
            application_company, 
            application_user_email, 
            message_ref!.current!.value ?? "",
            'Message from TrueImpact');
        handleOpen?.(false);
    }

    return (
        <div className=" transition-opacity w-screen fixed inset-0 flex justify-center items-center z-10 bg-gray-500/75">
            <div className="w-1/2 h-1/2 bg-neutral rounded flex justify-center items-center">
                <form className="form-control w-full p-20 max-w-xl flex flex-col items-center">
                    <h2>{application_user_name}</h2>
                    <label className="form-control w-full max-w-xs my-5">
                        <div className="label">
                            <span className="label-text">Reason for denying</span>
                        </div>
                        <textarea
                            className="textarea w-full border-2 bg-gray-100 border-gray-300 rounded focus:outline-none focus:shadow-outline focus:border-primary"
                            ref={message_ref}
                        />
                    </label>
                    <div className="flex w-full justify-center">
                        <button className="btn btn-primary max-w-xs mx-2" onClick={handleDecline}>Decline</button>
                        <button className="btn btn-neutral max-w-xs mx-2" onClick={() => handleOpen?.(false)}>Cancel</button>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default DeclineModel;