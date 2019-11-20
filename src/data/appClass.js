function app(name, category, chocoPackage, chocoPortable, faIcon) {
  chocoPortable = chocoPortable || chocoPackage;

  this.name = name;
  this.category = category;
  this.chocoPackage = chocoPackage;
  this.chocoPortable = chocoPortable;

  this.faIcon = faIcon; // should be "fas fa-search" or "fab fa-google"

  this.portableAvailable = this.chocoPackage !== this.chocoPortable;
}

export { app };
