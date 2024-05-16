const { Schema } = require("mongoose");

module.exports = (mongoose) => {
  // Define schema for Tenant
  const tenantSchema = new mongoose.Schema(
  {
    tenant_username: String,
    tenant_user_id: String,
    tenant_full_name: String,
    tenant_contact_number: String,
    tenant_address: String,
    approve_tenant: Boolean,
    is_tenant: Boolean,
    tenant_date_accepted: Date,
  },
  { timestamps: true }
  );

  const tenantReviewSchema = new mongoose.Schema(
    {
      tenant_star_rating: Number,
      tenant_user_id: String,
      tenant_full_name: String,
      tenant_username: String,
      tenant_user_image: String,
      tenant_review: String,
    },
    { timestamps: true }
    );

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
        tenantReviews: [tenantReviewSchema],
      },
      { timestamps: true }
    )
  );
  return Dormitory;
};
