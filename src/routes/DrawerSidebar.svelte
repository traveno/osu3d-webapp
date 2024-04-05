<script lang="ts">
  import { dev } from "$app/environment";
  import { goto } from "$app/navigation";
  import Avatar from "$lib/components/Avatar.svelte";
  import SidebarButton from "$lib/components/SidebarButton.svelte";
  import { hasPermission, PermCategory, PermFlag } from "$lib/helpers";
  import type { UserPermissions, UserProfile } from "$lib/types/models";
  import type { Database } from '$lib/types/supabase';
  import type { SupabaseClient } from "@supabase/supabase-js";
  import { Box, PieChart, LogOut, Home, Cog, Play, Users, Wrench, Database as DBLucide } from "lucide-svelte";

  export let permissions: UserPermissions | null;
  export let supabase: SupabaseClient<Database>;
  export let profile: UserProfile | null = null;

  async function signOut() {
    await supabase.auth.signOut();
    goto('/');
  }

  const appVersion = __APP_VERSION__;
</script>

<div class="z-10 drawer-side">
  <label for="drawer-id" class="drawer-overlay"></label>
    <!-- <div class="w-12">
      <img src="/osu3d.svg" alt="Club logo" class="m-auto opacity-75">
    </div> -->
    <div class="min-h-screen px-4 w-52 bg-base-100 border-r border-base-content/25 flex flex-col justify-between py-4 gap-8">
      <div class="flex flex-col justify-start md:gap-2 gap-2">

        <div class="flex flex-col w-full justify-center items-center gap-4 py-4 select-none pointer-events-none">
          <Avatar supabase={supabase} url={profile?.avatar_url ?? null} />
          {#if profile?.full_name}
            <span class="text-sm font-light text-ellipsis whitespace-nowrap overflow-hidden w-full text-center">{ profile.full_name }</span>
          {/if}
        </div>

        <div class="flex justify-center items-center gap-2 py-2">
          <div class="grow h-[1px] w-full bg-base-content/25"></div>
          <div class="text-xs font-light opacity-50 whitespace-nowrap">OSU3D { appVersion }</div>
          <div class="grow h-[1px] w-full bg-base-content/25"></div>
        </div>

        <!-- Dashboard -->
        <SidebarButton name="Home" url="/dashboard">
          <span slot="icon"><Home /></span>
        </SidebarButton>
        <!-- Print -->
        <SidebarButton name="Print" url="/print">
          <span slot="icon"><Play /></span>
        </SidebarButton>
        <!-- Account Settings -->
        <SidebarButton name="Settings" url="/account">
          <span slot="icon"><Cog /></span>
        </SidebarButton>

        {#if hasPermission(permissions?.level, PermCategory.MACHINES, PermFlag.FIRST) || hasPermission(permissions?.level, PermCategory.INVENTORY, PermFlag.FIRST) || hasPermission(permissions?.level, PermCategory.MAINTENANCE, PermFlag.FIRST) && dev}
          <div class="flex justify-center items-center gap-2 py-2">
            <div class="grow h-[1px] w-full bg-base-content/25"></div>
            <div class="text-xs uppercase font-light opacity-50 whitespace-nowrap">Club Duties</div>
            <div class="grow h-[1px] w-full bg-base-content/25"></div>
          </div>
        {/if}

        <!-- Printers -->
        {#if hasPermission(permissions?.level, PermCategory.MACHINES, PermFlag.FIRST)}
        <SidebarButton name="Printers" url="/machines">
          <span slot="icon"><DBLucide /></span>
        </SidebarButton>
        {/if}

        <!-- Inventory -->
        {#if hasPermission(permissions?.level, PermCategory.INVENTORY, PermFlag.FIRST)}
        <SidebarButton name="Inventory" url="/inventory">
          <span slot="icon"><Box /></span>
        </SidebarButton>
        {/if}

        <!-- Maintenance -->
        {#if hasPermission(permissions?.level, PermCategory.MAINTENANCE, PermFlag.FIRST) && dev}
        <SidebarButton name="Maintenance" url="/maintenance">
          <span slot="icon"><Wrench /></span>
        </SidebarButton>
        {/if}

        

        {#if hasPermission(permissions?.level, PermCategory.USERS, PermFlag.FIRST)}
          <div class="flex justify-center items-center gap-2 py-2">
            <div class="grow h-[1px] w-full bg-base-content/25"></div>
            <div class="text-xs uppercase font-light opacity-50">Management</div>
            <div class="grow h-[1px] w-full bg-base-content/25"></div>
          </div>
        {/if}

        <!-- Members -->
        {#if hasPermission(permissions?.level, PermCategory.USERS, PermFlag.FIRST)}
        <SidebarButton name="Members" url="/users">
          <span slot="icon"><Users /></span>
        </SidebarButton>
        {/if}

        <!-- Reports -->
        {#if hasPermission(permissions?.level, PermCategory.SPECIAL, PermFlag.FIRST)}
        <div class="tooltip tooltip-bottom" data-tip="Coming Soon">
          <SidebarButton name="Reports" url="/reports" disabled>
            <span slot="icon"><PieChart /></span>
          </SidebarButton>
        </div>
        {/if}

      </div>

      <!-- Logout button -->
      <div class="group transition">
        <button on:click={() => signOut()} class="w-full btn btn-ghost flex justify-start items-center gap-4 p-3">
          <LogOut />
          <div>Logout</div>
        </button>
      </div>
      
    </div>
</div>