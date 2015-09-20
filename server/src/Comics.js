Array.prototype.flatMap = function (lambda) {
  return Array.prototype.concat.apply([], this.map(lambda));
};
var Comic = require('./Comic.js'),
    characters = require('./Characters.js'),
    Data = require('./Data.js'),
    faker = require('faker'),
    uuid = require('node-uuid'),
    comics = characters.all()
        .flatMap(function (char) {
          return require('../data/comics-' + char.id + '.json')
              .map(function (json) {
                var chars = json.characters
                    .map(characters.withName)
                    .filter(function (char) {
                      return !!char;
                    });
                return new Comic(json.id, json.title, chars);
              });
        });

function Comics() {
  function push(comic) {
    comics.push(comic);
  }

  function withId(id) {
    var hits = comics.filter(function (comic) {
      return comic.id == id;
    });
    return hits.length == 0 ? null : hits[0];
  }

  function withCharacter(character) {
    return comics.filter(function (comic) {
      return comic.characters.map(function (char) {
            return char.id;
          }).indexOf(character.id) !== -1;
    });
  }

  function replace(comic) {
    remove(comic);
    comics.push(comic);
  }

  function remove(comic) {
    comics = comics.filter(function (candidate) {
      return candidate.id != comic.id;
    });
  }

  function create(json) {
    return new Comic(uuid.v4(), json.title, json.characters);
  }

  function page(from, to) {
    return comics.slice(from, to);
  }

  function length() {
    return comics.length;
  }

  return {
    length: length,
    page: page,
    push: push,
    withId: withId,
    withCharacter: withCharacter,
    replace: replace,
    remove: remove,
    create: create
  }
}

module.exports = Comics();