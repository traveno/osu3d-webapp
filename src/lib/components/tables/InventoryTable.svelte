<script lang="ts">
	import { goto } from "$app/navigation";
	import { totalAllChanges, type InventoryItem, getMostRecentChangeDateName, type InventoryCategory } from "$lib/types/models";
	import Paginate from "$lib/utilities/Paginate.svelte";
	import { Minus, Plus } from "svelte-heros-v2";
	import NewChangeMenu from "../menu/NewChangeMenu.svelte";

  export let inventory: InventoryItem[] = [];
  export let title: string = 'Untitled';

  let filterText = '';

  export let allowSearch = false;

  let lowerIndex: number = 0;
  let upperIndex: number = 0;
</script>

<!-- Inventory table -->
<div class="flex flex-col gap-4">
  <div class="flex flex-row justify-start items-center">
      <div class="font-thin text-xl md:text-2xl">{title}</div>
      <div class="divider divider-horizontal"></div>
      
      
      {#if allowSearch}
      <div>{inventory.length} Entries</div>
      <div class="divider divider-horizontal"></div>
      <div class="grow relative">
        <input class="input input-sm w-full" type="text" placeholder="Filter by name..." bind:value={filterText} />
        <button class="btn btn-sm btn-ghost hover:bg-transparent absolute right-0 opacity-50" on:click={() => filterText = ''}>Clear</button>
      </div>
      <div class="divider divider-horizontal"></div>
      {:else}
      <div class="grow">{inventory.length} Entries</div>
      {/if}

      <Paginate totalRows={inventory.length} bind:lowerIndex bind:upperIndex />
  </div>
  
  <div class="window overflow-x-auto whitespace-nowrap">
    <table class="table">
        <thead>
            <tr>
                <th>Name</th>
                <th>In Stock</th>
                <th>Lower Threshold</th>
                <th>Last Updated</th>
                <th>Last Updated By</th>
                <th class="text-end">Actions</th>
            </tr>
        </thead>
        <tbody>
            {#each inventory || [] as item}
            <tr>
                <td>
                    {item.name}
                </td>
                <td>{item.current_stock}</td>
                <td>
                  {item.minimum}
                </td>
                <td>
                  {getMostRecentChangeDateName(item.changes).date}
                </td>
                <td>
                  {getMostRecentChangeDateName(item.changes).name}
                </td>
                <td class="flex flex-row justify-end gap-2">
                  <NewChangeMenu mode={'add'} itemId={item.id}><button class="btn btn-sm btn-success"><Plus /></button></NewChangeMenu>
                  <NewChangeMenu mode={'subtract'} itemId={item.id}><button class="btn btn-sm btn-error"><Minus /></button></NewChangeMenu>
                  <div class="divider divider-horizontal m-0"></div>
                  <!-- <button class="btn btn-sm btn-primary" on:click={() => goto(`/inventory/${item.id}`)}>Inv</button> -->
                  <button class="btn btn-sm btn-primary" on:click={() => goto(`/inventory/${item.id}`)}>View</button>
                </td>
            </tr>
            {/each}
        </tbody>
    </table>
  </div>
</div>