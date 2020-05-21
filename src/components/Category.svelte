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
    margin: 2px 3px;
    transition: background-color 200ms;
    border-radius: 4px;
  }

  .application * {
    cursor: pointer;
  }

  .application:hover {
    background-color: var(--light-yellow);
  }

  .chosen {
    background-color: var(--light-green);
    font-weight: bold;
  }

  .fill-box {
    width: 100%;
    padding: 3px 8px 2px 8px;
  }

  .category {
    display: inline-block;
    width: 100%;
  }

  .category-name {
    font-size: 1.25rem;
    margin-bottom: 0.25rem;
  }
</style>

<div class="category category">
  <h2 class="category-name">
    <i class={icon} />
    {name}
  </h2>
  {#each apps as app, i (app.name)}
    <div class="application" class:chosen={appsAreSelected[i]}>
      <label class="fill-box">
        <input type="checkbox" bind:group={selectedApps} value={app} />
        <!-- <span class="icon is-medium">
          <i class="{app.faIcon} fa-lg" />
        </span> -->
        {app.name}
      </label>
    </div>
  {/each}
</div>
