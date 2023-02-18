const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const donationSchema = new Schema({
  date: {
    type: Date,
    default: Date.now()
  },
  rate: {
    type: Number,
    min:[1, "Rating must be above 1"],
    max:[5, "Rating must be below 5"],
    required: [true, "You should rate the user."]
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
      required: [true, "A city name must be provided."],
    },
    district: {
      type: String,
      required: [true, "A district name must be provided."],
    },
  },
  bloodType: {
    type: String,
    required: [true, "A blood type must be provided."],
    enum: {
      values: ["0-", "0+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
      message: "Blood type is either: 0-, 0+, A-, A+, B-, B+, AB-, AB+",
    },
  },
});

module.exports = mongoose.model("Donation", donationSchema);
