import { _acceptApplication } from "../../../../utils/supabase/db_calls/API_calls";
import { ApplicationModelProps, ModelComponent } from "../../../../helpers/CustomModels";
import { http_sendEmail } from "../../../../utils/http_functions/functions";



const AcceptModel: ModelComponent<ApplicationModelProps> = ({
   application_id,
   application_user_email,
   application_user_name,
   application_cert,
   application_company,
   handleOpen
}) => {

    const body : string = `You have been accepted to <strong>${application_cert}</strong> from ${application_company}. You can now start logging hours`;


    const handleAccept = (e : any) => {
        e.preventDefault();
        _acceptApplication(application_id);
        http_sendEmail(application_cert, 
            application_company, 
            application_user_email, 
            body,
            'Congrats you got accepted (TrueImpact)');
        handleOpen?.(false);
    }

    return(
        <div className=" transition-opacity w-screen fixed inset-0 flex justify-center items-center z-10 bg-gray-500/75">
        <div className="w-1/2 h-1/2 bg-neutral rounded flex justify-center items-center">
            <form className="form-control w-full p-20 max-w-xl flex flex-col items-center">
                <h2>{application_user_name}</h2>
                <div className="flex w-full justify-center">
                <button className="btn btn-primary max-w-xs mx-2" onClick={handleAccept}>Accept :)</button>
                <button className="btn btn-neutral max-w-xs mx-2" onClick={() => handleOpen?.(false)}>Cancel</button>
                </div>
            </form>
        </div>

    </div>
    )
}

export default AcceptModel;