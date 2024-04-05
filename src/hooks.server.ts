import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, PUBLIC_DEV_SUPABASE_ANON_KEY, PUBLIC_DEV_SUPABASE_URL } from '$env/static/public';
import type { Database } from '$lib/types/supabase.js';
import type { Handle } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';
import { dev } from '$app/environment';
import type { UserPermissions } from '$lib/types/models';
import type { Session } from '@supabase/supabase-js';

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient<Database>(
    dev ? PUBLIC_DEV_SUPABASE_URL : PUBLIC_SUPABASE_URL,
    dev ? PUBLIC_DEV_SUPABASE_ANON_KEY : PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get: (key) => event.cookies.get(key),
      set: (key, value, options) => {
        event.cookies.set(key, value, { ...options, path: '/' });
      },
      remove: (key, options) => {
        event.cookies.delete(key, { ...options, path: '/' });
      }
    }
  });
  
  /**
   * Unlike `supabase.auth.getSession`, which is unsafe on the server because it
   * doesn't validate the JWT, this function validates the JWT by first calling
   * `getUser` and aborts early if the JWT signature is invalid.
   */
  event.locals.getAuthUser = async () => {
    const {
      data: { user },
      error,
    } = await event.locals.supabase.auth.getUser();
    if (error) return null;
    return user;
  }

  event.locals.getSession = async () => {
    const {
      data: { user },
      error,
    } = await event.locals.supabase.auth.getUser();
    if (error) return null;

    const {
      data: { session }
    } = await event.locals.supabase.auth.getSession();
    return { user } as Session;
  }


  event.locals.getUserPermissions = async () => {
    const session = await event.locals.getSession();
    if (!session?.user?.id) return null;

    const { data: userLevel } = await event.locals.supabase.from('user_levels')
      .select('*')
      .eq('user_id', session?.user.id)
      .maybeSingle<UserPermissions>();

    return userLevel;
  }

  event.locals.getUserProfile = async () => {
    const session = await event.locals.getSession();
    if (!session?.user?.id) return null;

    const { data: profile } = await event.locals.supabase.from('profiles')
      .select('*')
      .eq('user_id', session?.user.id)
      .maybeSingle();

    return profile;
  }

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range';
    }
  });
};