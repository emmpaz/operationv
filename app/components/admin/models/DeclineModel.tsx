import { useRef } from "react";
import { _declineApplication } from "../../../utils/supabase/db_calls/actions";
import { ApplicationModelProps, ModelComponent } from "../../../../helpers/CustomModels";
import { http_sendEmail } from "../../../utils/http_functions/functions";

const DeclineModel: ModelComponent<ApplicationModelProps> = ({
  application_id,
  application_user_email,
  application_user_name,
  application_cert,
  application_company,
  handleOpen,
  handleRefetch
}) => {
  const message_ref = useRef<HTMLTextAreaElement>(null);

  const handleDecline = (e: any) => {
    e.preventDefault();

    _declineApplication(application_id, message_ref.current ? message_ref.current.value : "");
    http_sendEmail(
      application_cert,
      application_company,
      application_user_email,
      message_ref!.current!.value ?? "",
      'Message from TrueImpact'
    );

    handleOpen?.(false);
    handleRefetch();
  };

  return (
    <div className="transition-opacity w-screen fixed inset-0 flex justify-center items-center z-10 bg-black/50">
      <div className="w-2/3 max-w-3xl bg-white rounded shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4 text-red-800">Decline Application</h2>
        <div className="mb-6">
          <p className="text-lg font-semibold text-gray-800">{application_user_name}</p>
          <p className="text-gray-600">{application_user_email}</p>
        </div>
        <div className="mb-6">
          <p className="text-lg font-semibold text-gray-800">{application_cert}</p>
          <p className="text-gray-600">{application_company}</p>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="message">
            Reason for Declining
          </label>
          <textarea
            id="message"
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline focus:border-primary"
            rows={4}
            ref={message_ref}
          ></textarea>
        </div>
        <div className="flex justify-end">
          <button
            className="btn font-medium rounded bg-primary text-base-100 hover:bg-primary hover:-translate-y-0.5 hover:shadow-lg hover:shadow-secondary border-none mr-4"
            onClick={handleDecline}
          >
            Decline Application
          </button>
          <button
            className="btn btn-ghost font-medium bg-transparent text-primary rounded"
            onClick={() => handleOpen?.(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeclineModel;