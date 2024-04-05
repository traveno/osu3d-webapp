import type { Announcement, DashboardMachine, Machine } from "$lib/types/models";
import type { Database } from "$lib/types/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";
import { error } from "@sveltejs/kit";

export const fetchAllMachines = async (supabase: SupabaseClient<Database>) => {
  const result = await supabase
    .from('machines_view')
    .select(`
      *,
      machine_def: machine_defs_id (*),
      prints: prints_view (
        *,
        created_by: created_by_user_id (*)
      ),
      events: machine_events (
        *,
        created_by: created_by_user_id (*),
        resolved_by: resolved_by_user_id (*)
      )
    `)

    .returns<Machine[]>();

  if (result.error)
    throw error(result.status, result.error.message);

  return result.data;
}

export const fetchDashboardRouteData = async (supabase: SupabaseClient<Database>) => {
  const result = await supabase
    .from('dashboard_view')
    .select(`
      *
    `)
    .returns<DashboardMachine[]>();

  if (result.error)
    throw error(result.status, result.error.message);

  return result.data;
}

export const fetchAnnouncements = async (supabase: SupabaseClient<Database>) => {
  const result = await supabase.from('announcements')
    .select(`
      *,
      created_by: profiles(*)
    `)
    .order('created_at', { ascending: false })
    .limit(2)
    .returns<Announcement[]>();

  if (result.error)
    throw error(result.status, result.error.message);

  if (!result.data)
    throw error(404, 'Resource not found');

  return result.data;
}

export const fetchOneMachine = async (supabase: SupabaseClient<Database>, id: string) => {
  const result = await supabase
    .from('machines_view')
    .select(`
      *,
      machine_def: machine_defs_id (*),
      prints: prints_view (
        *,
        created_by: created_by_user_id (*)
      ),
      events: machine_events (
        *,
        created_by: created_by_user_id (*),
        resolved_by: resolved_by_user_id (*)
      )
    `)
    .eq('id', id)
    .order('created_at', { foreignTable: 'prints_view', ascending: false })
    .order('created_at', { foreignTable: 'machine_events', ascending: false })
    .returns<Machine[]>().maybeSingle();

  if (result.error)
    throw error(result.status, result.error.message);

  if (!result.data)
    throw error(404, 'Resource not found');

  return result.data;
}

export const fetchOneProfile = async (supabase: SupabaseClient<Database>, user_id: string) => {
  const result = await supabase
    .from('profiles')
    .select(`*`)
    .eq('user_id', user_id)
    .maybeSingle();

  if (result.error)
    throw error(result.status, result.error.message);

  if (!result.data)
    throw error(404, 'Resource not found');

  return result.data;
}