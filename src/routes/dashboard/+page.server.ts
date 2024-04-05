import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { fetchAnnouncements, fetchDashboardRouteData } from '$lib/server/machine';

export const load = (async ({ locals: { supabase, getSession } }) => {
  const session = await getSession();
  if (!session) throw redirect(303, '/');

  setTimeout(async () => {
    // Update last visit date
    await supabase.from('profiles')
      .update({
        last_visit_at: new Date().toISOString()
      })
      .eq('user_id', session.user.id);
  }, 1000);

  return {
    session,
    annsStream: fetchAnnouncements(supabase),
    vmStream: fetchDashboardRouteData(supabase)
  };
}) satisfies PageServerLoad;

export const actions = {
  reportFault: async ({ request, locals: { supabase, getAuthUser } }) => {
    const authUser = await getAuthUser();
    const formData = await request.formData();

    const description = formData.get('description') as string;
    const machine_id = formData.get('machine_id') as string;
    const print_id = formData.get('print_id') as string;
    const created_by_user_id = authUser?.id;

    if (description === '' || !created_by_user_id) return;

    const result = await supabase
      .from('machine_events')
      .insert({
        event_type: 'FAULT',
        created_by_user_id,
        resolved: false,
        machine_id,
        description,
        print_id: print_id || null
      });

    if (result.error)
      throw error(result.status, result.error.message);
  },
  addPrintLog: async ({ request, locals: { supabase, getAuthUser } }) => {
    const authUser = await getAuthUser();
    const formData = await request.formData();

    const machine_id = formData.get('machine_id') as string;
    const printLogHours = Number(formData.get('hours') as string);
    const printLogGrams = Number(formData.get('grams') as string);
    const created_by_user_id = authUser?.id;

    if (printLogHours === 0 || printLogGrams === 0 || !created_by_user_id) return;

    const finishedDate = new Date(Date.now() + 1000 * 60 * 60 * printLogHours);

    await supabase.from('prints').insert({
      created_by_user_id,
      machine_id: machine_id,
      done_at: finishedDate.toISOString(),
      filament: printLogGrams
    });
  },
  cancelPrintLog: async ({ request, locals: { supabase, getAuthUser } }) => {
    const authUser = await getAuthUser();
    const formData = await request.formData();

    const print_id = formData.get('print_id') as string | null;
    const machine_id = formData.get('machine_id') as string | null;

    const created_by_user_id = authUser?.id;

    if (!print_id || !machine_id || !created_by_user_id) return;

    // Prevent someone from canceling if it's already been canceled
    const { data: safetyCheck } = await supabase.from('prints_view').select('*').eq('id', print_id).maybeSingle();

    if (safetyCheck?.status === 'CANCELED') return;

    await supabase
      .from('machine_events')
      .insert({
        event_type: 'STOP',
        created_by_user_id,
        resolved: true,
        machine_id,
        print_id
      });
  }
} satisfies Actions;
