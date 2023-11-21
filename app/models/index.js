const dbConfig = require("../config/db.config.js");


const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;

db.url = dbConfig.url;
db.dormitory = require("../models/dorm.model.js")(mongoose);
db.user = require("../models/user.model.js");
db.admin = require("../models/admin.model.js");
db.schedule = require("../models/schedule.model.js");
db.role = require("../models/role.model.js");
db.ROLES = ["user", "admin", "landlord"];


module.exports = db;