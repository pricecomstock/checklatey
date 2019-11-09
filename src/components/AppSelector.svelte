<script>
  import { apps, appsByCategory } from "../data/apps";

  import Category from "./Category.svelte";
</script>

<h1 class="title">Apps</h1>
<div class="container columns is-multiline">
  {#each appsByCategory as category, i (category)}
    <Category name={category.categoryName} apps={category.apps} />
  {/each}
</div>
