const mongoose = require("mongoose");
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
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model("User", userSchema);