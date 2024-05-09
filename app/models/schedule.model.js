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
    verified: Boolean,
    schedule_date: Date,
    schedule_time: String,
    approve_visit: Boolean,
    description: String,
    dorm_title: String,
  },
  { timestamps: true }
  )
);


module.exports = Schedule;