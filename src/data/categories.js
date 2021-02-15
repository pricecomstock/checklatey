import { CATEGORIES as CAT } from "./constants";

// This also controls the order on the web page, yikes?
export const categories = {
  [CAT.BROWSERS]: { name: "Browsers", icon: "fas fa-globe-americas" },
  [CAT.MEDIA]: { name: "Media", icon: "fas fa-play-circle" },
  [CAT.MESSAGING]: { name: "Messaging", icon: "fas fa-comments" },
  [CAT.GAMING]: { name: "Gaming", icon: "fas fa-gamepad" },
  [CAT.SECURITY]: { name: "Security", icon: "fas fa-lock" },
  [CAT.FILESHARING]: { name: "File Sharing", icon: "fas fa-network-wired" },
  [CAT.RUNTIMES]: { name: "Runtimes", icon: "fas fa-map-signs" },
  [CAT.CREATIVE]: { name: "Creative", icon: "fas fa-paint-brush" },
  [CAT.COMPRESSION]: { name: "Compression", icon: "fas fa-file-archive" },
  [CAT.DOCUMENTS]: { name: "Documents", icon: "fas fa-file-alt" },
  [CAT.CLOUDSTORAGE]: { name: "Cloud Storage", icon: "fas fa-cloud" },
  [CAT.UTILITIES]: { name: "Utility", icon: "fas fa-tools" },
  [CAT.DEVLANGS]: { name: "Dev Languages", icon: "fas fa-code" },
  [CAT.DEVTOOLS]: { name: "Dev Tools", icon: "fas fa-code-branch" },
};
