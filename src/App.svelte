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
</script>

<section class="section">
  <AppSelector {appsByCategory} bind:selectedByCategory />
</section>
<section class="section">
  <Output bind:allSelected />
</section>
