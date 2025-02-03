// models/AboutUs.js
const mongoose = require("mongoose");

const aboutUsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
});

const AboutUs = mongoose.model("AboutUs", aboutUsSchema);

module.exports = AboutUs;
