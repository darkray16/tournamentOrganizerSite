var express = require('express');
var router = express.Router();
var mongoUrl = 'mongodb://localhost:27017/tournaments';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/setup', function(req, res, next) {
  res.render('setup');
});

router.get('/inprogress', function(req, res, next) {
  res.render('inprogress');
});

router.get('/history', function(req, res, next) {
  res.render('history');
});

router.get('/verify', function(req, res, next) {
  res.render('verify');
});

router.get('/getPresetConfigsList', function(req, res) {
  res.json({
    presets: [
      { name: 'MTG_Top_8', text: 'Magic the Gathering Top 8 Bracket'},
      { name: 'MTG_Swiss', text: 'Magic the Gathering Swiss Tournament'},
      { name: 'MTG_Single_Elim', text: 'Magic the Gathering Single Elimination Tournament'},
      { name: 'Hearthstone_Swiss', text: 'Hearthstone Swiss Tournament'}
    ]
  });
});

router.get('/getFormatsList', function(req, res) {
  res.json({
    formats: [
      'swiss',
      'round robin',
      'single elimination',
      'double elimination'
    ]
  });
});

router.post('/submitNewEvent', function(req, res) {
  var postData = request.body;

  // connect to DB
  MongoClient.connect(mongoUrl, function(err, db) {
    if (err) {
      console.log(err);
    }
    db.collection('events').insert(postData, function(err, result) {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.sendStatus(200);
        res.json({id: postData._id});
      }
    });
  });
});

router.post('/submitResults', function(req, res) {
  var postData = request.body;


  // connect to DB
  MongoClient.connect(mongoUrl, function(err, db) {
    if (err) {
      console.log(err);
    }
    db.collection('events').update(postData, function(err, result) {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.sendStatus(200);
        res.json({id: postData._id});
      }
    });
  });
});

module.exports = router;
