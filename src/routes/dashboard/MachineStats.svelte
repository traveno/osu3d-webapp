<script lang="ts">
  import { MachineStatus, type DashboardMachine } from "$lib/types/models";
  import { Layers } from "lucide-svelte";

  export let vmStream: Promise<DashboardMachine[]>;

  let vm: DashboardMachine[] | null = null;

  $: if (vmStream) {
    vmStream.then(data => {
      vm = data;
    });
  }

  $: activeJobCount = vm?.filter(m => m.status === MachineStatus.WORKING).length;
  $: activeFaultCount = vm?.filter(m => m.status === MachineStatus.FAULT).length;
  $: activeIdleCount = vm?.filter(m => m.status === MachineStatus.IDLE).length;
</script>

{#if !vm}
  <div class="suspense"></div>
{:else}
<div class="col-span-4 lg:col-span-2 window min-w-full">
  <div class="window-header">
    <Layers />
    <span>Printer Status</span>
  </div>
  <div class="window-content flex justify-center items-center h-full w-full gap-8">

    <div class="flex flex-col gap-2 justify-start items-center">
      <div class="text-4xl font-thin">{ activeJobCount }</div>
      <div class="flex justify-center items-center gap-2 py-2 w-full">
        <div class="text-xs">Active</div>
      </div>
    </div>

    <div class="relative flex flex-col gap-2 justify-start items-center">
      <div class="text-4xl font-thin">{ activeIdleCount }</div>
      <div class="flex justify-center items-center gap-2 py-2 w-full">
        <div class="shrink text-xs">Idle</div>
      </div>
    </div>

    <div class="relative flex flex-col gap-2 justify-start items-center">
      <div class="text-4xl font-thin text-error">{ activeFaultCount }</div>
      <div class="flex justify-center items-center gap-2 py-2 w-full">
        <div class="shrink text-xs">Down</div>
      </div>
    </div>
    
  </div>
</div>
{/if}
