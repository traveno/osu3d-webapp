<script lang="ts">
  import box from '$lib/images/package.png';
  import PageHeader from "$lib/components/PageHeader.svelte";
  import TreeNode from './TreeNode.svelte';

  export let data;
  let { tree } = data
  $: ({ tree } = data)

  $: console.log(tree);
</script>


<svelte:head>
  <title>Location Tree | OSU 3D</title>
</svelte:head>

<div class="flex flex-col gap-12 w-full">
  <PageHeader name="Edit Tree" image={box} backUrl="/inventory" />

  <div class="flex gap-12">
    <ul class="basis-1/2 menu bg-base-100 rounded-lg shadow-lg">
      {#each tree as rootNode}
        <TreeNode node={rootNode} />
      {/each}
    </ul>
    <ul class="basis-1/2 menu bg-base-100 rounded-lg shadow-lg h-fit">
      {#each tree as rootNode}
        <TreeNode node={rootNode} />
      {/each}
    </ul>
  </div>
  
</div>