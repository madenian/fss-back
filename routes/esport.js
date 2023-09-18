var express = require("express");
var router = express.Router();
const fetch = require("node-fetch");


router.get('/', function(req, res) {
        
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          authorization: 'Bearer hjom_u2OrwdeELwfrpBEf9JGB2Q1YmnbEvSwch1_oR3C2lrU1n4'
        }
      };
      
      fetch('https://api.pandascore.co/lol/tournaments?sort=&page=1&per_page=50', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));

    })

module.exports = router;
