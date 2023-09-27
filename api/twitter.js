const { NextApiRequest, NextApiResponse } = require("next");
const { twitterClient } = require("../routes/twitterClient");
const { generateTweet } = require("../routes/randomTweet");

async function handler(req, res) {
   
    await twitterClient.v2.tweet(generateTweet());

    res.status(200).json({ message: "successfully tweeted" });
}

module.exports = handler;

module.exports.config = {
    api: {
        bodyParser: false,
    },
};

