<script>
  export let name = "???";
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
</style>

<div class="column is-6-mobile is-4-tablet is-3-desktop is-2-fullhd">
  <h2 class="subtitle">{name}</h2>
  {#each apps as app, i (app.globalIndex)}
    <div class="application" class:chosen={appsAreSelected[i]}>
      <label class="checkbox fill-box">
        <input type="checkbox" bind:group={selectedApps} value={app} />
        {app.name}
      </label>
    </div>
  {/each}
</div>
