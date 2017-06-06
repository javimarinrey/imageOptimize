var gm = require('gm').subClass({imageMagick: true});
var request = require('request');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//var sourceUrl = 'http://localhost:3000/uploads/';
//var sourceUrl = 'https://s3.amazonaws.com/nguyer-test/';
var sourceUrl = 'http://www.dominobarcelona.com/img/';

function convertImage(inputStream, width, height) {
  return gm(inputStream)
      .resize(width, height)
      .stream();
}

router.get('/images/:fileName', function (req, res) {
  var url = sourceUrl + req.params.fileName;
  request.get(url).pipe(res);
});

router.get('/:resolution/:fileName', function (req, res) {
    var url = sourceUrl + req.params.fileName;

    var width = req.params.resolution.split('x')[0];
    var height = req.params.resolution.split('x')[1];
    var format = req.params.fileName.slice((req.params.fileName.lastIndexOf(".") - 1 >>> 0) + 2);

    res.set('Content-Type', 'image/' + format);
    convertImage(request.get(url), width, height).pipe(res);
});

router.get('/images/:fileName/optimized', function (req, res) {
    var url = sourceUrl + req.params.fileName;
    res.set('Content-Type', 'image/jpg');
    convertImage(request.get(url), 50, 50).pipe(res);
});

module.exports = router;
