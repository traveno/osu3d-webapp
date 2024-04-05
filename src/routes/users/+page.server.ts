import type { UserPermissions } from "$lib/types/models";
import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { PermCategory, PermFlag, hasPermission } from "$lib/helpers";

export const load = (async ({ locals: { supabase, getSession, getUserPermissions: getPermissions } }) => {
    const session = await getSession();
    const permissions = await getPermissions();

    if (!session || !hasPermission(permissions?.level, PermCategory.USERS, PermFlag.FIRST))
        throw redirect(303, '/');

    const { data: userLevels } = await supabase
        .from('user_levels')
        .select('*')
        .order('created_at', { ascending: false })
        .returns<UserPermissions[]>();
    
    return { session, userLevels };
}) satisfies PageServerLoad;

export const actions = {
    changePermsMulti: async ({ request, locals: { supabase, getSession } }) => {
        const formData = await request.formData();
        const session = await getSession();

        const resolvedById = session?.user.id;
        if (!resolvedById) return { success: false };

        let newPermsList: { id: string, newPermLevel: number, success: boolean }[] = JSON.parse(formData.get('permArray') as string)
            .map((data: { id: string, newPermLevel: number}) => { return { ...data, success: false } });

        for (let permChange of newPermsList) {
            let check = await supabase
                .from('user_levels')
                .select('*')
                .eq('user_id', permChange.id)
                .single();

            // Do not allow changes to an admin account
            // if (check.data?.level === -1 || permChange.newPermLevel === -1) continue;

            let change = await supabase
                .from('user_levels')
                .update({
                    level: permChange.newPermLevel,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', permChange.id)
                .single()

            if (change.status === 200 || change.status === 204) permChange.success = true;
        }

        return {
            success: newPermsList.filter(p => !p.success).length === 0,
        }
    }
} satisfies Actions;

