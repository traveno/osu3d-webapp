
<script lang="ts">
  import type { PageData } from "./$types";
  import { PencilSquare, Plus } from "svelte-heros-v2";
  import InventoryTable from "$lib/components/tables/InventoryTable.svelte";
  import NewItemMenu from "$lib/components/menu/NewItemMenu.svelte";
  import PageHeader from "$lib/components/PageHeader.svelte";
  import NewCategoryMenu from "$lib/components/menu/NewCategoryMenu.svelte";
  import FloatingWindow from "$lib/components/menu/FloatingWindow.svelte";
  import { invCategories } from "$lib/state";
  
  export let data: PageData;
  let { inventory, categories } = data;

  $: $invCategories = categories;
</script>

<svelte:head>
  <title>Inventory | OSU 3D</title>
</svelte:head>

<div class="page">
  <PageHeader name="Inventory" />
  <div class="flex flex-row justify-end items-center gap-4">
    <div><a href="/inventory/tree" class="btn btn-primary btn-sm"><PencilSquare class="h-5 w-5" /> Locations</a></div>
    
    <FloatingWindow component={NewItemMenu}>
      <button slot="open" class="btn  btn-primary btn-sm"><Plus class="h-5 w-5" /> Item</button>
    </FloatingWindow>

    <FloatingWindow component={NewCategoryMenu}>
      <button slot="open" class="btn no-animation btn-primary btn-sm"><Plus class="h-5 w-5" /> Category</button>
    </FloatingWindow>

    <!-- <NewCategoryMenu><button class="btn btn-primary btn-sm"><Plus /> Category</button></NewCategoryMenu> -->
    
  </div>
  <InventoryTable title={'All Items'} inventory={inventory || []} allowSearch={true} />
  {#each categories || [] as category}
  <InventoryTable title={category.name} inventory={inventory.filter(i => i.inv_category_id === category.id)} />
  {/each}
</div>