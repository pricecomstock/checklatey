// THIS IS NOT CURRENTLY USED
// It is tedious to find all these icons and it's another thing
// that would require updating when services update their icons
// It's just not a high priority
const icons = {};
const loadIcon = (name) => {
  let icon = require(`simple-icons/icons/${name}`);
  icons[icon.slug] = {
    hex: icon.hex,
    svg: icon.svg,
  };
};

loadIcon("zeit");

loadIcon("mozillafirefox");
loadIcon("googlechrome");
loadIcon("opera");

module.exports = icons;
