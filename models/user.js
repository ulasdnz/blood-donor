const mongoose = require("mongoose");
const Chat = require("./chat");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "E-posta adresini giriniz."],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Kullanıcı ismini giriniz."],
      trim: true,
    },
    surname: {
      type: String,
      required: [true, "Kullanıcı soy ismini giriniz."],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Kullanıcı bir şifreye sahip olmalıdır."],
      trim: true,
    },
    image: String,
    bloodType: {
      type: String,
      required: [true, "Kan grubunu belirtmelisiniz."],
      enum: {
        values: ["0-", "0+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
        message: "Seçebileceğiniz kan grupları: 0-, 0+, A-, A+, B-, B+, AB-, AB+",
      },
      trim: true,
    },
    location: {
      city: {
        type: String,
        required: [true, "Şehir ismini belirtmelisiniz."],
        trim: true,
      },
      district: {
        type: String,
        required: [true, "İlçe ismini belirtmelisiniz."],
        trim: true,
      },
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Doğum tarihini belirtiniz."],
    },
    lastDonation: {
      type: Date,
      required: [true, "En son kan bağışı yaptığınız tarihi belirtiniz."],
    },
    notificationToken: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      required: [true, "Telefon numaranızı giriniz."],
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
    const error = new Error("Kullanıcı silinemedi.");
    throw error;
  }
});

module.exports = mongoose.model("User", userSchema);
