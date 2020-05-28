<script>
  import AppSelector from "./components/AppSelector.svelte";
  import Output from "./components/Output.svelte";

  import { apps, appsByCategory } from "./data/apps";
  let selectedByCategory = appsByCategory.map(category => {
    return {
      name: category.name,
      selected: []
    };
  });
  $: allSelected = selectedByCategory.flatMap(category => {
    return category.selected;
  });
  // $: allSelected = selectedByCategory
  //   .map(category => {
  //     return category.selected;
  //   })
  //   .flat();
</script>

<section class="header">
  <img src="checklatey-logo.svg" alt="Checklatey" />
  <h2>
    Checklatey is like
    <a href="https://ninite.com/">Ninite</a>
    , but for the
    <a href="https://chocolatey.org/">Chocolatey</a>
    package manager for Windows!
    <br />
    Select the programs you want, get the command to install them all at once.
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
