import { useState } from "react";

//base props interface for all model components
export interface ModelComponentProps{
    handleOpen?: (bool : boolean) => void,
    handleRefetch?: () => void,
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
/**
 * defines a union type represents 
 * the possible prop types for model components
 */

type propTypes =  ApplicationModelProps | ReviewHoursModelProps | DistributionModelProps

/**
 * defines a type alias for a model component
 * with a generic type paramter T that should extend the base props
 */
export type ModelComponent<T extends ModelComponentProps> = React.FC<T>;

/**
 * Custom hook for managing the state and behavior of model components
 * @returns {
 *  isVisible : the state variable to see if the model is visible,
 *  ModelComponent: the state component that is currently active,
 *  modelProps: the props that should be passed to the component,
 *  showModel: the function to set all states and become visible
 *  handleVisibility: to set the visibility
 * }
 */
export const useModel = <T extends ModelComponentProps>() => {
    const [isVisible, setVisibility] = useState<boolean>(false);
    const [ModelComponent, setComponent] = useState<ModelComponent<T> | null>(null);
    const [modelProps, setProps] = useState<propTypes | null>(null);

    const handleVisibility = (bool: boolean) => {
        setVisibility(bool);
    }
    const showModel = (
        component : ModelComponent<T>, 
        props: propTypes
    ) => {
        handleVisibility(true);
        setComponent(() => component);
        setProps(props);
    }

    return {
        isVisible,
        ModelComponent,
        modelProps,
        showModel,
        handleVisibility
    }
}