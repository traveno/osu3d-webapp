<script lang="ts">
	import { arrow, createFloatingActions } from "svelte-floating-ui";
	import { offset, shift } from "svelte-floating-ui/core";
	import { Minus, Plus } from "svelte-heros-v2";
  import { cubicInOut } from "svelte/easing";
	import { writable } from "svelte/store";
	import { fade, fly, scale } from "svelte/transition";

  let showTooltip = false;
  let amount = 0;
  export let itemId: string;
  export let mode: 'add' | 'subtract' = 'add';

  const arrowRef = writable<HTMLElement>({ style: { } } as HTMLElement);

  const [floatingRef, floatingContent] = createFloatingActions({
    strategy: 'fixed',
    placement: 'bottom',
    middleware: [
      offset(20),
      shift(),
      arrow({ element: arrowRef })
    ],
    onComputed({ placement, middlewareData }) {
      const { x, y } = middlewareData.arrow!;
      const staticSide = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right'
      }[placement.split('-')[0]];
      if (!$arrowRef) return;
      Object.assign($arrowRef.style, {
        left: x != null ? `${x}px` : '',
        top: y != null ? `${y}px` : '',
        [staticSide!]: '-25px'
      });
    }
  });
</script>

<button use:floatingRef on:click={() => showTooltip = !showTooltip} class="{showTooltip ? 'z-30' : ''}">
  <slot />
</button>

{#if showTooltip}
<button class="fixed z-20 inset-0 bg-base-100/50" transition:fade={{ duration: 200 }} on:click={() => showTooltip = false}></button>
<div class="fixed w-52 z-20" use:floatingContent>
  <div class="w-full rounded-2xl p-4 transition flex flex-col items-center justify-center gap-2 {mode === 'add' ? 'bg-success' : 'bg-error'}" transition:scale={{ start: 0.95, duration: 100 }}>

    <!-- Arrow -->
    <div class="absolute {mode === 'add' ? 'fill-success' : 'fill-error'}" bind:this={$arrowRef}>
      <svg viewBox="0 0 20 20" width="25" height="25">
        <path stroke="none" d="M0 20C0 20 2.06906 19.9829 5.91817 15.4092C7.49986 13.5236 8.97939 12.3809 10.0002 12.3809C11.0202 12.3809 12.481 13.6451 14.0814 15.5472C17.952 20.1437 20 20 20 20H0Z"></path>
      </svg>
    </div>

    <form
      id="submit-new-change"
			method="post"
			action="?/submitNewChange" />

    <!-- New Item Dialog -->
    <div class="text-xl text-bold text-black text-center font-thin">{mode === 'add' ? 'Add Stock' : 'Subtract Stock'}</div>

    <button class="btn btn-circle btn-sm btn-neutral" on:click={() => amount += 1}><Plus /></button>

    <div class="form-control w-1/2">
      <input form="submit-new-change" type="number" name="amount" class="input text-3xl text-center font-light hide-input-arrows" bind:value={amount} />
    </div>

    <button class="btn btn-circle btn-sm btn-neutral" on:click={() => amount -= 1}><Minus /></button>

    <!-- Data field that cannot be seen -->
    <input form="submit-new-change" type="text" name="item_id" bind:value={itemId} hidden />
    <input form="submit-new-change" type="text" name="mode" bind:value={mode} hidden />

    <div class="flex flex-row justify-end gap-4">
      <button class="btn btn-sm btn-ghost text-black font-light" form="submit-new-change" type="submit">Submit</button>
      <button class="btn btn-sm btn-ghost text-black font-light" on:click={() => showTooltip = false}>Cancel</button>
    </div>
  </div>
</div>


{/if}