<script>
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
    navigator.clipboard.writeText(chocolateyCommand).catch(e => console.log(e));
  }
</script>

<style>
  pre {
    background-color: white;
  }
</style>

<div class="container">
  <h1 class="title">Chocolatey Command</h1>
  <div class="box">
    <pre>{chocolateyCommand}</pre>
  </div>
  <button
    class="button is-large is-primary is-outlined"
    on:click={copyToClipboard}>
    Copy to Clipboard
  </button>
  <hr />
  <h2 class="subtitle">Options</h2>
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
  <label class="checkbox has-text-danger">
    <input type="checkbox" bind:checked={alsoInstallChocolatey} />
    Also Install Chocolatey (this is bad practice!) (nothing bad that happens is
    my fault!)
    <a
      href="https://chocolatey.org/docs/installation#install-with-powershellexe">
      (you should read this!)
    </a>
    (yes, you are piping a script into an administrator PowerShell!)
  </label>
</div>
