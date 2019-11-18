// Separated into its own file to import icons one by one to save bundle size

const icons = {};
const loadIcon = name => {
  let icon = require(`simple-icons/icons/${name}`);
  icons[icon.slug] = {
    hex: icon.hex,
    svg: icon.svg
  };
};

loadIcon("zeit");

loadIcon("mozillafirefox");
loadIcon("googlechrome");
loadIcon("opera");

module.exports = icons;
