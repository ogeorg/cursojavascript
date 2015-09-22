var app = require('express')(),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    comics = require('./Comics.js'),
    characters = require('./Characters.js');

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
    total: comics.length(),
    items: items
  });
});

app.get('/characters', function (req, res, next) {
  res.json(characters.all());
});

app.route('/comic/:id')
    .get(function (req, res) {
      var id = parseInt(req.params.id, 10),
          comic = comics.withId(id);
      console.log("Serving comic " + id);
      if (!comic)
        res.status(404).json({message: "Comic not found", id: id});
      else
        res.json(comic);
    })
    .post(function (req, res) {
      var json = req.body;
      json.id = req.params.id;
      var comic = comics.create(req.body);
      console.log("Creating new comic with Id " + comic.id);

      comics.push(comic);
      res.send('http://' + req.headers.host + '/comic/' + comic.id);
    })
    .put(function (req, res) {
      var id = parseInt(req.params.id),
          changedComic = comics.create(req.body).withId(id),
          comic = comics.withId(id);
      console.log("Updating comic " + id);

      if (!comic)
        res.status(404).json({message: "Comic not found", id: id});
      else {
        comics.replace(changedComic);
        res.send('http://' + req.headers.host + '/comic/' + changedComic.id);
      }
    })
    .delete(function (req, res) {
      var id = parseInt(req.params.id),
          comic = comics.withId(id);
      console.log("Deleting comic " + id);

      if (!comic)
        res.status(404).json({message: "Comic not found", id: id});
      else {
        comics.remove(comic);
        res.status(202).end();
      }
    });

app.get('/comic/with-character/:id', function (req, res) {
  var count = parseInt(req.query.count, 10) || 10,
      page = parseInt(req.query.page, 10) || 0,
      from = page * count,
      to = (page + 1) * count,
      charId = parseInt(req.params.id),
      character = characters.withId(charId);
  console.log("Serving comics page", page);

  if (!character)
    res.status(404).json({message: "Character not found", id: charId});
  else
    res.json(comics.withCharacter(character).page(from, to));
});

app.listen(port);

console.log('Comics Fake Server running at http://localhost:%d', port);