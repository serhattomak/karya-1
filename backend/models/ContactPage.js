const mongoose = require("mongoose");

const ContactPage = new mongoose.Schema({
  telefon: { type: String, required: true },
  email: { type: String, required: true },
  adres: { type: String, required: true },
  instagram: { type: String, required: true },
  formHeader: { type: String, required: true },
  formDescription: { type: String, required: true },
});

const ContactInfo = mongoose.model("ContactInfo", ContactPage);

module.exports = ContactInfo;
