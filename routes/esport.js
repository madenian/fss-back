var express = require("express");
var router = express.Router();
const fetch = require("node-fetch");
const moment = require("moment");
const { twitterClient } = require("./twitterClient.js");
const CronJob = require("cron").CronJob;

const pandascoreBearerToken = process.env.PANDA_BEARER_TOKEN;

// Route générique pour récupérer des données de jeux
router.get("/:gameName", async function (req, res) {
  try {
    const gameName = req.params.gameName;
    const pandascoreBearerToken = process.env.PANDA_BEARER_TOKEN;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${pandascoreBearerToken}`,
      },
    };

    const apiUrl = `https://api.pandascore.co/matches/upcoming?filter[videogame]=${gameName}&filter[finished]=false&sort=begin_at&page=1&per_page=100`;

    const response = await fetch(apiUrl, options);
    const data = await response.json();

    // Filtrer les objets avec streams_list non vide
    const filteredData = data.filter(
      (item) =>
        item.streams_list.length > 0 &&
        (item.streams_list.some((stream) => stream.language === "fr") ||
          item.streams_list.some((stream) => stream.language === "en"))
    );

    console.log(filteredData);

    // Envoyez la réponse au front-end
    res.json(filteredData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Une erreur s'est produite" });
  }
});

// // BOT TWITTER
// const tweet = async () => {
//   function truncateMessage(message, maxLength) {
//     if (message.length <= maxLength) {
//       return message;
//     }
//     return message.slice(0, maxLength - 3) + "...";
//   }
//   try {
//     const currentDate = moment();

//     const tweetMessage = [];

//     const games = [
//       "cs-go",
//       "league-of-legends",
//       "rl",
//       "valorant",
//       "dota-2",
//       "starcraft-2",
//       "fifa",
//       "cod-mw",
//       "r6-siege",
//       "ow",
//     ];

//     const options = {
//       method: "GET",
//       headers: {
//         accept: "application/json",
//         authorization: `Bearer ${pandascoreBearerToken}`,
//       },
//     };

//     for (const gameName of games) {
//       const apiUrl = `https://api.pandascore.co/matches/upcoming?filter[videogame]=${gameName}&filter[finished]=false&sort=begin_at&page=1&per_page=100`;

//       const response = await fetch(apiUrl, options);
//       const data = await response.json();

//       const filteredData = data.filter(
//         (item) =>
//           item.streams_list.length > 0 &&
//           item.streams_list.some((stream) => stream.language === "fr") &&
//           moment(item.begin_at).isSame(currentDate, "day")
//       );

//       // Ajouter le nom du jeu et le nom du match au tableau tweetMessage
//       filteredData.forEach((match) => {
//         tweetMessage.push(`${match.videogame.name}, ${match.name}`);
//       });
//     }

   

//     if (tweetMessage.length > 0) {
//       const truncatedMessage = truncateMessage(
//         `📆L'ensemble du programme Esport sur programme-tw.fr/Esport. L'Esport FR aujourd'hui :\n${tweetMessage.join("\n")}`,
//         265
//       );

//       console.log(truncatedMessage)

      
//       await twitterClient.v2.tweet(truncatedMessage);
//     } else {
//       console.log("Aucun streamer trouvé avec un stream prévu à 21h aujourd'hui.");
//     }
//   } catch (e) {
//     console.error(e);
//   }
// };

// const cronTweet = new CronJob("0 14 * * *", async () => {
//   tweet();
// });

// cronTweet.start();


module.exports = router;
