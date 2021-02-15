<script>
  import AppSelector from "./components/AppSelector.svelte";
  import Output from "./components/Output.svelte";

  import { appsByCategory } from "./data/apps";

  // Creates object with app category as keys and empty arrays as values
  let selectedByCategory = [...appsByCategory.keys()].reduce(
    (accObj, key) => ({ ...accObj, [key]: [] }),
    {}
  );
  $: allSelected = Object.values(selectedByCategory).flat();
</script>

<section class="header">
  <img src="checklatey-logo.png" alt="Checklatey" />
  <h2>
    PackagePicker is like <a href="https://ninite.com/">Ninite</a> , but for pre-existing
    package managers! Just select the programs you want, get the command to install
    them all at once.
  </h2>
</section>
<section class="section">
  <AppSelector {appsByCategory} bind:selectedByCategory />
</section>
<section class="section">
  <Output bind:allSelected />
</section>
<footer class="footer">
  <p>
    Made by
    <a href="https://pc.codes">Price Comstock</a>
    with
  </p>
  <a href="https://svelte.dev">
    <img src="svelte.svg" alt="Svelte" />
  </a>
  <a href="https://svelte.dev/">Svelte</a>
</footer>
