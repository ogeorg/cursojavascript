var Comic = require('./Comic.js'),
    faker = require('faker'),
    uuid = require('node-uuid');

var filters = {
  not: function (predicate) {
    return function (comic) {
      return !predicate(comic);
    };
  },
  withUUID: function (uuid) {
    return function (comic) {
      return comic.uuid === uuid;
    };
  }
};

function Comics() {
  var storage = [];
  while (storage.length < 50)
    storage.push(create({title: faker.company.companyName()}));

  function push(comic) {
    storage.push(comic);
  }

  function withUUID(uuid) {
    return storage.filter(filters.withUUID(uuid));
  }

  function replace(comic) {
    storage = storage.filter(filters.not(filters.withUUID(comic.uuid)));
    storage.push(comic);
  }

  function remove(comic) {
    storage = storage.filter(filters.not(filters.withUUID(comic.uuid)));
  }

  function create(json) {
    return new Comic(uuid.v4(), json.title);
  }

  return {
    push: push,
    withUUID: withUUID,
    replace: replace,
    remove: remove,
    create: create
  }
}

module.exports = Comics;