

function Comic(uuid, title) {
  this.uuid = uuid;
  this.title = title;
}

Comic.prototype.withUUID = function (uuid) {
  return new Comic(uuid, this.title);
};



module.exports = Comic;