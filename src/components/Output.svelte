<script>
  // Compatibility with Edge
  import * as clipboard from "clipboard-polyfill";

  let preferPortable = false;
  let sayYes = true;
  let alsoInstallChocolatey = false;

  const chocolateyInstallCommand =
    "Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))\n";

  export let allSelected = [];
  $: chocolateyCommand = `${
    alsoInstallChocolatey ? chocolateyInstallCommand : ""
  }choco install ${sayYes ? "-y" : ""} ${allSelected
    .map(app => {
      return preferPortable ? app.chocoPortable : app.chocoPackage;
    })
    .join(" ")}`;

  function copyToClipboard() {
    clipboard.writeText(chocolateyCommand).catch(e => console.log(e));
  }
</script>

<style>
  pre {
    background-color: white;
    word-wrap: normal;
    overflow-wrap: normal;
  }

  .danger {
    color: red;
  }
</style>

<div class="container">
  <h1 class="title">Then run this command in an Administrator PowerShell!</h1>
  <p>
    Make sure you've
    <a
      href="https://chocolatey.org/docs/installation#install-with-powershellexe">
      installed Chocolatey
    </a>
    or enabled the extremely irresponsible option below to do so.
  </p>
  <br />

  <div class="box">
    <pre id="output">
      <code>{chocolateyCommand}</code>
    </pre>
  </div>
  <button on:click={copyToClipboard}>Copy to Clipboard</button>
  <hr />
  <h2 class="subtitle">Options</h2>
  <fieldset>
    <legend>Options</legend>
    <label class="checkbox">
      <input type="checkbox" bind:checked={sayYes} />
      Don't prompt for user input (yes to everything)
    </label>
    <br />
    <label class="checkbox">
      <input type="checkbox" bind:checked={preferPortable} />
      Prefer portable installs
    </label>
    <br />
    <label class="checkbox danger">
      <input type="checkbox" bind:checked={alsoInstallChocolatey} />
      Also Install Chocolatey (this is bad practice!) (nothing bad that happens
      is my fault!)
      <a
        href="https://chocolatey.org/docs/installation#install-with-powershellexe">
        (you should read this!)
      </a>
      (yes, you are piping a script into an administrator PowerShell!)
    </label>
  </fieldset>
</div>
