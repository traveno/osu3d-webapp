import type { Fault, InventoryItem, Machine } from "$lib/types/database";
import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load = (async ({ params, locals: { supabase, getSession } }) => {
    const session = await getSession();
    if (!session)
        throw redirect(303, '/');

    const { data: singleItem } = await supabase
      .from('inv_items')
      .select(`
          *,
          created_by: created_by_user_id (*),
          changes: inv_changes (
              *,
              created_by: created_by_user_id (*)
          ),
          inv_category: inv_category_id (*)
      `)
      .eq('id', params.slug)
      .order('created_at', { foreignTable: 'inv_changes', ascending: false })
      .returns<InventoryItem[]>()
      .maybeSingle();

      console.log(singleItem?.changes.flatMap(c => c.amount));

      if (!singleItem)
        throw error(404, `Resource not found`);

      for (let i = singleItem.changes.length - 1; i >= 0; i--) {
        if (i === singleItem.changes.length - 1)
          singleItem.changes[i].running_total = singleItem.changes[i].amount;
        else
          singleItem.changes[i].running_total = singleItem.changes[i + 1].running_total + singleItem.changes[i].amount;
      }

    return { session, singleItem }
}) satisfies PageServerLoad;

export const actions = {

} satisfies Actions;