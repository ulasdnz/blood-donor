const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const donationSchema = new Schema({
  date: {
    type: Date,
    default: Date.now()
  },
  rate: {
    type: Number,
    min:[1, "Puan 1 ve 5 arasında bir sayı olmalı."],
    max:[5, "Puan 1 ve 5 arasında bir sayı olmalı"],
    required: [true, "Kullanıcıya puan vermelisiniz."]
  },
  from: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  location: {
    city: {
      type: String,
      required: [true, "Şehir ismini belirtmelisiniz."],
    },
    district: {
      type: String,
      required: [true, "İlçe ismini belirtmelisiniz."],
    },
  },
  bloodType: {
    type: String,
    required: [true, "Kan grubunu belirtmelisiniz."],
    enum: {
      values: ["0-", "0+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
      message: "Seçebileceğiniz kan grupları: 0-, 0+, A-, A+, B-, B+, AB-, AB+",
    },
  },
});

module.exports = mongoose.model("Donation", donationSchema);
