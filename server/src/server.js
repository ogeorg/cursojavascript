var app = require('express')(),
    bodyParser = require('body-parser'),
    moment = require('moment'),
    cors = require('cors'),
    uuid = require('node-uuid'),
    Maybe = require('monet').Maybe,
    comics = require('./Comics.js')();

var port = 8001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/comics', function (req, res, next) {
  var count = parseInt(req.query.count, 10) || 10,
      page = parseInt(req.query.page, 10) || 0,
      from = page * count,
      to = (page + 1) * count;
  console.log("Serving comics page", page);
  var items = comics.page(from, to);
  res.json({
    total: comics.size(),
    items: items
  });
});

app.route('/comic/:uuid')
    .get(function (req, res) {
      var uuid = req.params.uuid,
          hits = comics.withUUID(uuid);
      console.log("Serving comic " + uuid);
      if (hits.length == 0)
        res.status(404).json({message: "Comic not found", uuid: uuid});
      else
        res.json(hits[0]);
    })
    .post(function (req, res) {
      var comic = comics.create(req.body);
      console.log("Creating new comic with UUID " + comic.uuid);

      comics.push(comic);
      res.redirect(301, 'http://' + req.headers.host + '/v2/comic/' + comic.uuid);
    })
    .put(function (req, res) {
      var uuid = req.params.uuid,
          changedComic = comics.create(req.body).withUUID(uuid),
          hits = comics.withUUID(uuid);
      console.log("Updating comic " + uuid);

      if (hits.length == 0)
        res.status(404).json({message: "Comic not found", uuid: uuid});
      else {
        comics.replace(changedComic);
        res.redirect(301, 'http://' + req.headers.host + '/v2/comic/' + changedComic.uuid);
      }
    })
    .delete(function (req, res) {
      var uuid = req.params.uuid,
          hits = comics.withUUID(uuid);
      console.log("Deleting comic " + uuid);

      if (hits.length == 0)
        res.status(404).json({message: "Comic not found", uuid: uuid});
      else {
        comics.remove(hits[0]);
        res.status(202).end();
      }
    });

app.listen(port);

console.log('Comics Fake Server running at http://localhost:%d', port);