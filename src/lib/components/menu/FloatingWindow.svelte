<script lang="ts">
  import { type ComponentType } from "svelte";
	import { createFloatingActions } from "svelte-floating-ui";
  import { offset } from "svelte-floating-ui/core";
  import { autoPlacement } from "svelte-floating-ui/dom";
  import { fade, fly } from "svelte/transition";
  
  export let component: ComponentType | null = null;

  let showPanel = false;
  let showBackdrop = false;
  let placement: string | null = null;

  const [floatingRef, floatingContent, update] = createFloatingActions({
    strategy: 'fixed',
    middleware: [
      offset(-1),
      autoPlacement({
        allowedPlacements: ['bottom-end', 'bottom-start', 'top-start', 'top-end', 'bottom', 'top']
      })
    ],
    onComputed(computed) {
      placement = showPanel ? computed.placement : null;
    }
  });
</script>

{#if showPanel}
  <!-- The backdrop -->
  <button
    class="cursor-default fixed w-screen h-screen top-0 left-0 z-20 bg-base-content/20"
    on:click={() => {
      showPanel = false;
      placement = null;
    }}
    on:outroend={() => showBackdrop = false}
    transition:fade={{ duration: 200 }}
  ></button>

  <div
    class="z-30"
    use:floatingContent
    in:fly={{ y: 5, duration: 200  }}
    out:fade={{ duration: 200  }}
    on:introstart={() => showBackdrop = true}
  >
    <div
      data-side={placement}
      class="panel-container drop-shadow-lg"
    >
    {#if component}
      <svelte:component
        {placement}
        this={component}
        on:close={() => {
          showPanel = false;
          placement = null;
        }}
      />
      {:else}
        <slot {placement} name="content" />
      {/if}
    </div>
  </div>
{/if}

<button
  data-side={placement}
  use:floatingRef
  on:click={() => showPanel = !showPanel}
  class="trigger-container { showBackdrop ? 'backdrop-active ' : '' } { showPanel ? 'panel-active z-30' : '' }"
>
  <slot name="open" />
</button>


<style lang="css">
  .trigger-container {
    @apply transition-all;

    &.panel-active {
      @apply -translate-y-2;
    }

    & :global(button[slot="open"]) {
      @apply transition-all rounded-none;
    }

    &:not([data-side^="top"]) > :global(button[slot="open"]) {
      @apply rounded-t-btn;
    }

    &:not([data-side^="bottom"]) > :global(button[slot="open"]) {
      @apply rounded-b-btn;
    }
  }

  .panel-container[data-side="bottom-end"] > :global(div) {
      @apply rounded-tr-none;
  }

  .panel-container[data-side="bottom-start"] > :global(div) {
      @apply rounded-tl-none;
  }

  .panel-container[data-side="top-end"] > :global(div) {
      @apply rounded-br-none;
  }

  .panel-container[data-side="top-start"] > :global(div) {
      @apply rounded-bl-none;
  }
</style>