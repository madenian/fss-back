var express = require("express");
var router = express.Router();
const Streamer = require("../models/streamers");
const fetch = require('node-fetch');

// enregistrer les 100 streamers en BDD dé-commenter si besoin. 

// router.post("/", function (req, res) {

//     const streamers = [
//         "SQUEEZIE", "OTPLOL_", "KAMET0", "JLTOMY", "ZERATOR", "ETOILES", "GOTAGA", "ANTOINEDANIEL", "LOCKLEAR", "AMINEMATUE",
//         "DOMINGO", "ROCKETBAGUETTE", "SOLARYHS", "PAULETA_TWITCH", "THEGUILL84", "BICHOUU_", "MISTERMV", "SOLARYFORTNITE",
//         "LOCKLEAR", "LEBOUSEUH", "DOIGBY", "MICHOU", "REBEUDETER", "SARDOCHE", "WANKILSTUDIO", "MICKALOW", "SKYRROZTV",
//         "JOUEUR_DU_GRENIER", "TERRACID", "MISTERMV", "SKYYART", "MAGHLA", "PONCE", "AIEKILLU", "KAYDOP", "CHOWH1", "LAINK",
//         "JBZZED", "SOLARY", "DEUJNA", "BRUCEGRANNEC", "JEELTV", "SUPERHENRYTRAN", "JEANPORMANOVE", "LINCA", "ALPHACAST",
//         "MASTERSNAKOU", "SAMUELETIENNE", "BAYONETTA_TV", "LITTLEBIGWHALE", "ADZTV", "JIRAYALECOCHON", "KAATSUP", "BAGHERAJONES",
//         "MOMAN", "NIKOF", "ZACKNANI", "FANTABOBSHOW", "MAHDIBA", "VALOUZZ", "MAXIMEBIAGGI", "COLAS_BIM", "TONTON", "AYPIERRE",
//         "ROCKY_", "XARI", "LUTTI", "KENNYSTREAM", "DRFEELGOOD", "JULIETTEARZ", "HUGODECRYPTE", "FAIRYPEAK", "RMCSPORT"
//       ];
    
//     async function fetchTwitchData(streamerName) {
//         const apiKey = 'yezyu92gzd8s4bpqxyrl1r893te09j';
//         const accessToken = 'c4rczh7a6nniomgrnd42sybt14ivcw'; 
//         const url = `https://api.twitch.tv/helix/users?login=${streamerName}`;
//         const headers = {
//           'Client-ID': apiKey,
//           'Authorization': `Bearer ${accessToken}`,
//         };
      
//         try {
//           const response = await fetch(url, { headers });
//           if (!response.ok) {
//             throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
//           }
          
//           const userData = await response.json();
//           return userData.data[0];
//         } catch (error) {
//           console.error(`Erreur lors de la récupération des données pour ${streamerName}: ${error}`);
//           return null;
//         }
//       }

//       const promises = streamers.map(async (streamerName) => {
//         const twitchData = await fetchTwitchData(streamerName);
//         if (twitchData) {
//           const newStreamer = new Streamer({
//             twitchId: twitchData.id,
//             name: twitchData.display_name,
//             broadcasterType: twitchData.broadcaster_type,
//             description: twitchData.description,
//             profileImage: twitchData.profile_image_url,
//             offlineImage: twitchData.offline_image_url,
//             createdAt: twitchData.created_at,
//           });
    
//           return newStreamer.save();
//         }
//       });

//       try {
//         const savedStreamers = Promise.all(promises);
//         res.json(savedStreamers);
//         console.log(savedStreamers);
//       } catch (error) {
//         console.error(`Erreur lors de la sauvegarde des streamers: ${error}`);
//         res.status(500).json({ error: "Erreur lors de la sauvegarde des données" });
//       }
//     });

router.get('/', function(req, res) {
    Streamer.find().then((streamer) => {
        res.json(streamer);
        console.log(streamer);
    });
});


module.exports = router;
