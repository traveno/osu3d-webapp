<script lang="ts">
  import type { PageData } from "./$types";
  import { MachineStatus, type DashboardMachine } from "$lib/types/models";
  import CancelPrintModal from "$lib/components/modals/CancelPrintModal.svelte";
  import NewPrintModal from "$lib/components/modals/NewPrintModal.svelte";
  import NewIssueModal from "$lib/components/modals/NewIssueModal.svelte";
  import { fade, fly } from "svelte/transition";
  import { isTierCertified } from "$lib/helpers";
  import { ClipboardPen, Octagon, Tag, Brackets } from "lucide-svelte";
  import PageHeader from "$lib/components/PageHeader.svelte";
  import { printFilter } from "$lib/state";
  import { browser } from "$app/environment";
    
  export let data: PageData;
  const { permissions, routeData } = data;

  let filter: { status?: MachineStatus | null, tier?: number | null } = { status: null, tier: null };

  if (browser) {
    filter = $printFilter;
  }

  function setFilter(newFilter: { status?: MachineStatus | null, tier?: number | null }) {
    filter = { ... filter, ...newFilter };
    $printFilter = filter;
  }

  let cancelPrintModal: CancelPrintModal;
  let newPrintModal: NewPrintModal;
  let newIssueModal: NewIssueModal;

  $: certifiedMachines = routeData.filter(m => (m.status === filter.status || filter.status === null) && (m.tier === filter.tier || filter.tier === null))
    .sort((a, b) => {
      return a.tier - b.tier;
    });

  function getBackgroundStyles(machine: DashboardMachine) {
    switch (machine.status) {
      case MachineStatus.WORKING:
        return '!bg-info/20';
      case MachineStatus.FAULT:
        return '!bg-error/20';
      default:
        return '';
    }
  }

  function getStatus(machine: DashboardMachine) {
    switch (machine.status) {
      case MachineStatus.WORKING:
        return 'Busy'
      case MachineStatus.FAULT:
        return 'Issue';
      default:
        return `Tier ${machine.tier}`;
    }
  }

  function getStatusStyles(machine: DashboardMachine) {
    switch (machine.status) {
      case MachineStatus.WORKING:
        return 'text-info';
      case MachineStatus.FAULT:
        return 'text-error';
      default:
        return '';
    }
  }
</script>

<svelte:head>
  <title>Print | OSU 3D</title>
</svelte:head>

{#if routeData && permissions}
<div class="page">
  

    
  <div class="flex lg:flex-row lg:justify-between flex-col flex-wrap md:gap-12">
    <PageHeader name="Print" />
    <div class="flex md:gap-12 gap-4 flex-wrap">
      <div class="flex flex-col gap-2">
        <div>Tier</div>
        <!-- Buttons -->
        <div class="join join-horizontal">
          <input data-sveltekit-reload type="radio" name="options" aria-label="Tier 1" class="btn join-item" checked={filter.tier === 1} on:click={() => setFilter({ tier: 1 })} />
          <input data-sveltekit-reload type="radio" name="options" aria-label="Tier 2" class="btn join-item" checked={filter.tier === 2} on:click={() => setFilter({ tier: 2 })} />
          <input data-sveltekit-reload type="radio" name="options" aria-label="Tier 3" class="btn join-item" checked={filter.tier === 3} on:click={() => setFilter({ tier: 3 })} />
          <input data-sveltekit-reload type="radio" name="options" aria-label="Any" class="btn join-item" checked={filter.tier === null} on:click={() => setFilter({ tier: null })} />
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <div>Status</div>
        <!-- Buttons -->
        <div class="join join-horizontal">
          <input type="radio" name="options2" aria-label="Ready" class="btn join-item" checked={filter.status === MachineStatus.IDLE} on:click={() => setFilter({ status: MachineStatus.IDLE })} />
          <input type="radio" name="options2" aria-label="Busy" class="btn join-item" checked={filter.status === MachineStatus.WORKING} on:click={() => setFilter({ status: MachineStatus.WORKING })} />
          <input type="radio" name="options2" aria-label="Down" class="btn join-item" checked={filter.status === MachineStatus.FAULT} on:click={() => setFilter({ status: MachineStatus.FAULT })} />
          <input type="radio" name="options2" aria-label="Any" class="btn join-item" checked={filter.status === null} on:click={() => setFilter({ status: null })} />
        </div>
      </div>
    </div>
  </div>

  {#key filter}
    <div class="static grid grid-col-1 lg:grid-cols-2 xl:grid-cols-3 md:gap-12" in:fly={{ y: 10, delay: 500 }} out:fade={{ duration: 250 }}>
      {#if certifiedMachines.length === 0}
        <div class="col-span-4 flex flex-col justify-start items-center pt-16 gap-8 opacity-25">
          <Brackets class="w-24 h-24 stroke-1 animate-bounce" />
          <div class="text-3xl font-mono">No results</div>
        </div>
      {/if}
    
      {#each certifiedMachines as machine}
        <div class="col-span-1 window !p-0 {getBackgroundStyles(machine)}">
            <div class="flex flex-col gap-8 h-full w-full">
              <div class="flex flex-col grow gap-8 justify-start items-center">
                <div class="flex justify-between w-full border-b border-base-content/25">
                  <div class="p-4 flex items-center">
                    <div class="flex flex-col justify-center">
                      <span class="text-xl text-center font-semibold {getStatusStyles(machine)}">{getStatus(machine)}</span>
                    </div>
                  </div>
                  <div class="text-xl p-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-full {getStatusStyles(machine)}">{machine.nickname}</div>
    
                </div>
                <div class="aspect-square flex flex-col justify-center {machine.status === MachineStatus.FAULT ? 'opacity-25' : ''}">
                  <img alt="Printer" src="/{machine.model}.png" class="h-36 w-36 md:h-48 md:w-48" />
                </div>
              </div>
              <!-- Buttons -->
              <div class="relative join join-horizontal rounded-t-none rounded-box w-full border-t border-base-content/25 overflow-hidden">
                <button class="basis-1/3 grow h-full btn px-2 join-item !ml-0 border-none btn-primary" disabled={machine.status !== MachineStatus.IDLE || !isTierCertified(permissions, machine.tier)} on:click={() => newPrintModal.launchModal(machine)}>
                  <div class="my-2 gap-2 items-center justify-center flex flex-col">
                    <ClipboardPen /><div>Log</div>
                  </div>
                </button>
                <button class="basis-1/3 grow h-full btn px-2 join-item !ml-0 border-0 btn-secondary" disabled={machine.status !== MachineStatus.WORKING || !isTierCertified(permissions, machine.tier)} on:click={() => cancelPrintModal.launchModal(machine)}>
                  <div class="my-2 gap-2 items-center justify-center flex flex-col">
                    <Octagon /><div>Stop</div>
                  </div>
                </button>
                <button class="basis-1/3 grow h-full btn px-2 join-item !ml-0 border-0 btn-accent" disabled={machine.status === MachineStatus.FAULT || !isTierCertified(permissions, machine.tier)} on:click={() => newIssueModal.launchModal(machine)}>
                  <div class="my-2 gap-2 items-center justify-center flex flex-col">
                    <Tag /><div>Issue</div>
                  </div>
                </button>
                {#if !isTierCertified(permissions, machine.tier)}
                  <div class="absolute inset-0 flex justify-center items-center left-[1px] bg-gradient-to-t from-warning/75 to-warning/50 rounded-b-box">
                    <div class="text-warning-content text-xl">Certification Required</div>
                  </div>
                {/if}
              </div>
            </div>
        </div>
      {/each}
    
    </div>
  {/key}

</div>
{/if}

<CancelPrintModal bind:this={cancelPrintModal} />
<NewPrintModal bind:this={newPrintModal} />
<NewIssueModal bind:this={newIssueModal} />