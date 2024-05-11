module.exports = app => {
    const schedule = require("../controllers/schedule.controller");
  
    // var router = require("express").Router();

    app.post("/api/schedule/create_schedule", schedule.createSchedule);
    app.get("/api/schedule/get_schedule", schedule.findAllSchedule);
    app.get("/api/schedule/get_schedule/:id", schedule.findOneSchedule);
    app.get("/api/schedule/get_schedule_landlord/:id", schedule.findAllScheduleLandlord);
    app.get("/api/schedule/get_schedule_tenant/:id", schedule.findAllScheduleTenant);
    app.get("/api/schedule/get_schedule_approved_landlord/:id", schedule.findAllScheduleLandlordApproved);
    app.get("/api/schedule/get_schedule_approved_tenant/:id", schedule.findAllScheduleTenantApproved);
    app.put("/api/schedule/update_schedule_only/:id", schedule.update);
    app.put("/api/schedule/update_schedule/:id", schedule.updateSchedule);
    app.delete("/api/schedule/delete_schedule/:id", schedule.deleteSchedule);
    };