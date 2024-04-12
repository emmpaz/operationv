



export const PrimaryButton = ({ str }: { str: string }) => {


    return (
        <button
            type="submit"
            className="btn font-medium rounded bg-primary text-base-100 hover:bg-primary hover:-translate-y-0.5 hover:shadow-lg hover:shadow-secondary border-none"
        >
            {str}
        </button>
    )
}