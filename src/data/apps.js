import constsPlugin from "rollup-plugin-consts";
import { App } from "./appClass";
import appCsv from "./apps.csv";

import { CATEGORIES } from "./constants";

export const apps = appCsv
  .filter((app) => {
    return app.enabled === "1";
  })
  .map((app) => {
    return new App(
      app.properName,
      app.category,
      app.chocoInstallPackage,
      app.chocoPortablePackage
    );
  });

export const appsByCategory = apps.reduce((accMap, app) => {
  const appsInCategory = accMap.get(app.category) ?? {
    category: app.category,
    apps: [],
  };
  appsInCategory.apps.push(app);
  accMap.set(app.category, appsInCategory);
  return accMap;
}, new Map());
