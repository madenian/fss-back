var express = require("express");
var router = express.Router();
const Streamer = require("../models/streamers");
const fetch = require("node-fetch");


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
//       const apiKey = process.env.TWITCH_CLIENT_ID;
//       const accessToken = process.env.TWITCH_BEARER_TOKEN;
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

router.get("/", async function (req, res) {
  const twitchClientId = process.env.TWITCH_CLIENT_ID;
  const twitchBearerToken = process.env.TWITCH_BEARER_TOKEN;
  try {
    const streamers = await Streamer.find().select(
      "twitchId name broadcasterType description profileImage offlineImage createdAt"
    );

    
    const fetchPromises = streamers.map(async (streamer) => {
      try {
        const response = await fetch(
          `https://api.twitch.tv/helix/schedule?broadcaster_id=${streamer.twitchId}`,
          {
            method: "GET",
            headers: {
              "Client-ID": twitchClientId,
              "Authorization": `Bearer ${twitchBearerToken}`,
            },
          }
        );

        if (response.status === 200) {
          const schedule = await response.json();
          // Vérifiez si le planning est présent et ajoutez-le à l'objet streamer.
          if (schedule.data && schedule.data.segments) {
            // Créez un nouvel objet streamer avec la propriété schedule mise à jour.
            return {
              ...streamer.toObject(),
              schedule: schedule.data.segments,
            };
          }
        } else {
          console.error(
            `Erreur lors de la récupération du planning pour ${streamer.name}: ${response.statusText}`
          );
        }
      } catch (error) {
        console.error(
          `Erreur lors de la récupération du planning pour ${streamer.name}:`,
          error
        );
      }

      // Si aucune modification n'est apportée, retournez null.
      return null;
    });

    const streamersWithSchedule = (await Promise.all(fetchPromises)).filter(
      (streamer) => streamer !== null
    );

    if (streamersWithSchedule.length > 0) {
      res.json(streamersWithSchedule);
    } else {
      // Aucun streamer avec planning trouvé, renvoyez un message d'erreur approprié.
      res.status(404).json({ error: "Aucun streamer avec planning trouvé." });
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des streamers et des plannings :",
      error
    );
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des données." });
  }
});

//route POST pour rechercher s'il n'est pas déjà présent en BDD et ajouter un streamer en BDD si besoin
router.post("/", function (req, res) {
  const streamer = req.body;

  Streamer.findOne({ name: { $regex: new RegExp("^" + streamer.name, "i") } }).then((streamerFound) => {
    if (streamerFound) {
      res.json({
        result: false,
        streamer: streamerFound,
        message: "Streamer déjà présent en BDD",
      });
    } else {
      //formattage du nom en toLowerCase
      const cleanName = streamer.name.toLowerCase();
      const apiKey = process.env.TWITCH_CLIENT_ID;
      const accessToken = process.env.TWITCH_BEARER_TOKEN;
      const url = `https://api.twitch.tv/helix/users?login=${cleanName}`;
      const headers = {
        "Client-ID": apiKey,
        Authorization: `Bearer ${accessToken}`,
      };
      fetch(url, { headers })
        .then((res) => res.json())
        .then((twitchData) => {
          if (twitchData) {
            const newStreamer = new Streamer({
              twitchId: twitchData.data[0].id,
              name: twitchData.data[0].display_name,
              broadcasterType: twitchData.data[0].broadcaster_type,
              description: twitchData.data[0].description,
              profileImage: twitchData.data[0].profile_image_url,
              offlineImage: twitchData.data[0].offline_image_url,
              createdAt: twitchData.data[0].created_at,
            });
            newStreamer.save().then(() => {
              res.json({
                result: true,
                streamer: newStreamer,
                message: "Streamer ajouté en BDD",
              });
            });
          }
        });
    }
  });
});

module.exports = router;
