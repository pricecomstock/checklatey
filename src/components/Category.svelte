<script>
  export let name = "???";
  export let apps = [];
  export let selectedApps = [];
</script>

<div class="column is-one-quarter">
  <h2 class="subtitle">{name}</h2>
  {#each apps as app, i (app.globalIndex)}
    <label class="checkbox">
      <input
        type="checkbox"
        bind:group={selectedApps}
        value={app.chocoPortable} />
      {app.name}
    </label>
    <br />
  {/each}
</div>
