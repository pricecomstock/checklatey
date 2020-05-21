<script>
  import Category from "./Category.svelte";
  export let appsByCategory;
  export let selectedByCategory;
</script>

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

<div>
  <h1>Select the apps you want to install!</h1>
  <div class="apps">
    {#each appsByCategory as category, i (category.categoryName)}
      <Category
        name={category.categoryName}
        icon={category.categoryIcon}
        apps={category.apps}
        bind:selectedApps={selectedByCategory[i].selected} />
    {/each}
  </div>
</div>
