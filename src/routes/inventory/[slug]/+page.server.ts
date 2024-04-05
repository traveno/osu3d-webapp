import type { InventoryItem } from "$lib/types/models";
import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { hasPermission, PermCategory, PermFlag } from "$lib/helpers";

export const load = (async ({ params, locals: { supabase, getSession, getUserPermissions } }) => {
  const session = await getSession();
  const permissions = await getUserPermissions();
  
  if (!session || !hasPermission(permissions?.level, PermCategory.INVENTORY, PermFlag.FIRST))
    throw redirect(303, '/');

  const { data: singleItem } = await supabase
    .from('inv_items_view')
    .select(`
      *,
      created_by: created_by_user_id (*),
      changes: inv_changes_view (
        *,
        created_by: created_by_user_id (*)
      ),
      inv_category: inv_category_id (*)
    `)
    .eq('id', params.slug)
    .order('created_at', { foreignTable: 'inv_changes_view', ascending: false })
    .returns<InventoryItem[]>()
    .maybeSingle();

    console.log(singleItem?.changes.flatMap(c => c.amount));

    if (!singleItem)
      throw error(404, `Resource not found`);

  return { session, singleItem }
}) satisfies PageServerLoad;

export const actions = {

} satisfies Actions;