var express = require("express");
var router = express.Router();
const fetch = require("node-fetch");


// Route générique pour récupérer des données de jeux
router.get('/:gameName', async function(req, res) {
  try {
    const gameName = req.params.gameName;
    const pandascoreBearerToken = process.env.PANDA_BEARER_TOKEN;

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${pandascoreBearerToken}`
      }
    };

    const apiUrl = `https://api.pandascore.co/matches/upcoming?filter[videogame]=${gameName}&filter[finished]=false&sort=begin_at&page=1&per_page=100`;
    
    const response = await fetch(apiUrl, options);
    const data = await response.json();

    // Filtrer les objets avec streams_list non vide
     const filteredData = data.filter(item => item.streams_list.length > 0 && (item.streams_list.some(stream => stream.language === "fr") || item.streams_list.some(stream => stream.language === "en")));


    // Envoyez la réponse au front-end
    res.json(filteredData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Une erreur s'est produite" });
  }
});

module.exports = router;



module.exports = router;
