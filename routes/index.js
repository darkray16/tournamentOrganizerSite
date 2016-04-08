var express = require('express');
var router = express.Router();

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
  var url = require('url'),
      url_parts = url.parse(req.url, true),
      query = url_parts.query,
      querystring = require('querystring');
  // Validation to be done here...

  res.sendStatus(200);
});

router.get('/verifyEvent', function(req, res) {
  res.render('verify');
});

router.post('/submitVerifiedEvent', function(req, res) {
  var eventid = "30303";
  res.redirect('inprogress?eventid=' + eventid);
});

module.exports = router;
