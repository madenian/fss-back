var express = require("express");
var router = express.Router();
const Streamer = require("../models/streamers");
const fetch = require("node-fetch");

//route pour chercher les plus gros live français
router.get("/fr", function (req, res) {

    const twitchClientId = process.env.TWITCH_CLIENT_ID;
    const twitchBearerToken = process.env.TWITCH_BEARER_TOKEN;
    
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
    const twitchClientId = process.env.TWITCH_CLIENT_ID;
    const twitchBearerToken = process.env.TWITCH_BEARER_TOKEN;
    
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