<script lang="ts">
	import { goto } from "$app/navigation";
	import { getMachineStatus, type Machine, machineStatusToText, MachineStatus, getTimeSinceLastCompletePrintJob } from "$lib/types/models";
	import Paginate from "$lib/utilities/Paginate.svelte";
	import { ExclamationCircle } from "svelte-heros-v2";

    export let machines: Machine[] = [];
    export let tier: number;

    let lowerIndex: number = 0;
    let upperIndex: number = 0;

    function getRowColor(status: MachineStatus) {
      switch (status) {
        case MachineStatus.UNKNOWN:
        case MachineStatus.IDLE:
          return '';
        case MachineStatus.FAULT:
          return 'text-error';
        case MachineStatus.WORKING:
          return 'text-info';
      }
    }
</script>

<!-- Machines table -->
<div class="flex flex-col space-y-4">
    <div class="flex flex-row justify-start items-center window-header">
        <div class="font-thin text-xl md:text-2xl">Tier {tier}</div>
        <div class="divider divider-horizontal hidden md:flex"></div>
        <div class="grow hidden md:flex">{machines.length} Entries</div>
        <div class="grow md:hidden"></div>
        <Paginate totalRows={machines.length} bind:lowerIndex bind:upperIndex />
    </div>
    
    <div class="window !p-0">
      <table class="table">
          <thead>
              <tr>
                  <th>Status</th>
                  <th>Nickname</th>
                  <th>Type</th>
                  <th class="hidden md:table-cell">Latest Job</th>
              </tr>
          </thead>
          <tbody>
              {#each machines || [] as machine}
              <tr class="hover cursor-pointer {getRowColor(getMachineStatus(machine))}" on:click={() => goto(`/machines/${machine.id}`)} >
                  <td>
                      {#if getMachineStatus(machine) === MachineStatus.FAULT}
                      <ExclamationCircle />
                      {:else}
                      {machineStatusToText(getMachineStatus(machine))}
                      {/if}
                  </td>
                  <td>{machine.nickname}</td>
                  <td>{machine.machine_def.make} {machine.machine_def.model}</td>
                  <td class="hidden md:table-cell">{getTimeSinceLastCompletePrintJob(machine)}</td>
                  <!-- <td>
                      <button class="btn btn-square btn-ghost focus:outline-none">
                          <Bars3></Bars3>
                      </button>
                  </td> -->
              </tr>
              {/each}
          </tbody>
      </table>
    </div>
</div>