<script>
  export let name = "???";
  export let apps = [];
  export let selectedApps = [];
</script>

<div class="column is-6-mobile is-4-tablet is-3-desktop is-2-fullhd">
  <h2 class="subtitle">{name}</h2>
  {#each apps as app, i (app.globalIndex)}
    <label class="checkbox">
      <input type="checkbox" bind:group={selectedApps} value={app} />
      {app.name}
    </label>
    <br />
  {/each}
</div>
