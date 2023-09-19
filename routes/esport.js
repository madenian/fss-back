var express = require("express");
var router = express.Router();
const fetch = require("node-fetch");


// URL GET MATCH

// LOL 

const lflMatch ="https://api.pandascore.co/leagues/4292/matches?filter[finished]=false&sort&page=1&per_page=50"
const lecMatch ="https://api.pandascore.co/leagues/4292/matches?filter[finished]=false&sort&page=1&per_page=50"

// ROCKETLEAGUE

const rlcsMatch ="https://api.pandascore.co/leagues/4834/matches?filter[finished]=false&sort&page=1&per_page=50"


router.get('/', function(req, res) {
        
  const pandascoreBearerToken = process.env.PANDA_BEARER_TOKEN

    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${pandascoreBearerToken}` 
        }
      };
      
      fetch("https://api.pandascore.co/leagues/4292/matches?filter[finished]=false&sort&page=1&per_page=50", options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));

    })

module.exports = router;
