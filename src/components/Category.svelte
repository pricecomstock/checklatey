<script>
  export let name = "???";
  export let apps = [];
</script>

<div class="column is-one-quarter box">
  <h2 class="subtitle">{name}</h2>
  {#each apps as app, i (app)}
    <label class="checkbox">
      <input type="checkbox" />
      {app}
    </label>
    <br />
  {/each}
</div>
