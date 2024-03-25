'use server'

import { createClient } from "../server";

export const signOut = async () => {
    const supabase = await createClient();
    await supabase.auth.signOut();
}