const apps = [];

// This also controls the order on the web page
const cat = {
  BROWSERS: "Browsers",
  MEDIA: "Media",
  MESSAGING: "Messaging",
  GAMING: "Gaming",
  SECURITY: "Security",
  FILESHARING: "File Sharing",
  RUNTIMES: "Runtimes",
  CREATIVE: "Creative",
  COMPRESSION: "Compression",
  DOCUMENTS: "Documents",
  CLOUD: "Cloud Storage",
  UTILITIES: "Utility",
  DEVLANGS: "Dev Languages",
  DEVTOOLS: "Dev Tools"
};

function addApp(name, category, chocoPackage, chocoPortable = chocoPackage) {
  if (chocoPortable === "") chocoPortable = chocoPackage; // blank string can skip portable arg
  apps.push({
    name,
    category,
    chocoPackage,
    chocoPortable,
    portableAvailable: chocoPackage !== chocoPortable,
    globalIndex: apps.length // This feels wrong but is the simplest way as long as we never reorder!
  });
}

// Browsers
addApp("Firefox", cat.BROWSERS, "firefox");
addApp("Google Chrome", cat.BROWSERS, "googlechrome");
addApp("Chromium", cat.BROWSERS, "chromium");
addApp("Vivaldi", cat.BROWSERS, "vivaldi");
addApp("Opera", cat.BROWSERS, "opera");
addApp("Brave", cat.BROWSERS, "brave");

// Messaging
addApp("Discord", cat.MESSAGING, "discord.install", "discord");
addApp("Slack", cat.MESSAGING, "slack");
addApp("Skype", cat.MESSAGING, "skype");
addApp("Thunderbird", cat.MESSAGING, "thunderbird");

// Security
addApp("Malwarebytes", cat.SECURITY, "malwarebytes");
addApp("Avast Free Antivirus", cat.SECURITY, "avastfreeantivirus");
addApp("Keepass", cat.SECURITY, "keepass");
addApp("QtPass", cat.SECURITY, "qtpass");
addApp("LastPass", cat.SECURITY, "lastpass");

// Development Languages
addApp("Python", cat.DEVLANGS, "python");
addApp("Python2", cat.DEVLANGS, "python2");
addApp("NodeJS", cat.DEVLANGS, "nodejs");
addApp("NodeJS (LTS)", cat.DEVLANGS, "nodejs-lts");
addApp("JDK8", cat.DEVLANGS, "jdk8");
addApp("Ruby", cat.DEVLANGS, "ruby");
addApp("PHP", cat.DEVLANGS, "php");
addApp("Strawberry Perl", cat.DEVLANGS, "strawberryperl");

// Dev Tools
addApp("PowerShell", cat.DEVTOOLS, "powershell");
addApp("Visual Studio Code", cat.DEVTOOLS, "vscode");
addApp(
  "Notepad++",
  cat.DEVTOOLS,
  "notepadplusplus.install",
  "notepadplusplus.commandline"
);
addApp("Git", cat.DEVTOOLS, "git", "git.portable");
addApp("AWS CLI", cat.DEVTOOLS, "awscli");
addApp("Azure CLI", cat.DEVTOOLS, "azure-cli");
addApp("Docker CLI", cat.DEVTOOLS, "docker-cli");
addApp("docker-compose", cat.DEVTOOLS, "docker-compose");
addApp("OpenSSH", cat.DEVTOOLS, "openssh");
addApp("WinSCP", cat.DEVTOOLS, "winscp", "winscp.portable");
addApp("FileZilla", cat.DEVTOOLS, "filezilla", "filezilla.commandline");
addApp("PuTTY", cat.DEVTOOLS, "putty", "putty.portable");
addApp("Eclipse", cat.DEVTOOLS, "eclipse");
addApp("cURL", cat.DEVTOOLS, "curl");
addApp("GNU Wget", cat.DEVTOOLS, "wget");
addApp("VirtualBox", cat.DEVTOOLS, "virtualbox");
addApp("Wireshark", cat.DEVTOOLS, "wireshark");

// Media
addApp("Spotify", cat.MEDIA, "spotify");
addApp("iTunes", cat.MEDIA, "itunes");
addApp("VLC", cat.MEDIA, "vlc", "vlc.portable");
addApp("foobar2000", cat.MEDIA, "foobar2000");
addApp("MPC-HC", cat.MEDIA, "mpc-hc");
addApp("K-Lite Codec Pack (Full)", cat.MEDIA, "k-litecodecpackfull");
addApp("Handbrake", cat.MEDIA, "handbrake", "handbrake.portable");

// Utility
addApp("Everything", cat.UTILITIES, "everything", "everything.portable");
addApp("TeraCopy", cat.UTILITIES, "teracopy");
addApp("TreeSize Free", cat.UTILITIES, "treesizefree", "treesizefree.portable");
addApp("CPU-Z", cat.UTILITIES, "cpu-z.install", "cpu-z.portable");
addApp("GPU-Z", cat.UTILITIES, "gpu-z.portable");
addApp("ImgBurn", cat.UTILITIES, "imgburn");
addApp("Rufus", cat.UTILITIES, "rufus");
addApp("Greenshot", cat.UTILITIES, "greenshot");
addApp("AutoHotkey", cat.UTILITIES, "autohotkey");
addApp("Sysinternals", cat.UTILITIES, "sysinternals");
addApp("CCleaner", cat.UTILITIES, "ccleaner");
addApp("Launchy", cat.UTILITIES, "launchy");

// File Sharing
addApp("qBittorrent", cat.FILESHARING, "qbittorrent");
addApp("Transmission", cat.FILESHARING, "transmission");
addApp("Deluge", cat.FILESHARING, "deluge");

// Creative
addApp("Audacity", cat.CREATIVE, "audacity");
addApp("LAME for Audacity", cat.CREATIVE, "audacity-lame");
addApp("Unity Hub", cat.CREATIVE, "unity-hub");
addApp("Blender", cat.CREATIVE, "blender");
addApp("Paint.NET", cat.CREATIVE, "paint.net");
addApp("GIMP", cat.CREATIVE, "gimp");
addApp("Krita", cat.CREATIVE, "krita");
addApp("Inkscape", cat.CREATIVE, "inkscape");

// Compression
addApp("7-Zip", cat.COMPRESSION, "7zip", "7zip.portable");
addApp("PeaZip", cat.COMPRESSION, "peazip.install", "peazip");
addApp("WinRAR", cat.COMPRESSION, "winrar");

// Runtimes
addApp("Microsoft Visual C++ Redistributable", cat.RUNTIMES, "vcredist140");
addApp("Microsoft Silverlight", cat.RUNTIMES, "silverlight");
addApp("Adobe Air", cat.RUNTIMES, "adobeair");
addApp("Java Runtime (JRE) 8", cat.RUNTIMES, "javaruntime");
addApp("Flash Player Plugin", cat.RUNTIMES, "flashplayerplugin");

// Cloud
addApp("Dropbox", cat.CLOUD, "dropbox");
addApp("Google Drive", cat.CLOUD, "googledrive");
addApp("Nextcloud", cat.CLOUD, "nextcloud-client");

// Documents
addApp("Foxit PDF Reader", cat.DOCUMENTS, "foxitreader");
addApp("Sumatra PDF Reader", cat.DOCUMENTS, "sumatrapdf");
addApp("Adobe Reader", cat.DOCUMENTS, "adobe");
addApp("PDFCreator", cat.DOCUMENTS, "pdfcreator");
addApp("CutePDF", cat.DOCUMENTS, "cutepdf");
addApp("LibreOffice", cat.DOCUMENTS, "libreoffice-fresh");

// Gaming
addApp("Steam", cat.GAMING, "steam");
addApp("Epic Games Launcher", cat.GAMING, "epicgameslauncher");

// console.table(apps);

// This could theoretically be done by just running .filter() on the component passing the
// props to each category, but it seems cleaner to keep it here
const appsByCategory = [];
for (const catKey in cat) {
  if (cat.hasOwnProperty(catKey)) {
    const categoryName = cat[catKey];
    appsByCategory.push({
      categoryName,
      apps: apps.filter(app => {
        return app.category === categoryName;
      })
    });
  }
}

export { apps, appsByCategory };
