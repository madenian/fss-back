var express = require("express");
var router = express.Router();
const Streamer = require("../models/streamers");
const fetch = require("node-fetch");

//route pour chercher les plus gros live français
router.get("/fr", function (req, res) {

    const twitchClientId = 'yezyu92gzd8s4bpqxyrl1r893te09j';
    const twitchBearerToken = 'c4rczh7a6nniomgrnd42sybt14ivcw'
    
    fetch("https://api.twitch.tv/helix/streams?first=20&language=fr", {
        headers: {
            "Client-ID": twitchClientId,
            "Authorization": `Bearer ${twitchBearerToken}`,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            const topLive = data.data;
            res.json(topLive);
        });

    }
);

//route pour chercher les plus gros live anglais
router.get("/en", function (req, res) {
    const twitchClientId = 'yezyu92gzd8s4bpqxyrl1r893te09j';
    const twitchBearerToken = 'c4rczh7a6nniomgrnd42sybt14ivcw'
    
    fetch("https://api.twitch.tv/helix/streams?first=20&language=en", {
        headers: {
            "Client-ID": twitchClientId,
            "Authorization": `Bearer ${twitchBearerToken}`,
        },  
    })

        .then((response) => response.json())
        .then((data) => {
            const topLive = data.data;
            res.json(topLive);
        });

    }
);


module.exports = router;