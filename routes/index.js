var express = require("express");
var router = express.Router();
const { twitterClient } = require("./twitterClient.js");
const CronJob = require("cron").CronJob;
const moment = require("moment");

/* GET home page. */

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});


const randomTweets = [
  "⏰ Tu mets le réveil demain ? ⏰ Retrouve tous les streams prévus demain matin sur : programme-tw.fr.",
  "⚡️ Supporter de la @KarmineCorp, de @JoblifeEsport de @MandatoryGG ou de @gentlemates ? Retrouve la programmation des matchs de ton équipe Valorant favorite sur programme-tw.fr/Esport ⚡️",
  "🎮 Préparez-vous pour une journée d'esport épique ! Découvrez la programmation complète des streams de vos équipes favorites sur programme-tw.fr/Esport. 📅 Ne manquez pas une minute de l'action ! #Esport #ProgrammeTW",
  "⚡ L'esport est à l'honneur ! Retrouvez les compétitions en direct de vos équipes de prédilection sur programme-tw.fr/Esport. 📅 Préparez-vous à vivre des moments palpitants avec @KarmineCorp, @JoblifeEsport, @MandatoryGG et @gentlemates. 🎮 #ProgrammeTW",
  "Envie de découvrir de nouvelles compétitions Esport, Dota, Starcraft, R6... ? Retrouve la programmation sur programme-tw.fr/Esport. 🕹️",
  "Qui est l'invité de @PopcornTalkshow 🍿 cette semaine ? Retrouve l'ensemble des informations sur programme-tw.fr. 🎤",
  "Qu'est-ce qu'on regarde ce soir ? La réponse sur programme-tw.fr. 📺",
  "🌟 À la recherche de compétitions de qualité ? Découvrez les prochains streams esports, Dota, Starcraft, R6 et bien plus encore sur programme-tw.fr/Esport. Préparez-vous à l'action ! 🎮 #Esport #ProgrammeTW",
  "📆 Vous avez des plans pour ce soir ? Découvrez les suggestions de visionnage sur programme-tw.fr. Trouvez quelque chose d'intéressant à regarder ! 📺",
  "⌛ Les meilleures compétitions Esport vous attendent ! Ne manquez pas la programmation complète sur programme-tw.fr. Préparez-vous pour des heures d'action ! ⚔️ #Esport #ProgrammeTW",
  "🌙 Quel sera votre programme pour cette nuit ? Découvrez les streams nocturnes et les tournois en direct sur programme-tw.fr. 🌃",
  "💬 Besoin de suggestions de visionnage ? programme-tw.fr est là pour vous ! Trouvez les streams les plus captivants et les compétitions Esport à ne pas manquer. 🎮 #ProgrammeTW",
  "🎮 Y'a soirée gaming mercredi prochain avec @xSqueeZie, @Lockl34r, @Doigby ? Regarde ici programme-tw.fr ! 🎉",
  "🌼 C'est quand le maître de fleurs de @poncefleur, un react de @Jirayalecochon ? La réponse ici : programme-tw.fr 🌸",
  "📅 Il y aurait pas un petit react de @Domingo prévu ce soir ? Vérifie ici : programme-tw.fr 📺",
  "🎉 Un petit Let's play ou un bon JDR de @AlphaCastFR ce soir ? Tu le verras sur programme-tw.fr ! 🎮",
  "🕖 Ça commence à quelle heure la soirée du lundi de @GotagaTV ? Programme-tw.fr a la réponse ! ⌚",
  "🔫 C'est compliqué de suivre la scène CS:GO quand on ne connaît pas bien ? Retrouve l'ensemble des matchs programmés sur programme-tw.fr. 🎯",
  "☀️ Un petit stream matinal avec @TontonTwitch ou un improv Twitch avec @LuttiLutti_ ? Retrouve l'heure des streams sur programme-tw.fr ! 🌞",
  "📢 Tu es streamer ? Tu voudrais que ton planning soit intégré au site ? Envoie-nous un message sur Twitter. Programme-tw.fr 📋",
  "🍿 Envie d'une soirée chill ou react avec @superhenrytran ? Retrouve l'heure des streams sur programme-tw.fr ! 📺",
  "🚀 Fans de @TeamVitality, @KarmineCorp, @SolaryTV ? Retrouve les matchs Rocket League prévus cette semaine sur programme-tw.fr/Esport. ⚽",
  "🌞 Un début d'après-midi avec @ultiaa ou une soirée échecs avec @Blitz_Stream ? Retrouve l'heure des streams sur programme-tw.fr. 🕒",
  "📰 Une revue de l'actualité avec @Simon_Puech ou un petit Let's play avec @Jeel_TV ? Retrouvez la programmation sur programme-tw.fr. 🎮",
  "Un petit let's play avec @M4fgaming ? Ou un Apex avec @WisethugTV ? Retrouve l'horraire des streams sur programme-tw.fr. 🎮",
  "Un peu de foot sur le 7/7 de @RMCsport ou de formule 1 avec @idreauTV ? Retrouve les horraires sur programme-tw.fr. ⚽🏎️",
  "Pas simple de regarder du Dota ou du Starcraft ? Retrouve les horraires sur programme-tw.fr/Esport. 🎮",
  "T'hésites à sortir ce soir ? Regarde ce qu'il y a sur programme-tw.fr avant de prendre une décision ! 📺"
];

const tweet = async () => {
  const randomIndex = Math.floor(Math.random() * randomTweets.length);
  const randomTweet = randomTweets[randomIndex];
  try {
    console.log(randomTweet);
    await twitterClient.v2.tweet(randomTweet);
  } catch (e) {
    console.log(e);
  }
};

const cronTweet = new CronJob("10 16 * * *", async () => {
  tweet();
});

cronTweet.start();

module.exports = router;
