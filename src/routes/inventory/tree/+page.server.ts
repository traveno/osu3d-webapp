import type { InventoryLocation } from "$lib/types/models";
import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { PermCategory, PermFlag, createTree, hasPermission } from "$lib/helpers";

export const load = (async ({ params, locals: { supabase, getSession, getUserPermissions } }) => {
  const session = await getSession();
  const permissions = await getUserPermissions();
  
  if (!session || !hasPermission(permissions?.level, PermCategory.INVENTORY, PermFlag.FIRST))
    throw redirect(303, '/');

  const { data: inventoryLocations } = await supabase
    .from('inv_locations')
    .select(`*`)
    .returns<InventoryLocation[]>();

    if (!inventoryLocations)
      throw error(404, `Resource not found`);

  const tree = createTree(inventoryLocations, 'id', 'parent');

  // console.log(tree);

  return { session, tree }
}) satisfies PageServerLoad;

export const actions = {

} satisfies Actions;