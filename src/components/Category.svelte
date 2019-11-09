<script>
  export let name = "???";
  export let apps = [];
</script>

<div class="column is-one-quarter">
  <h2 class="subtitle">{name}</h2>
  {#each apps as app, i (app.globalIndex)}
    <label class="checkbox">
      <input type="checkbox" />
      {app.name}
    </label>
    <br />
  {/each}
</div>
