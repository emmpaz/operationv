import { useState } from "react"
import { iUserDB } from "./DatabaseTypes";


export interface ModelComponentProps{
    handleOpen?: (bool : boolean) => void,
}
export interface ApplicationModelProps extends ModelComponentProps{
    application_user_name : string,
    application_user_email : string,
    application_id: string,
    application_cert: string,
    application_company: string
}

export interface ReviewHoursModelProps extends ModelComponentProps{
    reviewee_user_name : string,
    reviewee_email : string,
    reviewee_pendingCert_id : string,
    reviewee_hours_logged: number,
    reviewee_log_id: string, 
}

export interface DistributionModelProps extends ModelComponentProps{
    receiver_user_ID: string,
    receiver_cert_ID: string,
    receiver_pending_ID: string,
    receiver_name: string,
    receiver_cert_name: string,
}

type propTypes =  ApplicationModelProps | ReviewHoursModelProps | DistributionModelProps


export type ModelComponent<T extends ModelComponentProps> = React.FC<T>;

export const useModel = <T extends ModelComponentProps>() => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [ModelComponent, setComponent] = useState<ModelComponent<T> | null>(null);
    const [modelProps, setProps] = useState<propTypes | null>(null);

    const showModel = (
        component : ModelComponent<T>, 
        props: propTypes
    ) => {
        setIsOpen(true);
        setComponent(() => component);
        setProps(props);
    }

    return {
        isOpen,
        ModelComponent,
        modelProps,
        showModel,
        setIsOpen
    }
}