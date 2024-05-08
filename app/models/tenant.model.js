const { Schema } = require("mongoose");

module.exports = (mongoose) => {
  // Define schema for Tenant
  const Tenant = mongoose.model(
    "tenant",
    mongoose.Schema({
    tenant_username: String,
    tenant_user_id: String,
    tenant_full_name: String,
    tenant_contact_number: String,
    tenant_address: String,
    verified: Boolean,
    approve_tenant: Boolean
  })
  ); 
  
  return Tenant;
};
