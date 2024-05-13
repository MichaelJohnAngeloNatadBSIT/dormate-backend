const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema(
    {
    username: String,
    email: String,
    password: String,
    address: String,
    first_name: String,
    last_name: String,
    user_image: String,
    image_id: String,
    mobile_number: String,
    verified: Boolean,
    valid_identification_image: String,
    valid_image_id: String,
    dorm_id: String,
    dorm_title: String,
    dorm_landlord_user_id: String,
    is_tenant: Boolean,
    dorm_tenant_date: Date,
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


module.exports = User;