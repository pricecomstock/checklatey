import svelte from "rollup-plugin-svelte";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import rollup_start_dev from "./rollup_start_dev";
import postcss from "rollup-plugin-postcss";
import consts from "rollup-plugin-consts";
import dsv from "@rollup/plugin-dsv";

function getAppName(packageManager) {
  const appNameMap = {
    chocolatey: "checklatey",
    winget: "wingetpick",
    scoop: "scoopick",
  };

  return appNameMap[packageManager];
}

const production = !process.env.ROLLUP_WATCH;
const packageManager = process.env.PACKAGE_MANAGER || "chocolatey";
const appName = getAppName(packageManager);
const outputDirectory = `public_${appName}`;

export default {
  input: "src/main.js",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: `${outputDirectory}/bundle.js`,
  },
  plugins: [
    consts({
      targetPackageManager: packageManager,
      appName: appName,
    }),
    svelte({
      // enable run-time checks when not in production
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file — better for performance
      css: (css) => {
        css.write(`${outputDirectory}/bundle.css`);
      },
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration —
    // consult the documentation for details:
    // https://github.com/rollup/rollup-plugin-commonjs
    resolve({
      browser: true,
      dedupe: (importee) =>
        importee === "svelte" || importee.startsWith("svelte/"),
    }),
    dsv(),
    commonjs(),
    postcss(),

    // In dev mode, call `npm run start:dev` once
    // the bundle has been generated
    !production && rollup_start_dev,

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload(outputDirectory),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
