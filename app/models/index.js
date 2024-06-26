const dbConfig = require("../config/db.config.js");


const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;

db.url = dbConfig.url;
db.dormitory = require("../models/dorm.model.js")(mongoose);
db.tenant = require("../models/tenant.model.js")(mongoose);
db.user = require("../models/user.model.js");
db.admin = require("../models/admin.model.js");
db.schedule = require("../models/schedule.model.js");
db.role = require("../models/role.model.js");
db.payment = require("../models/payment.model.js")(mongoose);
db.visit = require("../models/visit.model.js")(mongoose);
db.ROLES = ["user", "admin", "landlord"];


module.exports = db;