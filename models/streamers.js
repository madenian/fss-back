const mongoose = require("mongoose");
   

const streamerSchema = mongoose.Schema({
  twitchId: String,
  name: String,
  broadcasterType: String,
  description: String,
  profileImage: String, 
  offlineImage: String, 
  createdAt: String,
});

const Streamer = mongoose.model("streamers", streamerSchema);

module.exports = Streamer;
