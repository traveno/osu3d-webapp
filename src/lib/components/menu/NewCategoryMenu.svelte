<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade, slide } from "svelte/transition";
	
  export let placement: string | null = null;
  const dispatch = createEventDispatcher();
  let name: string = '';
  let loading = false;

  function submit(ev: SubmitEvent) {
    if (name.length < 3) ev.preventDefault();
    else loading = true;
  }
</script>

<div class="min-w-full z-20 rounded-box bg-base-100 text-base-content transition gap-2">
  <form
    id="submit-new-category"
    method="post"
    action="?/submitNewCategory"
    on:submit={submit}
    class="flex { placement?.startsWith('top') ? 'flex-col-reverse' : 'flex-col' }"
  >
    <!-- Name -->
    <div class="form-control p-8">
      <!-- <label for="name" class="label"><span class="label-text text-base-content"></span></label> -->
      {#if loading}
        <div class="suspense" transition:fade />
      {/if}
      <label class="input flex items-center gap-2 input-bordered transition-opacity { loading ? 'opacity-0' : '' }">
        <input autofocus autocomplete="off" form="submit-new-category" type="text" name="name" class="grow" placeholder="Category name" bind:value={name} />
        <kbd class="kbd kbd-sm transition { name.length > 2 ? 'opacity-100' : 'opacity-50 scale-90' }">Enter</kbd>
      </label>
    </div>
  
    <div class="flex flex-row justify-center items-center gap-4 bg-error/10 text-error-content shadow-inner overflow-hidden { placement?.startsWith('top') ? 'rounded-t-box' : 'rounded-b-box' }">
      {#if name.length < 3}
        <div class="p-2 px-4 text-error text-sm" transition:slide>Must be more than two valid characters.</div>
      {/if}
      <!-- <button class="btn btn-sm btn-ghost font-light" on:click={() => dispatch('close')} type="button">Cancel</button>
      <button class="btn btn-sm btn-accent font-light { name.length > 2 ? '' : 'btn-disabled' }" form="submit-new-category" type="submit">Submit</button> -->
    </div>
  
  </form>
</div>