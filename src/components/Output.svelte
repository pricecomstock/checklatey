<script>
  export let allSelected = [];
  $: chocolateyCommand = `choco install -y ${allSelected.join(" ")}`;
</script>

<style>

</style>

<div class="container">
  <h1 class="title">Chocolatey Command</h1>
  <div class="box is-family-code">{chocolateyCommand}</div>
</div>
