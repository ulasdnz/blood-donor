const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema(
  {
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: [
      {
        date: {
          type: Date,
          default: Date.now(),
        },
        content: {
          type: String,
          required: [true, "Mesaj boş olamaz."],
        },
        from: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        to: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
