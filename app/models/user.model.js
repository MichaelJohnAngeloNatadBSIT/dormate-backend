const mongoose = require("mongoose");

const friendSchema = new mongoose.Schema(
  {
    friend_username: String,
    friend_user_id: String,
    friend_full_name: String,
    friend_contact_number: String,
    friend_verified: Boolean,
    friend_approved: Boolean,
    requested_by_user_id: String,
    requested_by_username: String,
  },
  { timestamps: true }
);

const referralSchema = new mongoose.Schema(
  {
    referral_friend_username: String,
    referral_friend_user_id: String,
    referral_friend_full_name: String,
    referral_friend_dorm_id: String,
    referral_friend_dorm_title: String,
    referral_friend_verified: Boolean,
    referred_by_friend: Boolean,
  },
  { timestamps: true }
);

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
    friend_list: [friendSchema],
    referral:[referralSchema],
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