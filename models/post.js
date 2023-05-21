const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patientName:{
      type: String,
      required: [true, "Hastanın ismini giriniz."]
    },
    patientSurname:{
      type: String,
      required: [true, "Hastanın soyadını giriniz."]
    },
    patientAge:{
      type: Number,
      min:[0, "Yaş en az 0 olabilir."],
      max:[150, "Yaş en fazla 150 olabilir."],
      required: [true, "Hastanın yaşını giriniz."]
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
    patientBloodType: {
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
    replies: [{
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
      }
    }]
  },
  { timestamps: true }
);

postSchema.pre(/^find/, function(next){
  this.populate([{
    path: "user",
    select: "name surname dateOfBirth phone notificationToken"
  },
  {
    path: "replies",
    populate:{
      path: "from",
      select: "name surname bloodType dateOfBirth"
    },
  }
])
  next()
})


postSchema.post('save', function(doc, next) {
  if(doc.replies?.length>0){
    doc.populate({
      path: "replies.from",
      select: "name surname bloodType dateOfBirth notificationToken"
    }).then(function() {
      next();
    });
  }else{
    doc.populate({
      path: "user",
      select: "name surname dateOfBirth phone"
    }).then(function() {
      next();
    });
  }

});

module.exports = mongoose.model("Post", postSchema);
