<script lang="ts">
	import { page } from "$app/stores";
  import { onMount } from "svelte";

  export let name: string;
  export let url: string;
  export let disabled = false;
  // let pathname: string | null = null;

  // onMount(() => {
  //   pathname = $page.url.pathname;
  // });
</script>

<div class="relative group transition">
  <a href={url} class="btn btn-ghost { disabled ? 'btn-disabled' : '' } w-full justify-start  {$page.url.pathname?.startsWith(url) ? 'btn-active' : ''}">
    <slot name="icon" />
    <div>{ name }</div>
  </a>
</div>