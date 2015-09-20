var Character = require('./Character.js'),
    storage = require('../data/characters.json')
        .filter(function (json) {
          return [1009220, 1009351, 1009368, 1009610, 1009664, 1009718].indexOf(json.id) !== -1;
        })
        .map(function (json) {
          return new Character(json.id, json.name);
        });

function Characters() {

  function all() {
    return storage;
  }

  function withId(id) {
    var hits = storage.filter(function (char) {
      return id === char.id;
    });

    return hits.size == 0 ? null : hits[0];
  }

  function withName(name) {
    var hits = storage.filter(function (char) {
      return name === char.name;
    });

    return hits.size == 0 ? null : hits[0];
  }

  return {
    all: all,
    withId: withId,
    withName: withName
  };
}

module.exports = Characters();