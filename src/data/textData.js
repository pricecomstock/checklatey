const data = {
  chocolately: {
    appName: "Checklatey",
    packageManagerUrl: "https://chocolatey.org/",
    packageManagerInstallUrl:
      "https://chocolatey.org/docs/installation#install-with-powershellexe",
    commandBase: "choco install",
    canInstallWithCommand: true,
    installCommand:
      "Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))",
    hasYesOption: true,
    yesOption: "-y",
  },
};

export default data;
