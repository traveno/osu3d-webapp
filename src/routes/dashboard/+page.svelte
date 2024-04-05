<script lang="ts">
  import type { PageData } from "./$types";
  import { Bot, GraduationCap, Locate, MessageCircle, Play, Star } from "lucide-svelte";
  import { MachineStatus } from "$lib/types/models";
  import { formatDistanceToNowStrict } from "date-fns";
  import CancelPrintModal from "$lib/components/modals/CancelPrintModal.svelte";
  import MachineStats from "./MachineStats.svelte";
  import PageHeader from "$lib/components/PageHeader.svelte";
  import Announcements from "./Announcements.svelte";
  
  export let data: PageData;
  const { permissions, session, profile, annsStream, vmStream } = data;

  let cancelPrintModal: CancelPrintModal;

  $: activeJobs = vmStream.then(data => data.filter(m => m.status === MachineStatus.WORKING && m.print_user_id === session?.user.id));
</script>

<svelte:head>
  <title>Dashboard | OSU 3D</title>
</svelte:head>


<div class="page">

  <PageHeader name="Hi { (session?.user.user_metadata.full_name).split(' ')[0] }" />

  <div class="grid grid-cols-4 md:gap-12">

    <!-- Announcements -->
    <Announcements {annsStream} {profile} />

    <!-- Josef -->
    <div class="col-span-4 lg:col-span-2 window">
      <div class="window-header">
        <Bot />
        <span>Josef the Discord Bot</span>
      </div>
      <div class="window-content flex flex-col gap-2 text-sm">
        {#if profile?.discord}
          <p>
            You haven't added your Discord username yet. Consider adding it in the <a href="/account" class="link link-warning">Settings page</a>. You will get notifications
            about your prints, and your Discord roles will reflect your tier certification level.
          </p>
        {:else}
          <p>
            You've already added your Discord username in the Settings page. Great!
          </p>
        {/if}
      </div>
    </div>

    <!-- My Jobs -->
    {#await activeJobs then jobs}
    {#if jobs.length > 0}
      <div class="col-span-4 lg:col-span-4 window">

        <div class="window-header">
          <Star />
          <span>My Jobs</span>
        </div>

        <div class="window-content flex gap-8 md:flex-row flex-col">
          {#each jobs as job}
            <div class="flex md:flex-col flex-row justify-around md:justify-center items-center gap-4">
              <div class="flex flex-col items-center">
                <div class="text-sm font-extralight">{job.nickname}</div>
                {#if job.done_at}
                  <div class="text-xs font-light opacity-50">{formatDistanceToNowStrict(new Date(job.done_at))} remain</div>
                {/if}
              </div>
              <img alt="Printer" src="/{job.model}.png" class="hidden md:block max-h-28" />
              
              <button class="btn btn-ghost md:btn-sm"
                on:click={() => cancelPrintModal.launchModal(job)}
              >
                <div class="flex justify-center items-center gap-1">
                  <!-- <Ban size={16} /> -->
                  <div class="text-xs font-normal">Cancel</div>
                </div>
              </button>
            </div>
          {/each}
        </div>
      </div>
    {/if}
    {/await}
    
    

    <div class="col-span-4 lg:col-span-2 window">
      <div class="window-header">
        <Locate />
        <div>Quickstart</div>
      </div>
      <div class="window-content flex justify-center items-center h-full">
        <a href="/print" class="btn btn-xs btn-link h-fit">
          <div class="flex flex-col justify-center items-center gap-2">
            <Play strokeWidth={1.5} class="h-6 w-6" />
            <div>Start Print</div>
          </div>
        </a>
        <!-- <a href="/" class="btn btn-ghost btn-disabled ring-1 ring-white/10 h-fit p-4 bg-white/10">
          <div class="flex flex-col justify-center items-center gap-4">
            <BarChart3 strokeWidth={1.5} class="h-8" />
            <div>My Stats</div>
          </div>
        </a> -->
        <a href="https://canvas.oregonstate.edu/courses/1877606" target="_blank" class="btn btn-xs btn-link h-fit">
          <div class="flex flex-col justify-center items-center gap-2">
            <GraduationCap strokeWidth={1.5} class="h-6 w-6" />
            <div>Club Canvas</div>
          </div>
        </a>
        <a href="https://discord.gg/CUrEfbWPHy" target="_blank" class="btn btn-xs btn-link h-fit">
          <div class="flex flex-col justify-center items-center gap-2">
            <MessageCircle strokeWidth={1.5} class="h-6 w-6" />
            <div>Club Discord</div>
          </div>
        </a>
      </div>
    </div>

    <!-- Overall machine stats -->
    <MachineStats {vmStream} />

  </div>
</div>


<CancelPrintModal bind:this={cancelPrintModal} />