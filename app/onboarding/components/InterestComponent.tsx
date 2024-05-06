import { ChangeEvent, useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { _addInterests } from "../../utils/supabase/actions/general.actions";

const interestsList = [
    "Environment", "Education", "Health",
    "Arts and Culture", "Sports", "Technology",
    "Social Services", "Advocacy", "Community Development",
    "Disaster Relief", "Animal Welfare", "Youth Development",
    "Seniors and Aging", "Homelessness", "Poverty Alleviation"
]


export const InterestComponent = (
    {
        handleSubmit
    } :
    {
        handleSubmit : () => void
    }
) => {
    const {user} = useContext(AuthContext)!;

    const [search, setSearch] = useState<string>("");
    const [interests, setInterests] = useState<string[]>(interestsList);
    const [selected, setSelected] = useState<string[]>([]);

    const handleChange = (event : ChangeEvent<HTMLInputElement>) => setSearch(event.target.value);

    const addInterest = () => {
        if(interests.includes(search.trim())) return;
        setInterests((prev) => [...prev, search.trim()]);
        setSelected((prev) => [...prev, search.trim()]);
        setSearch("");
    }

    const handleSelect = (interest : string) => {
        if(selected.includes(interest))
            setSelected((prev) => prev.filter((i) => i !== interest));
        else
            setSelected((prev) => [...prev, interest]);
    }

    const handleDatabase = () => {
            if(_addInterests(user.id, selected))
                handleSubmit();
    }

    return (
        <form className="w-2/3 max-w-xl">
            <div className="flex justify-center mb-10">
                <p className="text-base-100 font-semibold text-2xl">Add your interests</p>
            </div>
            <label className="input border-none input-primary flex items-center bg-neutral text-base-100 w-full">
                <input
                    onChange={handleChange}
                    value={search}
                    type="text"
                    className="grow text-base-100 text-sm"
                    placeholder="Add a new interest"
                />
                <button
                        onClick={addInterest}
                        type='button'
                        className="btn btn-square btn-sm btn-neutral font-medium text-xs"
                    >
                        Add
                    </button>
            </label>
            <div className="flex flex-wrap items-center justify-center">
                {interests.map((interest : string, index) => (
                        <input
                            key={index}
                            type="checkbox"
                            checked={selected.includes(interest)}
                            onChange={() => handleSelect(interest)}
                            className="btn btn-neutral btn-sm font-medium text-xs m-1"
                            aria-label={interest}
                        />
                ))}
            </div>
            <div className="flex pt-5 mt-5 justify-center border-t-2">
                <button
                    className="btn btn-neutral font-medium"
                    onClick={handleDatabase}
                >
                    Submit
                </button>
            </div>
        </form>
    )
}