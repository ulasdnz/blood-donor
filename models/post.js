const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    userId: {
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
    message: {
      type: String,
      required: [true, "A post must have a message."],
    },
  },
  { timestamps: true }
);



module.exports = mongoose.model("Post", postSchema);
