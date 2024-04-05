import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals: { getUserPermissions, getUserProfile, getAuthUser, getSession } }) => {
  return {
    authUser: await getAuthUser(),
    session: await getSession(),
    permissions: await getUserPermissions(),
    profile: await getUserProfile()
  }
}