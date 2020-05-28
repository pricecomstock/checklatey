import { App } from "./appClass";
import targetPackageManager from "consts:targetPackageManager";
import appCsv from "./apps.csv";

// const app = require("./appClass");
// const fs = require("fs");

let apps = [];

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
  DEVTOOLS: { name: "Dev Tools", icon: "fas fa-code-branch" },
};

// Checked at build time
if (targetPackageManager === "chocolatey") {
  apps = appCsv
    .filter((app) => {
      return app.enabled === "1" && app.chocoInstallPackage != "";
    })
    .map((app) => {
      return new App(
        app.properName,
        cat[app.category],
        app.chocoInstallPackage,
        app.chocoPortablePackage
      );
    });
} else if (targetPackageManager === "winget") {
  apps = appCsv
    .filter((app) => {
      return app.wingetPackage != "";
    })
    .map((app) => {
      return new App(app.properName, cat[app.category], app.wingetPackage);
    });
} else if (targetPackageManager === "scoop") {
  apps = appCsv
    .filter((app) => {
      return app.scoopPackage != "";
    })
    .map((app) => {
      return new App(app.properName, cat[app.category], app.scoopPackage);
    });
}

console.log(apps);

// This could theoretically be done by just running .filter() on the component passing the
// props to each category, but it seems cleaner to keep it here
const appsByCategory = [];
for (const catKey in cat) {
  if (cat.hasOwnProperty(catKey)) {
    const category = cat[catKey];
    appsByCategory.push({
      categoryName: category.name,
      categoryIcon: category.icon,
      apps: apps.filter((app) => {
        return app.category.name === category.name;
      }),
    });
  }
}

// fs.writeFileSync(
//   "./choco.csv",
//   "name,category,chocoInstallPackage,chocoPortablePackage" +
//     apps
//       .map((app) => {
//         return [
//           app.name,
//           app.category.name,
//           app.chocoPackage,
//           app.chocoPortable,
//         ].join(",");
//       })
//       .join("\n")
// );

export { apps, appsByCategory };
