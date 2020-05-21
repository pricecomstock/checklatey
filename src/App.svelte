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

<!-- Logo color is #5D2E8C -->
<section class="header">
  <img src="checklatey-logo.svg" alt="Checklatey" />
  <h2>
    Checklatey is like
    <a href="https://ninite.com/">Ninite</a>
    but with the
    <a href="https://chocolatey.org/">Chocolatey</a>
    package manager for Windows! Select the programs you want, get the command
    to install them all at once.
  </h2>
</section>

<section class="section">
  <AppSelector {appsByCategory} bind:selectedByCategory />
</section>
<section class="section">
  <Output bind:allSelected />
</section>
