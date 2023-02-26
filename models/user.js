const mongoose = require("mongoose");
const Chat = require("./chat");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "A user must have a e-mail!"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "A user must have name."],
      trim: true,
    },
    surname: {
      type: String,
      required: [true, "A user must have surname."],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "A user must have password."],
      trim: true,
    },
    image: String,
    bloodType: {
      type: String,
      required: [true, "A blood type must be provided."],
      enum: {
        values: ["0-", "0+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
        message: "Blood type is either: 0-, 0+, A-, A+, B-, B+, AB-, AB+",
      },
      trim: true,
    },
    location: {
      city: {
        type: String,
        required: [true, "A city name must be provided."],
        trim: true,
      },
      district: {
        type: String,
        required: [true, "A district name must be provided."],
        trim: true,
      },
    },
    dateOfBirth: {
      type: Date,
      required: [true, "A user must have a birth date."],
    },
    lastDonation: {
      type: Date,
      required: [true, "A user must have a birth date."],
    },
    phone: {
      type: String,
      required: [true, "A user must have a phone number!"],
      trim: true,
    },
    chats: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        chatId: {
          type: Schema.Types.ObjectId,
          ref: "Chat",
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.methods.removeFromChats = function (chatID) {
  const updatedChat = this.chats.filter(
    (chat) => chat.chatId.toString() !== chatID.toString()
  );
  this.chats = updatedChat;
  return this.save();
};

userSchema.methods.deleteAllChats = function () {
  this.chats = [];
  return this.save();
};


userSchema.post("deleteOne", { document: true }, async function () {
  // second way of accessing this value of the current deleted element:
  //const user = await this.model.findOne(this.getQuery());
  //console.log(user._id);

  const result = await Chat.deleteMany({members:{$in:[this._id]}});
  if(!result || result.deletedCount <1 ){
    const error = new Error("User could not be deleted.");
    throw error;
  }
});

module.exports = mongoose.model("User", userSchema);
