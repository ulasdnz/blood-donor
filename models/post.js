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
    message: {
      type: String,
      required: [true, "İlan bir mesaj içermeli."],
    },
  },
  { timestamps: true }
);



module.exports = mongoose.model("Post", postSchema);
