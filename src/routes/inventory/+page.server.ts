import type { InventoryCategory, InventoryItem } from "$lib/types/models";
import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { hasPermission, PermCategory, PermFlag } from "$lib/helpers";

export const load = (async ({ locals: { supabase, getSession, getUserPermissions: getPermissions } }) => {
  const session = await getSession();
  const permissions = await getPermissions();
  
  if (!session || !hasPermission(permissions?.level, PermCategory.INVENTORY, PermFlag.FIRST))
    throw redirect(303, '/');

  const { data: inventory } = await supabase
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
    .returns<InventoryItem[]>();

  const { data: categories } = await supabase
    .from('inv_categories')
    .select('*')
    .returns<InventoryCategory[]>();

  if (inventory === null || categories === null)
    throw error(404, 'Could not fetch resources');

  return { session, inventory, categories }
}) satisfies PageServerLoad;

export const actions = {
  submitNewItem: async ({ request, locals: { supabase, getAuthUser } }) => {
    const formData = await request.formData();
    const user = await getAuthUser();

    const name = formData.get('name') as string;
    const minimum = Number(formData.get('minimum'));
    const inv_category_id = formData.get('inv_category_id') as string;

    console.log(name, minimum, inv_category_id);

    let result = await supabase
      .from('inv_items')
      .insert({
        name,
        minimum,
        created_by_user_id: user!.id,
        inv_category_id
      });
  },
  submitNewCategory: async ({ request, locals: { supabase, getAuthUser } }) => {
    const formData = await request.formData();
    const user = await getAuthUser();

    const name = formData.get('name') as string;

    const result = await supabase
      .from('inv_categories')
      .insert({
        name,
        created_by_user_id: user!.id
      });
  },
  submitNewChange: async ({ request, locals: { supabase, getAuthUser } }) => {
    const formData = await request.formData();
    const user = await getAuthUser();

    const mode = formData.get('mode') as 'add' | 'subtract';
    const item_id = formData.get('item_id') as string;
    const amount = Number(formData.get('amount'));

    let result = await supabase
      .from('inv_changes')
      .insert({
        inv_item_id: item_id,
        amount: mode === 'add' ? amount : -amount,
        created_by_user_id: user!.id
      });
  }
} satisfies Actions;