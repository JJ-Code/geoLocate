const mongoose = require('mongoose');

const PinSchema = new mongoose.Schema({
  createdAt: String,
  title: String,
  content: String,
  image: String,
  latitude: Number,
  longitutde: Number,
  author: {
    type: mongoose.Schema.Objectd,
    ref: "User"
  },
  comments: [{
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    author: {
      type: mongoose.Schema.Objectd,
      ref: "User"
    }

  }]


}, {
  timestamps: true
})

module.exports = mongoose.model("Pin", PinSchema)