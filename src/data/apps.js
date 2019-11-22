import { app } from "./appClass";

const apps = [];

// This also controls the order on the web page, yikes?
const cat = {
  BROWSERS: { name: "Browsers", icon: "fas fa-globe-americas" },
  MEDIA: { name: "Media", icon: "fas fa-play-circle" },
  MESSAGING: { name: "Messaging", icon: "fas fa-comments" },
  GAMING: { name: "Gaming", icon: "fas fa-gamepad" },
  SECURITY: { name: "Security", icon: "fas fa-lock" },
  FILESHARING: { name: "File Sharing", icon: "fas fa-network-wired" },
  RUNTIMES: { name: "Runtimes", icon: "fas fa-map-signs" },
  CREATIVE: { name: "Creative", icon: "fas fa-paint-brush" },
  COMPRESSION: { name: "Compression", icon: "fas fa-file-archive" },
  DOCUMENTS: { name: "Documents", icon: "fas fa-file-alt" },
  CLOUD: { name: "Cloud Storage", icon: "fas fa-cloud" },
  UTILITIES: { name: "Utility", icon: "fas fa-tools" },
  DEVLANGS: { name: "Dev Languages", icon: "fas fa-code" },
  DEVTOOLS: { name: "Dev Tools", icon: "fas fa-code-branch" }
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
apps.push(new app("Firefox", cat.BROWSERS, "firefox", "", "fab fa-firefox"));
apps.push(
  new app("Google Chrome", cat.BROWSERS, "googlechrome", "", "fab fa-chrome")
);
apps.push(new app("Chromium", cat.BROWSERS, "chromium", "", "fab fa-chrome"));
apps.push(new app("Vivaldi", cat.BROWSERS, "vivaldi"));
apps.push(new app("Opera", cat.BROWSERS, "opera"));
apps.push(new app("Brave", cat.BROWSERS, "brave"));

// Messaging
apps.push(new app("Discord", cat.MESSAGING, "discord.install", "discord"));
apps.push(new app("Slack", cat.MESSAGING, "slack"));
apps.push(new app("Skype", cat.MESSAGING, "skype"));
apps.push(new app("Thunderbird", cat.MESSAGING, "thunderbird"));

// Security
apps.push(new app("Malwarebytes", cat.SECURITY, "malwarebytes"));
apps.push(new app("Avast Free Antivirus", cat.SECURITY, "avastfreeantivirus"));
apps.push(new app("Keepass", cat.SECURITY, "keepass"));
apps.push(new app("QtPass", cat.SECURITY, "qtpass"));
apps.push(new app("LastPass", cat.SECURITY, "lastpass"));

// Development Languages
apps.push(new app("Python", cat.DEVLANGS, "python"));
apps.push(new app("Python2", cat.DEVLANGS, "python2"));
apps.push(new app("NodeJS", cat.DEVLANGS, "nodejs"));
apps.push(new app("NodeJS (LTS)", cat.DEVLANGS, "nodejs-lts"));
apps.push(new app("JDK8", cat.DEVLANGS, "jdk8"));
apps.push(new app("Go", cat.DEVLANGS, "golang"));
apps.push(new app("Rust", cat.DEVLANGS, "rust"));
apps.push(new app("Ruby", cat.DEVLANGS, "ruby"));
apps.push(new app("PHP", cat.DEVLANGS, "php"));
apps.push(new app("Strawberry Perl", cat.DEVLANGS, "strawberryperl"));

// Dev Tools
apps.push(new app("PowerShell", cat.DEVTOOLS, "powershell"));
apps.push(new app("Visual Studio Code", cat.DEVTOOLS, "vscode"));
apps.push(
  new app(
    "Notepad++",
    cat.DEVTOOLS,
    "notepadplusplus.install",
    "notepadplusplus.commandline"
  )
);
apps.push(new app("Git", cat.DEVTOOLS, "git", "git.portable"));
apps.push(new app("AWS CLI", cat.DEVTOOLS, "awscli"));
apps.push(new app("Azure CLI", cat.DEVTOOLS, "azure-cli"));
apps.push(new app("Docker CLI", cat.DEVTOOLS, "docker-cli"));
apps.push(new app("docker-compose", cat.DEVTOOLS, "docker-compose"));
apps.push(new app("OpenSSH", cat.DEVTOOLS, "openssh"));
apps.push(new app("WinSCP", cat.DEVTOOLS, "winscp", "winscp.portable"));
apps.push(
  new app("FileZilla", cat.DEVTOOLS, "filezilla", "filezilla.commandline")
);
apps.push(new app("PuTTY", cat.DEVTOOLS, "putty", "putty.portable"));
apps.push(new app("Eclipse", cat.DEVTOOLS, "eclipse"));
apps.push(new app("Arduino IDE", cat.DEVTOOLS, "arduino"));
apps.push(new app("cURL", cat.DEVTOOLS, "curl"));
apps.push(new app("GNU Wget", cat.DEVTOOLS, "wget"));
apps.push(new app("VirtualBox", cat.DEVTOOLS, "virtualbox"));
apps.push(new app("Wireshark", cat.DEVTOOLS, "wireshark"));

// Media
apps.push(new app("Spotify", cat.MEDIA, "spotify"));
apps.push(new app("iTunes", cat.MEDIA, "itunes"));
apps.push(new app("VLC", cat.MEDIA, "vlc", "vlc.portable"));
apps.push(new app("foobar2000", cat.MEDIA, "foobar2000"));
apps.push(new app("MPC-HC", cat.MEDIA, "mpc-hc"));
apps.push(
  new app("K-Lite Codec Pack (Full)", cat.MEDIA, "k-litecodecpackfull")
);
apps.push(new app("Handbrake", cat.MEDIA, "handbrake", "handbrake.portable"));

// Utility
apps.push(
  new app("Everything", cat.UTILITIES, "everything", "everything.portable")
);
apps.push(new app("TeraCopy", cat.UTILITIES, "teracopy"));
apps.push(
  new app(
    "TreeSize Free",
    cat.UTILITIES,
    "treesizefree",
    "treesizefree.portable"
  )
);
apps.push(new app("CPU-Z", cat.UTILITIES, "cpu-z.install", "cpu-z.portable"));
apps.push(new app("GPU-Z", cat.UTILITIES, "gpu-z.portable"));
apps.push(new app("ImgBurn", cat.UTILITIES, "imgburn"));
apps.push(new app("Rufus", cat.UTILITIES, "rufus"));
apps.push(new app("Greenshot", cat.UTILITIES, "greenshot"));
apps.push(new app("AutoHotkey", cat.UTILITIES, "autohotkey"));
apps.push(new app("Sysinternals", cat.UTILITIES, "sysinternals"));
apps.push(new app("CCleaner", cat.UTILITIES, "ccleaner"));
apps.push(new app("Launchy", cat.UTILITIES, "launchy"));

// File Sharing
apps.push(new app("qBittorrent", cat.FILESHARING, "qbittorrent"));
apps.push(new app("Transmission", cat.FILESHARING, "transmission"));
apps.push(new app("Deluge", cat.FILESHARING, "deluge"));

// Creative
apps.push(new app("Audacity", cat.CREATIVE, "audacity"));
apps.push(new app("LAME for Audacity", cat.CREATIVE, "audacity-lame"));
apps.push(new app("Unity Hub", cat.CREATIVE, "unity-hub"));
apps.push(new app("Blender", cat.CREATIVE, "blender"));
apps.push(new app("Paint.NET", cat.CREATIVE, "paint.net"));
apps.push(new app("GIMP", cat.CREATIVE, "gimp"));
apps.push(new app("Krita", cat.CREATIVE, "krita"));
apps.push(new app("Inkscape", cat.CREATIVE, "inkscape"));

// Compression
apps.push(new app("7-Zip", cat.COMPRESSION, "7zip", "7zip.portable"));
apps.push(new app("PeaZip", cat.COMPRESSION, "peazip.install", "peazip"));
apps.push(new app("WinRAR", cat.COMPRESSION, "winrar"));

// Runtimes
apps.push(
  new app("Microsoft Visual C++ Redistributable", cat.RUNTIMES, "vcredist140")
);
apps.push(new app("Microsoft Silverlight", cat.RUNTIMES, "silverlight"));
apps.push(new app("Adobe Air", cat.RUNTIMES, "adobeair"));
apps.push(new app("Java Runtime (JRE) 8", cat.RUNTIMES, "javaruntime"));
apps.push(new app("Flash Player Plugin", cat.RUNTIMES, "flashplayerplugin"));

// Cloud
apps.push(new app("Dropbox", cat.CLOUD, "dropbox"));
apps.push(new app("Google Drive", cat.CLOUD, "googledrive"));
apps.push(new app("Nextcloud", cat.CLOUD, "nextcloud-client"));

// Documents
apps.push(new app("Foxit PDF Reader", cat.DOCUMENTS, "foxitreader"));
apps.push(new app("Sumatra PDF Reader", cat.DOCUMENTS, "sumatrapdf"));
apps.push(new app("Adobe Reader", cat.DOCUMENTS, "adobe"));
apps.push(new app("PDFCreator", cat.DOCUMENTS, "pdfcreator"));
apps.push(new app("CutePDF", cat.DOCUMENTS, "cutepdf"));
apps.push(new app("LibreOffice", cat.DOCUMENTS, "libreoffice-fresh"));

// Gaming
apps.push(new app("Steam", cat.GAMING, "steam"));
apps.push(new app("Epic Games Launcher", cat.GAMING, "epicgameslauncher"));

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
