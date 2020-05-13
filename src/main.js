import App from "./App.svelte";
import "array-flat-polyfill";
import "bulma/css/bulma.css";

const app = new App({
  target: document.body,
  props: {
    name: "world",
  },
});

export default app;
