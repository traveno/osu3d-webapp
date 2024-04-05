<script lang="ts">
	import { ArrowLeft, Bars3 } from "svelte-heros-v2";

  export let image: string | null = null;
  export let name: string;
  export let backUrl: string | null = null;
</script>

<div class="h-24 relative overflow-hidden flex lg:flex-row items-center md:gap-4">
  <label for="drawer-id" class="btn btn-square btn-ghost drawer-button lg:hidden"><Bars3 class="h-6 w-6 md:h-8 md:w-8" /></label>
  {#if backUrl}
    <a href={backUrl} class="btn btn-ghost btn-square uppercase text-xl font-light">
      <span class="lg:hidden"><ArrowLeft size={'32px'} strokeWidth={'1px'} /></span>
      <span class="hidden lg:inline"><ArrowLeft size={'36px'} strokeWidth={'1px'} /></span>
  </a>
  {/if}

  <div class="flex w-full items-center">
    <div class="grow hidden lg:inline w-fit text-3xl lg:font-thin z-10">{ name }</div>
    <div class="grow lg:hidden text-2xl z-10 flex items-center w-full h-full gap-2">
    
    
      <img src="/osu3d.svg" alt="Club logo" class="h-10 w-10 opacity-75" />
      <div class="font-thin">osu3d.io </div>
      <div class="grow" />
      <div class="font-thin">{name}</div>
    </div>
  </div>

  {#if image}
    <div class="grow"></div>
    <img src={image} alt="Page banner" class="hidden lg:block absolute right-32 top-12 blur-[0.75px] scale-[4] w-16 h-16 opacity-25 pointer-events-none select-none" />
  {/if}
</div>