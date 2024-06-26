import { ApplicationModelProps, ModelComponent } from "./CustomModels";
import { http_sendEmail } from "../../../utils/http/functions";
import { _acceptApplication } from "../../../utils/supabase/actions/admin.actions";

const AcceptModel: ModelComponent<ApplicationModelProps> = ({
  application_id,
  application_user_email,
  application_user_name,
  application_cert,
  application_company,
  handleOpen,
  handleRefetch
}) => {
  const body: string = `You have been accepted to <strong>${application_cert}</strong> from ${application_company}. You can now start logging hours`;

  const handleAccept = (e: any) => {
    e.preventDefault();
    _acceptApplication(application_id);
    http_sendEmail(
      application_cert,
      application_company,
      application_user_email,
      body,
      'Congrats you got accepted (TrueImpact)'
    );
    handleOpen?.(false);
    handleRefetch();
  };

  return (
    <div className="transition-opacity w-screen fixed inset-0 flex justify-center items-center z-10 bg-black/70">
      <div className="w-2/3 max-w-3xl bg-white rounded shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4 text-primary">Application Details</h2>
        <div className="mb-6">
          <p className="text-lg font-semibold text-gray-800">{application_user_name}</p>
          <p className="text-gray-600">{application_user_email}</p>
        </div>
        <div className="mb-6">
          <p className="text-lg font-semibold text-gray-800">{application_cert}</p>
          <p className="text-gray-600">{application_company}</p>
        </div>
        <div className="flex justify-end">
          <button
            className="btn font-medium rounded bg-primary text-base-100 hover:bg-primary hover:-translate-y-0.5 hover:shadow-lg hover:shadow-secondary border-none mr-4"
            onClick={handleAccept}
          >
            Accept Application
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

export default AcceptModel;