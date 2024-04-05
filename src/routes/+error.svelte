<script lang="ts">
	import { afterNavigate } from "$app/navigation";
	import { base } from "$app/paths";
  import { page } from "$app/stores";
  import { onMount } from "svelte";

  let previousPath: string = base;
  let status: number;

  afterNavigate(({ from }) => {
    previousPath = from?.url.pathname || previousPath;
  });

  onMount(() => {
    status = $page.status || 404;
  });
</script>

<div class="flex flex-col justify-center items-center pt-8 md:pt-0 gap-8 md:gap-12 lg:mt-24 w-full h-full">
  <div class="text-7xl md:text-9xl font-thin animate-pulse">{status}</div>
  <div class="text-xl md:text-2xl font-mono">{$page.error?.message}</div>
  <a class="btn btn-outline" href={previousPath}>Take me back!</a>
  <div></div>
</div>