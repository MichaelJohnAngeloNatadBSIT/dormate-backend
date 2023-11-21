const { Schema } = require("mongoose");

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
        for_rent: Boolean,
        publish: Boolean,
        contact_number: String,
        username: String,
        user_image: String,
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
      },
      { timestamps: true }
    )
  );
  return Dormitory;
};
