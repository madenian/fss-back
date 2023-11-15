var express = require("express");
var router = express.Router();
const Streamer = require("../models/streamers");
const fetch = require("node-fetch");
const moment = require("moment");


router.get("/", async function (req, res) {
  const twitchClientId = process.env.TWITCH_CLIENT_ID;
  const twitchBearerToken = process.env.TWITCH_BEARER_TOKEN;
  try {
    const streamers = await Streamer.find().select(
      "twitchId name broadcasterType description profileImage offlineImage createdAt"
    );

    console.log(streamers)

   
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
    console.log(streamersWithSchedule)

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
})


// BOT TWITTER 

// const tweet = async () => {

//   function truncateMessage(message, maxLength) {
//     if (message.length <= maxLength) {
//       return message;
//     }
//     return message.slice(0, maxLength - 3) + "...";
//   }
//   try {
//     const currentDate = moment(); 
  

//     const streamers = await Streamer.find().select(
//       "twitchId name broadcasterType description profileImage offlineImage createdAt"
//     );

//     const tweetMessage = [];

//     for (const streamer of streamers) {
//       try {
//         const response = await fetch(
//           `https://api.twitch.tv/helix/schedule?broadcaster_id=${streamer.twitchId}`,
//           {
//             method: "GET",
//             headers: {
//               "Client-ID": twitchClientId,
//               "Authorization": `Bearer ${twitchBearerToken}`,
//             },
//           }
//         );
    
//         if (response.status === 200) {
//           const schedule = await response.json();
          
//           if (schedule.data && schedule.data.segments) {
//             const streamSegments = schedule.data.segments;
           
    
//             const streamPrimeTime = streamSegments.some((segment) => {
//               const startTime = moment(segment.start_time);
//               return (
//                 startTime.get("hour") >= 19 &&
//                 startTime.get("hour") <= 22 &&
//                 startTime.isSame(currentDate, "day")
//               );
//             });
    
//             if (streamPrimeTime) {
//               tweetMessage.push(streamer.name);
//             }
//             console.log(tweetMessage)
//           }
//         }
//       } catch (error) {
//         console.error(`Erreur lors de la récupération du planning pour ${streamer.name}:`, error);
//       }
//     }
    

//     if (tweetMessage.length > 0) {
//       const truncatedMessage = truncateMessage(
//         `📆L'ensemble du programme sur programme-tw.fr. 📺Les streams prévus pour ce soir :\n${tweetMessage.join("\n")}`,
//         280
//       );

//       console.log(truncatedMessage)
     
//       await twitterClient.v2.tweet(truncatedMessage);
//     } else {
//       console.log("Aucun streamer trouvé avec un stream prévu à 21h aujourd'hui.");
//     }
//   } catch (e) {
//     console.log(e);
//   }
// };

// const cronTweet = new CronJob("0 13 * * *", async () => {
//   tweet();
// });

// cronTweet.start();

module.exports = router;