const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
<<<<<<< HEAD
  name: {
    type: String,
    required: true
  },
    age : {
      type:Number ,
      require :true
    },
  email: {
    type: String,
    required: true,
    unique: true
  },
=======
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },
>>>>>>> origin/auth

    password: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("User", userSchema);
