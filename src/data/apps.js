import { app } from "./appClass";
const icons = require("./icons");

const apps = [];

// This also controls the order on the web page, yikes?
const cat = {
  BROWSERS: { name: "Browsers", icon: "fas fa-search" },
  MEDIA: { name: "Media", icon: "" },
  MESSAGING: { name: "Messaging", icon: "fas fa-comments" },
  GAMING: { name: "Gaming", icon: "" },
  SECURITY: { name: "Security", icon: "" },
  FILESHARING: { name: "File Sharing", icon: "" },
  RUNTIMES: { name: "Runtimes", icon: "" },
  CREATIVE: { name: "Creative", icon: "" },
  COMPRESSION: { name: "Compression", icon: "" },
  DOCUMENTS: { name: "Documents", icon: "" },
  CLOUD: { name: "Cloud Storage", icon: "" },
  UTILITIES: { name: "Utility", icon: "" },
  DEVLANGS: { name: "Dev Languages", icon: "" },
  DEVTOOLS: { name: "Dev Tools", icon: "" }
};

function addApp(
  name,
  category,
  iconName,
  chocoPackage,
  chocoPortable = chocoPackage
) {
  if (chocoPortable === "") chocoPortable = chocoPackage; // blank string can skip portable arg
  apps.push({
    name,
    category,
    icon: icons[iconName],
    chocoPackage,
    chocoPortable,
    portableAvailable: chocoPackage !== chocoPortable,
    globalIndex: apps.length // This feels wrong but is the simplest way as long as we never reorder!
  });
}

// Browsers
addApp("Firefox", cat.BROWSERS, "mozillafirefox", "firefox");
addApp("Google Chrome", cat.BROWSERS, "googlechrome", "googlechrome");
addApp("Chromium", cat.BROWSERS, "googlechrome", "chromium");
addApp("Vivaldi", cat.BROWSERS, "zeit", "vivaldi");
addApp("Opera", cat.BROWSERS, "zeit", "opera");
addApp("Brave", cat.BROWSERS, "zeit", "brave");

// Messaging
addApp("Discord", cat.MESSAGING, "zeit", "discord.install", "discord");
addApp("Slack", cat.MESSAGING, "zeit", "slack");
addApp("Skype", cat.MESSAGING, "zeit", "skype");
addApp("Thunderbird", cat.MESSAGING, "zeit", "thunderbird");

// Security
addApp("Malwarebytes", cat.SECURITY, "zeit", "malwarebytes");
addApp("Avast Free Antivirus", cat.SECURITY, "zeit", "avastfreeantivirus");
addApp("Keepass", cat.SECURITY, "zeit", "keepass");
addApp("QtPass", cat.SECURITY, "zeit", "qtpass");
addApp("LastPass", cat.SECURITY, "zeit", "lastpass");

// Development Languages
addApp("Python", cat.DEVLANGS, "zeit", "python");
addApp("Python2", cat.DEVLANGS, "zeit", "python2");
addApp("NodeJS", cat.DEVLANGS, "zeit", "nodejs");
addApp("NodeJS (LTS)", cat.DEVLANGS, "zeit", "nodejs-lts");
addApp("JDK8", cat.DEVLANGS, "zeit", "jdk8");
addApp("Ruby", cat.DEVLANGS, "zeit", "ruby");
addApp("PHP", cat.DEVLANGS, "zeit", "php");
addApp("Strawberry Perl", cat.DEVLANGS, "zeit", "strawberryperl");

// Dev Tools
addApp("PowerShell", cat.DEVTOOLS, "zeit", "powershell");
addApp("Visual Studio Code", cat.DEVTOOLS, "zeit", "vscode");
addApp(
  "Notepad++",
  cat.DEVTOOLS,
  "zeit",
  "notepadplusplus.install",
  "notepadplusplus.commandline"
);
addApp("Git", cat.DEVTOOLS, "zeit", "git", "git.portable");
addApp("AWS CLI", cat.DEVTOOLS, "zeit", "awscli");
addApp("Azure CLI", cat.DEVTOOLS, "zeit", "azure-cli");
addApp("Docker CLI", cat.DEVTOOLS, "zeit", "docker-cli");
addApp("docker-compose", cat.DEVTOOLS, "zeit", "docker-compose");
addApp("OpenSSH", cat.DEVTOOLS, "zeit", "openssh");
addApp("WinSCP", cat.DEVTOOLS, "zeit", "winscp", "winscp.portable");
addApp("FileZilla", cat.DEVTOOLS, "zeit", "filezilla", "filezilla.commandline");
addApp("PuTTY", cat.DEVTOOLS, "zeit", "putty", "putty.portable");
addApp("Eclipse", cat.DEVTOOLS, "zeit", "eclipse");
addApp("cURL", cat.DEVTOOLS, "zeit", "curl");
addApp("GNU Wget", cat.DEVTOOLS, "zeit", "wget");
addApp("VirtualBox", cat.DEVTOOLS, "zeit", "virtualbox");
addApp("Wireshark", cat.DEVTOOLS, "zeit", "wireshark");

// Media
addApp("Spotify", cat.MEDIA, "zeit", "spotify");
addApp("iTunes", cat.MEDIA, "zeit", "itunes");
addApp("VLC", cat.MEDIA, "zeit", "vlc", "vlc.portable");
addApp("foobar2000", cat.MEDIA, "zeit", "foobar2000");
addApp("MPC-HC", cat.MEDIA, "zeit", "mpc-hc");
addApp("K-Lite Codec Pack (Full)", cat.MEDIA, "zeit", "k-litecodecpackfull");
addApp("Handbrake", cat.MEDIA, "zeit", "handbrake", "handbrake.portable");

// Utility
addApp(
  "Everything",
  cat.UTILITIES,
  "zeit",
  "everything",
  "everything.portable"
);
addApp("TeraCopy", cat.UTILITIES, "zeit", "teracopy");
addApp(
  "TreeSize Free",
  cat.UTILITIES,
  "zeit",
  "treesizefree",
  "treesizefree.portable"
);
addApp("CPU-Z", cat.UTILITIES, "zeit", "cpu-z.install", "cpu-z.portable");
addApp("GPU-Z", cat.UTILITIES, "zeit", "gpu-z.portable");
addApp("ImgBurn", cat.UTILITIES, "zeit", "imgburn");
addApp("Rufus", cat.UTILITIES, "zeit", "rufus");
addApp("Greenshot", cat.UTILITIES, "zeit", "greenshot");
addApp("AutoHotkey", cat.UTILITIES, "zeit", "autohotkey");
addApp("Sysinternals", cat.UTILITIES, "zeit", "sysinternals");
addApp("CCleaner", cat.UTILITIES, "zeit", "ccleaner");
addApp("Launchy", cat.UTILITIES, "zeit", "launchy");

// File Sharing
addApp("qBittorrent", cat.FILESHARING, "zeit", "qbittorrent");
addApp("Transmission", cat.FILESHARING, "zeit", "transmission");
addApp("Deluge", cat.FILESHARING, "zeit", "deluge");

// Creative
addApp("Audacity", cat.CREATIVE, "zeit", "audacity");
addApp("LAME for Audacity", cat.CREATIVE, "zeit", "audacity-lame");
addApp("Unity Hub", cat.CREATIVE, "zeit", "unity-hub");
addApp("Blender", cat.CREATIVE, "zeit", "blender");
addApp("Paint.NET", cat.CREATIVE, "zeit", "paint.net");
addApp("GIMP", cat.CREATIVE, "zeit", "gimp");
addApp("Krita", cat.CREATIVE, "zeit", "krita");
addApp("Inkscape", cat.CREATIVE, "zeit", "inkscape");

// Compression
addApp("7-Zip", cat.COMPRESSION, "zeit", "7zip", "7zip.portable");
addApp("PeaZip", cat.COMPRESSION, "zeit", "peazip.install", "peazip");
addApp("WinRAR", cat.COMPRESSION, "zeit", "winrar");

// Runtimes
addApp(
  "Microsoft Visual C++ Redistributable",
  cat.RUNTIMES,
  "zeit",
  "vcredist140"
);
addApp("Microsoft Silverlight", cat.RUNTIMES, "zeit", "silverlight");
addApp("Adobe Air", cat.RUNTIMES, "zeit", "adobeair");
addApp("Java Runtime (JRE) 8", cat.RUNTIMES, "zeit", "javaruntime");
addApp("Flash Player Plugin", cat.RUNTIMES, "zeit", "flashplayerplugin");

// Cloud
addApp("Dropbox", cat.CLOUD, "zeit", "dropbox");
addApp("Google Drive", cat.CLOUD, "zeit", "googledrive");
addApp("Nextcloud", cat.CLOUD, "zeit", "nextcloud-client");

// Documents
addApp("Foxit PDF Reader", cat.DOCUMENTS, "zeit", "foxitreader");
addApp("Sumatra PDF Reader", cat.DOCUMENTS, "zeit", "sumatrapdf");
addApp("Adobe Reader", cat.DOCUMENTS, "zeit", "adobe");
addApp("PDFCreator", cat.DOCUMENTS, "zeit", "pdfcreator");
addApp("CutePDF", cat.DOCUMENTS, "zeit", "cutepdf");
addApp("LibreOffice", cat.DOCUMENTS, "zeit", "libreoffice-fresh");

// Gaming
addApp("Steam", cat.GAMING, "zeit", "steam");
addApp("Epic Games Launcher", cat.GAMING, "zeit", "epicgameslauncher");

// console.table(apps);

// This could theoretically be done by just running .filter() on the component passing the
// props to each category, but it seems cleaner to keep it here
const appsByCategory = [];
for (const catKey in cat) {
  if (cat.hasOwnProperty(catKey)) {
    const category = cat[catKey];
    appsByCategory.push({
      categoryName: category.name,
      categoryIcon: category.icon,
      apps: apps.filter(app => {
        return app.category.name === category.name;
      })
    });
  }
}

export { apps, appsByCategory };
