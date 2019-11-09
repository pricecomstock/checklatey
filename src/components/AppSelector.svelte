<script>
  import Category from "./Category.svelte";
  let categories = [
    {
      name: "Media",
      apps: ["VLC", "MPCHC"]
    },
    {
      name: "Gaming",
      apps: ["Steam", "Epic Games Store"]
    }
  ];
</script>

<h1 class="title">Apps</h1>
sv
{#each categories as category}
  <div class="container columns is-multiline is-centered">
    <Category name={category.name} apps={category.apps} />
  </div>
{/each}
