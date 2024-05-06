import { ChangeEvent, useContext, useState } from "react"
import { PrimaryButton } from "../../../lib/buttons/PrimaryButton"
import { _addSkills } from "../../utils/supabase/actions/general.actions"
import { AuthContext } from "../../context/AuthContext"

const skillsList = [
    "Communtication", "Teamwork", "Problem-solving",
    "Leadership", "Organization", "Time Management",
    "Adaptability", "Creativity", "Critical Thinking",
    "Teaching/Mentoring", "Technical Skills", "Writing/Editing",
    "Marketing/Advertising", "Fundraising", "First Aid/CPR"
]


export const SkillsComponent = (
    {
        handleSubmit
    } :
    {
        handleSubmit : () => void
    }
) => {

    const {user} = useContext(AuthContext)!;

    const [search, setSearch] = useState<string>("");
    const [skills, setSkills] = useState<string[]>(skillsList);
    const [selected, setSelected] = useState<string[]>([]);

    const handleChange = (event : ChangeEvent<HTMLInputElement>) => setSearch(event.target.value);

    const addSkill = () => {
        if(skills.includes(search.trim())) return;
        setSkills((prev) => [...prev, search.trim()]);
        setSelected((prev) => [...prev, search.trim()]);
        setSearch("");
    }

    const handleSelect = (skill : string) => {
        if(selected.includes(skill))
            setSelected((prev) => prev.filter((s) => s !== skill));
        else
            setSelected((prev) => [...prev, skill]);
    }

    const handleDatabase = () => {
        if(_addSkills(user.id, selected))
            handleSubmit();
    }


    return (
        <form className="w-2/3 max-w-xl">
            <div className="flex justify-center mb-10">
                <p className="text-base-100 font-semibold text-2xl">Add your skills</p>
            </div>
            <label className="input border-none input-primary flex items-center bg-neutral text-base-100 w-full">
                <input
                    onChange={handleChange}
                    value={search}
                    type="text"
                    className="grow text-base-100 text-sm"
                    placeholder="Add a new skill"
                />
                <button
                        onClick={addSkill}
                        type='button'
                        className="btn btn-square btn-sm btn-neutral font-medium text-xs"
                    >
                        Add
                    </button>
            </label>
            <div className="flex flex-wrap items-center justify-center">
                {skills.map((skill : string) => <input type="checkbox" checked={selected.includes(skill)} onChange={() => handleSelect(skill)} aria-label={skill} className="btn btn-neutral btn-sm font-medium text-xs m-1" />)}
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