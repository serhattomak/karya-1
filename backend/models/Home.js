// models/Home.js
const mongoose = require("mongoose");

const homeSchema = new mongoose.Schema({
  banner: {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
  },
  boxes: [
    {
      title: { type: String, required: true },
      subtitle: { type: String, required: true },
      image: { type: String },
    },
  ],
});

const Home = mongoose.model("Home", homeSchema);

module.exports = Home;
