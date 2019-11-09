<script>
  let preferPortable = true;

  export let allSelected = [];
  $: chocolateyCommand = `choco install -y ${allSelected
    .map(app => {
      return preferPortable ? app.chocoPortable : app.chocoPackage;
    })
    .join(" ")}`;

  function copyToClipboard() {
    navigator.clipboard.writeText(chocolateyCommand).catch(e => console.log(e));
  }
</script>

<style>

</style>

<div class="container">
  <h1 class="title">Chocolatey Command</h1>
  <div class="box is-family-code">{chocolateyCommand}</div>
  <button
    class="button is-large is-primary is-outlined"
    on:click={copyToClipboard}>
    Copy to Clipboard
  </button>
  <hr />
  <h2 class="subtitle">Options</h2>
  <label class="checkbox">
    <input type="checkbox" bind:checked={preferPortable} />
    Prefer Portable
  </label>
</div>
