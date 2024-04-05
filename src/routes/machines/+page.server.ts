import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { fetchAllMachines } from "$lib/server/machine";
import { PermCategory, PermFlag, hasPermission } from "$lib/helpers";

export const load = (async ({ locals: { supabase, getSession, getUserPermissions: getPermissions } }) => {
  const session = await getSession();
  const permissions = await getPermissions();
  
  if (!session || !hasPermission(permissions?.level, PermCategory.MACHINES, PermFlag.FIRST))
    throw redirect(303, '/');

  const machines = await fetchAllMachines(supabase);

  return { session, machines }
}) satisfies PageServerLoad;