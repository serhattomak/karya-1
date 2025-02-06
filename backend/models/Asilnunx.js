const mongoose = require("mongoose");

const AsilNunXSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  info: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
    default: "Varsayılan metin",
  },
  linkText: {
    type: String,
  },
  link: {
    type: String,
  },
  documents: [
    {
      type: String, // Döküman URL'si
    },
  ],
  image: {
    type: String, // Resim URL'si
  },
});

module.exports = mongoose.model("AsilNunX", AsilNunXSchema);
