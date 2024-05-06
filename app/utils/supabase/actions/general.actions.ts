'use server'
import { count } from "console";
import { iUserDB } from "../../../../helpers/DatabaseTypes";
import { DBNames } from "../../../../helpers/Enums";

import { createClient } from "../server";


/**
 * get the user from the database that matches the uuid
 * @param userID the user id
 * @returns the user
 */
export const _getUserFromDB = async (userID: string) => {

    const supabase = await createClient();

    const { data } = await supabase
        .from(DBNames.USERS_DB)
        .select()
        .eq('uuid', userID);

    if (data?.length) {
        return data[0]
    }

    return null
}

export const _addUserRoleAndDB = async (id: string, email: string) => {
    const supabase = await createClient();

    //check if user is in the database
    const { data: user } = await supabase
        .from(DBNames.USERS_DB)
        .select('*')
        .eq('email', email);

    if (!user?.length) {
        await supabase.auth.updateUser({
            data: {
                role: 'volunteer'
            }
        })

        const { 
            error: insertError } = await supabase
            .from(DBNames.USERS_DB).insert<iUserDB>({
                uuid: id,
                name: localStorage.getItem('name')?.toString() as string ?? "",
                email: email,
                created_at: new Date().toISOString(),
                role: 'volunteer'
            })

        if (insertError) {
            console.log(insertError.message);
            return false;
        }
    }
}

export const _getAdminFromDB = async (userID: string) => {
    const supabase = await createClient();

    const { data } = await supabase
        .from(DBNames.USERS_DB)
        .select()
        .eq('uuid', userID)
    if (data?.length) {
        return data[0]
    }
    return null
}

export const _addAdminRoleAndDB = async (email: string, id: string) => {
    const supabase = await createClient();

    //check if user is in the database
    const { data: user } = await supabase
        .from(DBNames.USERS_DB)
        .select('*')
        .eq('email', email);

    if (!user?.length) {
        await supabase.auth.updateUser({
            data: {
                role: 'admin',
                company: localStorage.getItem('company') as string ?? ""
            }
        })

        const { error: insertError } = await supabase.from(DBNames.USERS_DB).insert<iUserDB>({
            uuid: id,
            name: localStorage.getItem('name')?.toString() as string ?? "",
            email: email,
            created_at: new Date().toISOString(),
            role: 'admin'
        })

        if (insertError) {
            console.log(insertError.message);
            return false;
        }
    }
}


export const _getCertificationsFromDB = async (userID: string) => {
    const supabase = await createClient();

    const { data: certs, error } = await supabase
        .from(DBNames.CERTIFICATIONS_DB)
        .select(`
                        *,
                        ${DBNames.USER_CERTIFICATIONS_DB}(
                            *
                        )
                    `);

    const { data: CertsPending, error: PendingError } = await supabase
        .from(DBNames.PENDING_CERTIFICATIONS_DB)
        .select(`
                                            *
                                        `).eq('user_id', userID);

    if (PendingError) {
        console.log(PendingError.message);
    }
    if (certs?.length == 0) {
        return []
    }
    if (error) {
        console.log(error.message)
        return []
    }
    const CertsNotObtained = certs.filter((res) => {
        const hasCert = res.UserCertifications.some((uc: { id: string; }) => uc.id == userID);
        const PendingCert = CertsPending?.some((cp: { certification_id: string }) => cp.certification_id == res.id);

        return !hasCert && !PendingCert
    })

    return CertsNotObtained;
}

export const _getCompaniesFromDB = async () => {
    const supabase = await createClient();

    const { data: companies } = await supabase
        .from(DBNames.COMPANIES_DB)
        .select()
        .eq('is_verified', true)

    if (!companies?.length) {
        return []
    }

    return companies;

}

export const _getAllUsersAndCertifications = async () => {
    const supabase = await createClient();

    const { data: users } = await supabase
        .from(DBNames.USERS_DB)
        .select()
        .neq('role', 'admin');
    const { data: certifications } = await supabase
        .from(DBNames.CERTIFICATIONS_DB)
        .select()

    return [
        ...users,
        ...certifications
    ];
}

export const _getMostPopularCertifications = async () => {
    const supabase = await createClient();

    const { data: ids, error: rpcError } = await supabase
        .rpc('count_popularity');



    if (rpcError) {
        console.error(rpcError);
        return [];
    }

    const extractIds = ids.map(r => r.certification_id);

    const {
        data: certifications,
        error
    } = await supabase
        .from(DBNames.CERTIFICATIONS_DB)
        .select('*')
        .in('id', extractIds);

    if (error) {
        console.error(error);
        return [];
    }
    return certifications;
}

export const _addSkills = async (user_id: string, selectedSkills: string[]) => {
    const supabase = await createClient();

    //Find existing skills
    const {
        data: existingSkills,
        error: existingSkillsError } = await supabase
            .from(DBNames.SKILLS_DB)
            .select('*');

    if (existingSkillsError) {
        throw new Error('Failed to retrieve exisiting skills');
    }

    //extract the names from existing skill
    const exisitingSkillNames = existingSkills.map((skill) => skill.name);

    //new skills that need to be added to the Skills table
    const newSkills = selectedSkills.filter((skill) => !exisitingSkillNames.includes(skill));

    //if new skills need to be added
    if (newSkills.length > 0) {

        //add new skills
        const {
            data: insertedSkills,
            error: insertSkillsError } = await supabase
                .from(DBNames.SKILLS_DB)
                .insert(newSkills.map((skill) => ({ name: skill })))
                .select('*');

        if (insertSkillsError)
            throw new Error('Failed to insert new skills');

        //add skills to user_skills table using the existing skills and newly inserted skills
        const {
            data: userSkills,
            error: userSkillsError } = await supabase
                .from(DBNames.USER_SKILLS_DB)
                .insert(selectedSkills.map((skill) => {
                    const id = (exisitingSkillNames.includes(skill)) ?
                        existingSkills.find((s) => s.name === skill).id :
                        insertedSkills.find((s) => s.name === skill).id
                    return {
                        user_id,
                        skill_id: id
                    }
                }));

        if (userSkillsError) throw new Error(userSkillsError.message);

        return true;
    }
    //no new skills added so we can just use existing skill
    const {
        data: userSkills,
        error: userSkillsError
    } = await supabase
        .from(DBNames.USER_SKILLS_DB)
        .insert(selectedSkills.map((skill) => {
            const id = existingSkills.find((s) => s.name === skill).id
            return {
                user_id,
                skill_id: id
            }
        }));
    if (userSkillsError) throw new Error(userSkillsError.message);



    return true;
}


export const _addInterests = async (user_id: string, selectedInterests: string[]) => {
    const supabase = await createClient();

    //Find existing interests
    const {
        data: exisitingInterests,
        error: existingInterestsError } = await supabase
            .from(DBNames.INTERESTS_DB)
            .select('*');

    if (existingInterestsError) {
        throw new Error('Failed to retrieve exisiting interests');
    }

    //extract the names from existing interest
    const exisitingInterestsNames = exisitingInterests.map((interest) => interest.name);

    //new skills that need to be added to the Interests table
    const newInterests = selectedInterests.filter((interest) => !exisitingInterestsNames.includes(interest));

    //if new interests need to be added
    if (newInterests.length > 0) {

        //add new interests
        const {
            data: insertedInterests,
            error: insertInterestsError } = await supabase
                .from(DBNames.INTERESTS_DB)
                .insert(newInterests.map((interest) => ({ name: interest })))
                .select('*');

        if (insertInterestsError)
            throw new Error('Failed to insert new skills');

        //add interests to user_interests table using the existing interests and newly inserted interests
        const {
            data: userInterests,
            error: userInterestsError } = await supabase
                .from(DBNames.USER_INTERESTS_DB)
                .insert(selectedInterests.map((interest) => {
                    const id = (exisitingInterestsNames.includes(interest)) ?
                        exisitingInterests.find((s) => s.name === interest).id :
                        insertedInterests.find((s) => s.name === interest).id
                    return {
                        user_id,
                        interest_id: id
                    }
                }));

        if (userInterestsError) throw new Error(userInterestsError.message);

        return true;
    }
    //no new interests added so we can just use existing interests
    const {
        data: userInterests,
        error: userInterestsError } = await supabase
            .from(DBNames.USER_INTERESTS_DB)
            .insert(selectedInterests.map((interest) => {
                const id = exisitingInterests.find((s) => s.name === interest).id;
                return {
                    user_id,
                    interest_id: id
                }
            }));

    if (userInterestsError) throw new Error(userInterestsError.message);

    return true;
}

export const _onboardingComplete = async (user_id: string) => {
    const supabase = await createClient();

    const {error} = await supabase
    .from(DBNames.USERS_DB)
    .update({
        completed_onboarding: true
    })
    .eq('id', user_id);

    if(error){
        console.log(error.message);
        return false;
    }

    return true;
}