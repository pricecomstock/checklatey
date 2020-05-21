import App from "./App.svelte";
import "array-flat-polyfill";

const app = new App({
  target: document.body,
  props: {
    name: "world",
  },
});

export default app;
