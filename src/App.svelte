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
<section class="hero">
  <div class="hero-body">
    <div class="container has-text-centered">
      <h1 class="title">
        <img src="checklatey-logo.svg" alt="Checklatey" width="400" />
      </h1>
      <h2 class="subtitle">
        It's like
        <a href="https://ninite.com/">Ninite</a>
        but with a package manager! Select the programs you want, get the
        <a href="https://chocolatey.org/">Chocolatey</a>
        command to install them all at once.
      </h2>
    </div>
  </div>
</section>

<section class="section">
  <AppSelector {appsByCategory} bind:selectedByCategory />
</section>
<section class="section">
  <Output bind:allSelected />
</section>
