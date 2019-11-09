<script>
  import Category from "./Category.svelte";
  export let appsByCategory;
  export let selectedByCategory;
</script>

<h1 class="title">Apps</h1>
<div class="container columns is-multiline">
  {#each appsByCategory as category, i (category)}
    <Category
      name={category.categoryName}
      apps={category.apps}
      bind:selectedApps={selectedByCategory[i].selected} />
  {/each}
</div>
