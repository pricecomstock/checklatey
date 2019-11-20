<script>
  export let name = "???";
  export let icon = "???";
  export let apps = [];
  export let selectedApps = [];

  $: appsAreSelected = apps.map(app => {
    return selectedApps.includes(app);
  });
</script>

<style>
  .application {
    padding: 2px 8px;
    margin: 2px 0px;
    transition: background-color 400ms;
    border-radius: 4px;
  }
  .application:hover {
    background-color: hsl(48, 100%, 90%);
  }

  .chosen {
    background-color: hsl(171, 100%, 90%);
  }

  .fill-box {
    width: 100%;
  }

  .category {
    margin: 12px 1px;
  }

  .category-flex {
    width: 23%;
    align-self: flex-start;
    flex-basis: 23%;
    flex: 0 1;
    /* border: black dotted 1px; */
  }

  @media (max-width: 700px) {
    .category-flex {
      width: 100%;
    }
  }
  @media (min-width: 1300px) {
    .category-flex {
      width: 18%;
      flex-basis: 18%;
    }
  }

  /* @media (max-width: 900px) {
    .category-flex {
      flex: 1;
      width: 48%;
    }
  } */

  .category-name {
    font-size: 1.25rem;
    margin-bottom: 0.25rem;
  }
</style>

<div class="category-flex category">
  <h2 class="category-name">
    {name}
    <span class="icon">
      <i class="{icon} fa-sm" />
    </span>
  </h2>
  {#each apps as app, i (app.name)}
    <div class="application" class:chosen={appsAreSelected[i]}>
      <label class="checkbox fill-box">
        <span class="icon is-medium">
          <i class="{app.faIcon} fa-lg" />
        </span>
        <input type="checkbox" bind:group={selectedApps} value={app} />
        {app.name}
      </label>
    </div>
  {/each}
</div>
