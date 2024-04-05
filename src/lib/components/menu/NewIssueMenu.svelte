<script lang="ts">
	import { arrow, createFloatingActions } from "svelte-floating-ui";
	import { detectOverflow, offset, shift } from "svelte-floating-ui/core";
	import { writable } from "svelte/store";
	import { fade, fly } from "svelte/transition";

  let showTooltip = false;

  const middleware = {
    name: 'middleware',
    async fn(state: any) {
      const overflow = await detectOverflow(state);
      return {};
    },
  };

  const arrowRef = writable<HTMLElement>();

  const [floatingRef, floatingContent] = createFloatingActions({
    strategy: 'absolute',
    placement: 'left-start',
    middleware: [
      offset({ crossAxis: -15, mainAxis: 35 }),
      arrow({ element: arrowRef }),
      middleware
    ],
    onComputed({ placement, middlewareData }) {
      const { x, y } = middlewareData.arrow!;
      const staticSide = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right'
      }[placement.split('-')[0]];

      Object.assign($arrowRef.style, {
        left: x != null ? `${x}px` : '',
        top: y != null ? `${y}px` : '',
        [staticSide!]: '-25px'
      });
    }
  });
</script>

<button use:floatingRef on:click={() => showTooltip = !showTooltip} class="{showTooltip ? 'z-20' : 'z-0'}">
  <slot />
</button>

{#if showTooltip}
<div class="fixed  z-20" use:floatingContent>
  <div class="lg:hidden flex w-80 rounded-2xl bg-warning text-error-content p-4 transition flex-col gap-2" transition:fly={{ x: -25, duration: 200 }}>

    <!-- Arrow -->
    <div class="absolute fill-error rotate-90" bind:this={$arrowRef}>
      <svg viewBox="0 0 20 20" width="25" height="25">
        <path stroke="none" d="M0 20C0 20 2.06906 19.9829 5.91817 15.4092C7.49986 13.5236 8.97939 12.3809 10.0002 12.3809C11.0202 12.3809 12.481 13.6451 14.0814 15.5472C17.952 20.1437 20 20 20 20H0Z"></path>
      </svg>
    </div>

    <form
      id="submit-new-item"
			method="post"
			action="?/submitNewItem" />

    <!-- Description -->
    <div class="form-control w-full max-w-xs">
      <label for="description" class="label"><span class="label-text font-light">Description (required)</span></label>
      <textarea name="description" class="input" rows="4" />
    </div>

    <div class="flex flex-row justify-end gap-4 mt-4">
      <button class="btn btn-sm btn-neutral font-light" form="submit-new-item" type="submit">Submit</button>
      <button class="btn btn-sm btn-outline font-light" on:click={() => showTooltip = false}>Cancel</button>
    </div>
  </div>

  <div class="hidden lg:flex w-80 rounded-2xl bg-warning text-error-content p-4 transition flex-col gap-2">
    hello
  </div>
</div>

<button class="fixed w-screen h-screen top-0 left-0 bg-neutral-900/50 z-10" transition:fade={{ duration: 200 }} on:click={() => showTooltip = false}></button>
{/if}

