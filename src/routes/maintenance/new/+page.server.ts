import type { Fault, Machine, User, UserLevel } from "$lib/types/database";
import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load = (async ({ params, locals: { supabase, getSession } }) => {
    const session = await getSession();
    if (!session)
        throw redirect(303, '/');

    
    
    return { session };
}) satisfies PageServerLoad;