const { Schema } = require("mongoose");


// Define schema for Tenant
const tenantSchema = new mongoose.Schema({
  username: {
    type: String,
    // required: true
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to a User model if needed
    // required: true
  }
});

module.exports = (mongoose) => {
  const Dormitory = mongoose.model(
    "dormitory",
    mongoose.Schema(
      {
        user_id: String,
        title: String,
        description: String,
        address: String,
        lessor: String,
        bedroom: Number,
        bathroom: Number,
        rent: Number,
        vacancy: Number,
        for_rent: Boolean,
        publish: Boolean,
        contact_number: String,
        username: String,
        user_image: String,
        visit_counter: Number,
        dorm_images: [
          {
            type: String,
          },
        ],
        business_registration_image: String,
        barangay_clearance_image: String,
        mayor_permit_image: String,
        bfp_permit_image: String,
        sanitary_permit_image: String,
        payment_id: String,
        payment_status: String,
        payment_checkout_url: String,
        payment_reference_number: String,
        tenants: [tenantSchema],

      },
      { timestamps: true }
    )
  );
  return Dormitory;
};
