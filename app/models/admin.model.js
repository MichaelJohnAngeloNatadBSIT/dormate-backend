const mongoose = require("mongoose");

const Admin = mongoose.model(
  "Admin",
  new mongoose.Schema(
    {
    username: String,
    email: String,
    password: String,
    // address: String,
    first_name: String,
    last_name: String,
    // user_image: String,
    // image_id: String,
    mobile_number: String,
    roles: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Role"
        }
      ],
  },
  { timestamps: true }
  )
);


module.exports = Admin;