<script lang="ts">
  import { enhance } from "$app/forms";
	import type { DashboardMachine, Machine } from "$lib/types/models";

  let machineToLog: DashboardMachine | null = null;
  let modalVisible = false;

  export function launchModal(machine: DashboardMachine | null) {
    if (machine === null)
      return;

    machineToLog = machine;
    modalVisible = true;
  }
</script>

<input type="checkbox" id="print-log-modal" class="modal-toggle" bind:checked={modalVisible} />
{#if machineToLog}
<div class="modal">
  <div class="modal-box w-screen md:max-w-lg max-w-full h-screen md:h-fit max-h-screen rounded-none md:rounded-xl">
    <form method="POST" action="?/addPrintLog">
      <!-- Modal Title -->
      <h3 class="font-bold text-lg">Start a print on {machineToLog?.nickname}</h3>
        <!-- Machine ID  -->
        <input name="machine_id" type="hidden" class="input input-bordered w-full input-disabled" value={machineToLog.machine_id} />

        <!-- Print Hours -->
        <div class="form-control">
          <label class="label" for="hours">
            <span class="label-text">How long is the print? (hours)</span>
          </label>
          <input name="hours" type="number" placeholder="1" min="0" max="168" step="0.01" class="input input-bordered w-full" />
        </div>
        <!-- Print Grams -->
        <div class="form-control">
            <label class="label" for="grams">
              <span class="label-text">How much filament will be used? (grams)</span>
            </label>
            <input name="grams" type="number" placeholder="100" class="input input-bordered w-full" />
          </div>
      <!-- Modal Actions -->
      <div class="modal-action">
        <button type="button" class="btn" on:click={() => modalVisible = false}>Cancel</button>
        <input type="submit" class="btn btn-warning" value="Submit" />
      </div>
    </form>
  </div>
</div>
{/if}