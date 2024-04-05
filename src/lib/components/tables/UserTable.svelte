<script lang="ts">
  import { goto } from "$app/navigation";
  import { PermCategory, PermFlag, getDateAndTime, hasPermission } from "$lib/helpers";
  import type { UserPermissions } from "$lib/types/models";
  import Paginate from "$lib/utilities/Paginate.svelte";
  import { ChevronDown } from "svelte-heros-v2";
  
  export let userLevels: (UserPermissions & { checked: boolean, previousLevel: number })[];
  
  let filterText = '';
  $: filteredUsers = filterText.trim() !== '' ? userLevels.filter(u => u.full_name?.toLowerCase().includes(filterText.toLowerCase().trim()) || u.email?.toLowerCase().includes(filterText.toLowerCase().trim())) : userLevels;
  
  let lowerIndex: number = 0;
  let upperIndex: number = 0;
</script>

<div class="flex flex-col gap-12">
  <div class="block lg:hidden grow relative lg:mx-0">
    <input class="input input-bordered w-full" type="text" placeholder="Search..." bind:value={filterText} />
    <button class="btn btn-sm btn-ghost hover:bg-transparent absolute right-0 top-2 opacity-50" on:click={() => filterText = ''}>Clear</button>
  </div>
  <!-- Users table -->
  <div class="flex flex-col gap-4">
    <div class="flex flex-row justify-start items-center px-4 lg:px-0">
      <div class="font-thin text-xl md:text-2xl">User Accounts</div>
      <div class="hidden lg:flex divider divider-horizontal"></div>
      <div class="hidden lg:block">{userLevels.length} Entries</div>
      <div class="hidden lg:flex divider divider-horizontal"></div>
      <div class="hidden lg:block grow relative">
        <input class="input input-bordered input-sm w-full" type="text" placeholder="Search..." bind:value={filterText} />
        <button class="btn btn-sm btn-ghost hover:bg-transparent absolute right-0 opacity-50" on:click={() => filterText = ''}>Clear</button>
      </div>
      <div class="hidden lg:flex divider divider-horizontal"></div>
      <div class="grow lg:hidden"></div>
      <Paginate pageSize={20} totalRows={filteredUsers.length} bind:lowerIndex bind:upperIndex />
    </div>
    {#if lowerIndex !== undefined && upperIndex !== undefined}
    <div class="window overflow-x-auto whitespace-nowrap">
      <table class="table">
        <thead>
          <tr>
            <th></th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Joined On <ChevronDown class="inline" size={'16px'} /></th>
            <th>Permission Flags</th>
          </tr>
        </thead>
        <tbody>
          {#each filteredUsers.slice(lowerIndex, upperIndex) as user, index}
          <tr class="transition {user.checked ? 'bg-success text-success-content' : ''}">
            <td class="grid-cols-3 gap-1 w-52 grid">
              {#if hasPermission(user.level, PermCategory.TIER_3, PermFlag.FIRST)}
                <span class="px-1 py-1 font-mono bg-error text-error-content rounded-sm text-xs">TR 3</span>
              {/if}
              {#if hasPermission(user.level, PermCategory.TIER_2, PermFlag.FIRST)}
                <span class="px-1 py-1 font-mono bg-warning text-warning-content rounded-sm text-xs">TR 2</span>
              {/if}
              {#if hasPermission(user.level, PermCategory.TIER_1, PermFlag.FIRST)}
                <span class="px-1 py-1 font-mono bg-info text-info-content rounded-sm text-xs">TR 1</span>
              {/if}
              {#if hasPermission(user.level, PermCategory.INVENTORY, PermFlag.FIRST)}
                <span class="px-1 py-1 font-mono bg-primary text-primary-content rounded-sm text-xs">INVEN.</span>
              {/if}
              {#if hasPermission(user.level, PermCategory.MAINTENANCE, PermFlag.FIRST)}
                <span class="px-1 py-1 font-mono bg-primary text-primary-content rounded-sm text-xs">MAINT.</span>
              {/if}
              {#if hasPermission(user.level, PermCategory.MACHINES, PermFlag.FIRST)}
                <span class="px-1 py-1 font-mono bg-primary text-primary-content rounded-sm text-xs">PRINT.</span>
              {/if}
              {#if hasPermission(user.level, PermCategory.SPECIAL, PermFlag.FIRST)}
                <span class="px-1 py-1 font-mono bg-secondary text-secondary-content rounded-sm text-xs">ADMIN.</span>
              {/if}
            </td>
            <td>{user.full_name}</td>
            <td>{user.email}</td>
            <td>{getDateAndTime(user.created_at, true)}</td>
            <td>
              <button class="btn btn-sm btn-primary" on:click={() => goto(`/users/${user.user_id}`)} disabled={hasPermission(user.level, PermCategory.SPECIAL, PermFlag.FIRST)}>Edit</button>
            </td>
          </tr>
          {/each}
        </tbody>
      </table>
    </div>
    {/if}
  </div>
</div>