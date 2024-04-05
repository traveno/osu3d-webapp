<script lang="ts">
  import type { Announcement, UserProfile } from "$lib/types/models";
  import { formatDistanceToNow } from "date-fns";
  import { Megaphone } from "lucide-svelte";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  export let annsStream: Promise<Announcement[]>;
  export let profile: UserProfile | null;

  // I got really tired of typing out Announcements
  // Sorry for this horrible abbreviation
  let anns: Announcement[] | null = null;
  $: showBorder = anns?.some(a => new Date(a.created_at) > new Date(profile?.last_visit_at ?? 0)) ?? false;

  onMount(async () => {
    anns = await annsStream;
  });
</script>

<div class="col-span-4 lg:col-span-2 window { showBorder ? 'ring-1 ring-yellow-500/75' : '' }">

  <div class="window-header">
    <Megaphone />
    <span>Announcements</span>
    {#if showBorder}
      <span class="text-yellow-500 w-full text-end font-medium">NEW</span>
    {/if}
  </div>

  <div class="window-content flex flex-col gap-8 font-normal pb-2">
    {#if !anns}
      <div class="suspense" transition:fade></div>
    {:else if anns.length === 0}
      <p class="text-sm italic">
        No announcements. Check back later.
      </p>
    {:else}
      <!-- Again, sorry... -->
      {#each anns as a}
        <div class="relative p-4 rounded border border-base-content/50 border-b-0 border-dashed">
          <p class="text-sm italic">
            {a.body}
          </p>
          <div class="absolute left-0 bottom-0 w-full text-end whitespace-nowrap flex">
            <div class="grow rounded-l border-b border-base-content/50 border-dashed"></div>
            <div class="translate-y-1/2 px-2 font-extralight text-sm">{a.created_by.full_name}, {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}</div>
            <div class="w-4 rounded-r border-b border-base-content/50 border-dashed"></div>
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>
