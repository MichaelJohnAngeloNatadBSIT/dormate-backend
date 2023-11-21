const mongoose = require("mongoose");

const Schedule = mongoose.model(
  "Schedule",
  new mongoose.Schema(
    {
    dorm_id: String,
    landlord_id: String,
    tenant_id: String,
    schedule_date: Date,
    approve_visit: Boolean,
    description: String,
    user_full_name: String,
    dorm_title: String,
  },
  { timestamps: true }
  )
);


module.exports = Schedule;