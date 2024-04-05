<script lang="ts">
	import { getDateAndTime } from "$lib/helpers";
	import type { Enums, Print } from "$lib/types/models";
	import Paginate from "$lib/utilities/Paginate.svelte";

    export let prints: Print[] = [];
    let lowerIndex: number = 0;
    let upperIndex: number = 0;

    function getStatusColor(status: Enums<'print_status'>) {
      switch (status) {
        case 'CANCELED':
          return 'bg-base-300/75 text-base-content';
        case 'WORKING':
          return 'bg-warning/75 text-warning-content';
        case 'SUCCESS':
          return 'bg-success/75 text-success-content';
        case 'FAULT':
          return 'bg-error/75 text-error-content';
      }
    }
</script>

<!-- Fault table -->
<div class="flex flex-col space-y-4">
    <div class="flex flex-row justify-start items-center window-header">
        <div class="font-thin text-xl md:text-2xl">Print Log</div>
        <div class="divider divider-horizontal hidden md:flex"></div>
        <div class="grow"><span class="hidden md:inline">{prints.length} Entries</span></div>
        <Paginate totalRows={prints.length} bind:lowerIndex bind:upperIndex />
    </div>
    {#if lowerIndex !== undefined && upperIndex !== undefined}
    <div class="window overflow-x-auto whitespace-nowrap">
      <table class="table">
          <thead>
              <tr>
                  <th></th>
                  <th>Date</th>
                  <th>Created By</th>
                  <th>Hours</th>
                  <th>Consumed</th>
                  <th>Status</th>
                  <!-- <th>Canceled By</th>
                  <th>Canceled At</th> -->
              </tr>
          </thead>
          <tbody>
              {#each prints.slice(lowerIndex, upperIndex) as print, i}
                  <tr>
                      <td><input type="checkbox" class="checkbox checkbox-accent disabled:bg-opacity-25" disabled /></td>
                      <td><span class="hidden md:inline">{getDateAndTime(print.created_at, true)}</span><span class="md:hidden">{getDateAndTime(print.created_at, false)}</span></td>
                      <td>{print.created_by.full_name}</td>
                      <td>
                          {((new Date(print.done_at).getTime() - new Date(print.created_at).getTime()) / 1000 / 60 / 60).toFixed(2)}
                      </td>
                      <td>{print.filament}g</td>
                      <td><code class="p-1 rounded-lg min-w-full uppercase {getStatusColor(print.status)}">{print.status}</code></td>
                      <!-- <td>{print.full_name ?? '—'}</td> -->
                      <!-- <td>{getDateAndTime(print.canceled_at, true)}</td> -->
                  </tr>
              {/each}
          </tbody>
      </table>
    </div>
    {/if}
</div>