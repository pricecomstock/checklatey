<script>
  import Category from "./Category.svelte";
  import { categories } from "../data/categories";
  export let appsByCategory;
  export let selectedByCategory;
</script>

<div>
  <h1>Select the apps you want to install!</h1>
  <div class="apps">
    {#each [...appsByCategory.values()] as { category, apps } (category)}
      <Category
        name={categories[category] ? categories[category].name : "?"}
        icon={categories[category] ? categories[category].icon : "?"}
        {apps}
        bind:selectedApps={selectedByCategory[category]}
      />
    {/each}
  </div>
</div>

<style>
  .apps {
    margin: 0 5%;
  }

  @media screen and (max-width: 550px) {
    .apps {
      column-count: unset;
    }
  }
  @media screen and (min-width: 550px) {
    .apps {
      /* height: 2300px; */
      column-count: 2;
    }
  }
  @media screen and (min-width: 800px) {
    .apps {
      column-count: 3;
    }
  }
  @media screen and (min-width: 950px) {
    .apps {
      column-count: 4;
    }
  }
  @media screen and (min-width: 1350px) {
    .apps {
      column-count: 6;
    }
  }
</style>
