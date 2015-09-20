function Comic(id, title, characters) {
  this.id = id;
  this.title = title;
  this.characters = characters;
}

Comic.prototype.withId = function (id) {
  this.id = id;
  return this;
};

module.exports = Comic;