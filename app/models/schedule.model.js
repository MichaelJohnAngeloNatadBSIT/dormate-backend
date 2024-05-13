const mongoose = require("mongoose");

const Schedule = mongoose.model(
  "Schedule",
  new mongoose.Schema(
    {
    dorm_id: String,
    landlord_id: String,
    tenant_user_id: String,
    tenant_username: String,
    tenant_full_name: String,
    tenant_contact_number: String,
    tenant_address: String,
    tenant_verified: Boolean,
    schedule_date: Date,
    schedule_time: String,
    approve_visit: Boolean,
    approve_visit_landlord: Boolean,
    description: String,
    dorm_title: String,
    is_accepted_tenant: Boolean,
    is_accepted_tenant_landlord: Boolean,
  },
  { timestamps: true }
  )
);


module.exports = Schedule;