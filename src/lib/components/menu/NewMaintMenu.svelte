<script lang="ts">
	import { arrow, createFloatingActions } from "svelte-floating-ui";
	import { offset } from "svelte-floating-ui/core";
	import { writable } from "svelte/store";
	import { fade, fly } from "svelte/transition";

  let showTooltip = false;

  export let event: { name: string, type: 'weekly' | 'monthly' };
  export let eventStyles: string;

  const arrowRef = writable<HTMLElement>();

  const [floatingRef, floatingContent] = createFloatingActions({
    strategy: 'absolute',
    placement: 'top',
    middleware: [
      offset({ mainAxis: 10 }),
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

      Object.assign($arrowRef.style, {
        left: x != null ? `${x}px` : '',
        top: y != null ? `${y}px` : '',
        [staticSide!]: '-25px'
      });
    }
  });
</script>

<button use:floatingRef on:click={() => showTooltip = !showTooltip} class="{showTooltip ? 'z-20' : ''}">
  <slot />
</button>

{#if showTooltip && event && eventStyles}
<div class="absolute w-52 z-20" use:floatingContent>
  <div class="w-full rounded-2xl {eventStyles} p-4 transition flex flex-col gap-4" transition:fly={{ y: -25, duration: 200 }}>

    <!-- Arrow -->
    <div class="absolute fill-warning rotate-180 pointer-events-none" bind:this={$arrowRef}>
      <svg viewBox="0 0 20 20" width="25" height="25">
        <path stroke="none" d="M0 20C0 20 2.06906 19.9829 5.91817 15.4092C7.49986 13.5236 8.97939 12.3809 10.0002 12.3809C11.0202 12.3809 12.481 13.6451 14.0814 15.5472C17.952 20.1437 20 20 20 20H0Z"></path>
      </svg>
    </div>

    <!-- New Item Dialog -->
    <div class="flex flex-col">
      <div class="text-lg font-light text-center">2023</div>
      <div class="text-xl font-medium text-center">{event.name}</div>
    </div>

    <div class="flex flex-row justify-center">
      <a href="/maintenance/new?name={event.name}" class="btn btn-sm btn-primary w-full">Start</a>
    </div>
  </div>
</div>

<button class="fixed w-screen h-screen top-0 left-0 bg-neutral-900/50 z-10" transition:fade={{ duration: 200 }} on:click={() => showTooltip = false}></button>
{/if}

