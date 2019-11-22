<script>
  import Category from "./Category.svelte";
  export let appsByCategory;
  export let selectedByCategory;
</script>

<style>
  .apps-flex {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;

    justify-content: flex-start;
    align-items: center;
    align-content: center;

    max-height: 1000px;
    margin: 0 5%;
  }

  @media (max-width: 700px) {
    .apps-flex {
      max-height: none;
    }
  }
  @media (min-width: 1300px) {
    .apps-flex {
      max-height: 750px;
    }
  }
</style>

<div>
  <h1>Select the apps you want to install!</h1>
  <div class="apps-flex">
    {#each appsByCategory as category, i (category.categoryName)}
      <Category
        name={category.categoryName}
        icon={category.categoryIcon}
        apps={category.apps}
        bind:selectedApps={selectedByCategory[i].selected} />
    {/each}
  </div>
</div>
