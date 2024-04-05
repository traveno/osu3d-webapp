<script lang="ts">
  import { invCategories } from "$lib/state";
	import { createEventDispatcher } from "svelte";
	import { slide } from "svelte/transition";

  export let placement: string | null = null;
  $: categories = $invCategories;
  const dispatch = createEventDispatcher();

  let loading = false;

  let category: string;
  let name: string;
  let threshold: number;

  function submit(ev: SubmitEvent) {
    ev.preventDefault();
  }
</script>



<div class="min-w-full z-20 rounded-box bg-base-100 text-base-content transition gap-2">
  <form
    id="submit-new-item"
    method="post"
    action="?/submitNewItem"
    on:submit={submit}
    class="flex flex-col gap-4 pt-4"
  >

    <!-- Name -->
    <div class="form-control px-8">
      <label for="inv_category_id" class="label"><span class="label-text text-base-content">Category</span></label>
      <select form="submit-new-item" name="inv_category_id" class="select select-bordered" placeholder="Category" bind:value={category}>
        {#each categories as category}
        <option value={category.id}>{category.name}</option>
        {/each}
      </select>
    </div>

    <!-- Name -->
    <div class="form-control px-8">
      <label for="name" class="label"><span class="label-text text-base-content">Name</span></label>
      <label class="input flex items-center gap-2 input-bordered transition-opacity { loading ? 'opacity-0' : '' }">
        <input autocomplete="off" form="submit-new-item" type="text" name="name" class="grow" placeholder="Item name" bind:value={name} />
      </label>
    </div>

    <!-- Threshold -->
    <div class="form-control px-8 pb-4">
      <label for="minimum" class="label"><span class="label-text text-base-content">Alert Threshold (optional)</span></label>
      <label class="input flex items-center gap-2 input-bordered transition-opacity { loading ? 'opacity-0' : '' }">
        <input autocomplete="off" form="submit-new-item" type="number" name="minimum" class="grow" placeholder="Min. threshold" bind:value={threshold} />
      </label>
    </div>
  
    <div class="flex flex-row justify-end items-center gap-4 bg-error/10 text-error-content shadow-inner overflow-hidden p-2 { placement?.startsWith('top') ? 'rounded-t-box' : 'rounded-b-box' }">
      <!-- <div class="p-2 px-4 text-error text-sm" transition:slide>Must be more than two valid characters.</div> -->
      <button class="btn btn-sm btn-ghost font-light" on:click={() => dispatch('close')} type="button">Cancel</button>
      <button class="btn btn-sm btn-accent font-light" form="submit-new-item" type="submit">Submit</button>
    </div>
  
  </form>
</div>