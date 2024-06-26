import { ModelComponent, ApplicationModelProps } from "../models/CustomModels";
import AcceptModel from "../models/AcceptModel";
import DeclineModel from "../models/DeclineModel";




/**
 * this is a custom view of a certification from the perspective of the admin.
 * this certification will be shown on the admins view as a application for a certification.
 * @param props some information that is needed to accept or decline the application
 * @returns a certification component
 */
const AdminCertification =
(props:
    {
            pendingID: string | undefined,
            cert_name: string,
            user_id: string,
            user_name: string,
            user_email: string,
            requested_at: string,
            company_name: string,
            handleApplication : (
                model : ModelComponent <ApplicationModelProps>,
                props : ApplicationModelProps) => void
    }
) => {
        return (
            <div className="card w-full bg-neutral rounded shadow-lg">
                <div className="card-body">
                    <h2 className="card-title text-base-100">{props.user_name}</h2>
                    <p className="text-primary">{props.cert_name}</p>
                    <p className="text-sm">{props.user_email}</p>
                    <p className="text-sm">Applied: {props.requested_at.slice(0, 10)}</p>
                    <div className="card-actions justify-end">
                        <button 
                            className="btn btn-primary rounded btn-xs font-medium"
                            onClick={() => 
                                props.handleApplication(AcceptModel, 
                                    {
                                        application_user_name: props.user_name, 
                                        application_user_email: props.user_email, 
                                        application_id: props.pendingID as string,
                                        application_company: props.company_name,
                                        application_cert: props.cert_name,
                                    }
                                )}
                        >
                            Accept
                        </button>
                        <button 
                            className="btn btn-neutral rounded btn-xs font-medium"
                            onClick={() => 
                                props.handleApplication(DeclineModel, 
                                    {
                                        application_user_name: props.user_name, 
                                        application_user_email: props.user_email, 
                                        application_id: props.pendingID as string,
                                        application_company: props.company_name,
                                        application_cert: props.cert_name,
                                    }
                                    )}
                        >
                            Decline
                        </button>
                    </div>
                </div>
            </div>
        )
    }

export default AdminCertification;