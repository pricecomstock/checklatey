<script>
  // Compatibility with Edge
  import * as clipboard from "clipboard-polyfill";

  let sayYes = true;
  let preferPortable = true;
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
    /* border: 1px solid #bbb; */
    padding: 1em 2em;
    white-space: pre-wrap;
    word-wrap: normal;
    overflow-wrap: normal;
    background-color: white;
    font-size: 1.125em;
  }

  .danger {
    color: var(--ms-red);
  }

  .danger-border {
    border: 1px solid var(--ms-red);
  }

  .dangerable {
    transition: border 300ms;
  }

  .output-min-height {
    min-height: 13em;
  }
</style>

<div>
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

  <div class="output-min-height">
    <button class="btn" on:click={copyToClipboard}>Copy to Clipboard</button>
    <div
      class="box shadow dangerable"
      class:danger-border={alsoInstallChocolatey}>
      <pre id="output">{chocolateyCommand}</pre>
    </div>
  </div>
  <!-- <h2 class="subtitle">Options</h2> -->
  <fieldset class="box shadow">
    <legend>Options</legend>
    <label class="checkbox">
      <input type="checkbox" bind:checked={sayYes} />
      Don't prompt for user input (tell Chocolatey yes on all packages)
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
      (yes, you are piping a script into an administrator PowerShell!) (AT LEAST
      double check the URL points to chocolatey.org before you run it)
    </label>
  </fieldset>
</div>
