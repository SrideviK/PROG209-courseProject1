var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html');
});

function Sports(pTeamName, pPlayerName, pSport, pYear, pUrl) {
  this.ID = serverSports.length; // auto assign id
  this.team = pTeamName;
  this.player = pPlayerName;
  this.sport=pSport;
  this.year = pYear;
  this.url = pUrl;
}

serverSports=[];
serverSports.push(new Sports("SeahawksX", "Russel Wilson", "Football", 2020, "https://www.youtube.com/watch?v=-0-2as8ugrI"));
serverSports.push(new Sports("SRH", "Virat Kohli", "Cricket", 2010, "https://www.youtube.com/watch?v=AA94L3ut0Ng"));
serverSports.push(new Sports("BucaneersY", "Tom Brady", "Football", 2021, "https://www.youtube.com/watch?v=O7Di8ZpJnm8"));


router.get('/getAllSports', function(req, res) {
  res.status(200).json(serverSports);
});

/* Add one new sport */
router.post('/AddSport', function(req, res) {
  const newSport = req.body;
  serverSports.push(newSport);
  res.status(200);
});

module.exports = router;
