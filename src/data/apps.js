const apps = [];
const cat = {
  BROWSERS: "Browsers",
  MEDIA: "Media",
  MESSAGING: "Messaging",
  GAMING: "Gaming",
  SECURITY: "Security",
  DEVELOPMENT: "Development",
  UTILITIES: "Utility",
  FILESHARING: "File Sharing",
  RUNTIMES: "Runtimes",
  CLOUD: "Cloud Storage",
  CREATIVE: "Creative",
  COMPRESSION: "Compression",
  DOCUMENTS: "Documents"
};

function addApp(name, category, chocoPackage, chocoPortable = chocoPackage) {
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
addApp("Vivaldi", cat.BROWSERS, "vivaldi");
addApp("Opera", cat.BROWSERS, "opera");

// Messaging
addApp("Discord", cat.MESSAGING, "discord.install", "discord");
addApp("Slack", cat.MESSAGING, "slack");

// Security
addApp("Malwarebytes", cat.SECURITY, "malwarebytes");

// Developer
addApp("Python", cat.DEVELOPMENT, "python");
addApp("Python2", cat.DEVELOPMENT, "python2");
addApp("Visual Studio Code", cat.DEVELOPMENT, "vscode");

// Media
addApp("Spotify", cat.MEDIA, "spotify");

// Utility
addApp("Everything", cat.UTILITIES, "everything", "everything.portable");
addApp("CPU-Z", cat.UTILITIES, "cpu-z.install", "cpu-z.portable");

// File Sharing
addApp("qBittorrent", cat.FILESHARING, "qbittorrent");
addApp("Transmission", cat.FILESHARING, "transmission");
addApp("Deluge", cat.FILESHARING, "deluge");

// Creative
addApp("Audacity", cat.CREATIVE, "audacity");
addApp("LAME for Audacity", cat.CREATIVE, "audacity-lame");

// Compression
addApp("7-Zip", cat.COMPRESSION, "7zip", "7zip.portable");
addApp("PeaZip", cat.COMPRESSION, "peazip.install", "peazip");
addApp("WinRAR", cat.COMPRESSION, "winrar");

// Runtimes
addApp("Microsoft Silverlight", cat.RUNTIMES, "silverlight");
addApp("Adobe Air", cat.RUNTIMES, "adobeair");

// Cloud
addApp("Dropbox", cat.CLOUD, "dropbox");

// Documents
addApp("Foxit PDF Reader", cat.DOCUMENTS, "foxitreader");
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
