const mongoose = require("mongoose");

const dark_channelDB = mongoose.Schema({
  roleid: String,
  rolename: String,
  channels: Array
});

module.exports = mongoose.model("dark_channelDB", dark_channelDB);
