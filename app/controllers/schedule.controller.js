const db = require("../models");
const Schedule = db.schedule;
const Dorm = db.dormitory;

// Create and Save a new schedule
exports.createSchedule = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a schedule
  const schedule = new Schedule({
    dorm_id: req.body.dorm_id,
    landlord_id: req.body.landlord_id,
    tenant_user_id: req.body.tenant_user_id,
    tenant_username: req.body.tenant_username,
    tenant_full_name: req.body.tenant_full_name,
    tenant_contact_number: req.body.tenant_contact_number,
    tenant_address: req.body.tenant_address,
    tenant_verified: req.body.tenant_verified,
    schedule_date: req.body.schedule_date,
    schedule_time: req.body.schedule_time,
    description: req.body.description,
    user_full_name: req.body.user_full_name,
    dorm_title: req.body.dorm_title,
    approve_visit: false,
    is_accepted_tenant: false,
  });
  // Save schedule in the database
  schedule
    .save(schedule)
    .then((data) => {
      res.send({
        message: "Schedule of visit was created successfully.",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the Schedule of visit.",
      });
    });
    
};

// Retrieve all Schedule from the database.
exports.findAllSchedule = (req, res) => {
  Schedule.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving schedule.",
      });
    });
};

//retrieve schedule by landlord id and if approved false for landlords
exports.findAllScheduleLandlord = (req, res) => {
  var condition = { 
    landlord_id: req.params.id,
    approve_visit: false
  };
  Schedule.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving schedule.",
      });
    });
};

//retrieve schedule by tenant id and if approved false for landlords
exports.findAllScheduleTenant = (req, res) => {
  var condition = { 
    tenant_user_id: req.params.id,
    approve_visit: false
  };
  Schedule.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving schedule.",
      });
    });
};

//retrieve schedule by landlord id and if approved true for landlords
exports.findAllScheduleLandlordApproved = (req, res) => {
  var condition = { 
    landlord_id: req.params.id,
    approve_visit: true,
    is_accepted_tenant: false
  };
  Schedule.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving schedule.",
      });
    });
};

//retrieve schedule by landlord id and if approved true for landlords
exports.findAllScheduleTenantApproved = (req, res) => {
  var condition = { 
    tenant_user_id: req.params.id,
    approve_visit: true
  };
  Schedule.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving schedule.",
      });
    });
};


// Find a single Schedule with an id
exports.findOneSchedule = (req, res) => {
  const id = req.params.id;

  Schedule.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Schedule with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Schedule with id=" + id });
    });
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Schedule information to update cannot be empty!",
    });
  }
  
  const id = req.params.id;

  Schedule.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((scheduleData) => {
      if (!scheduleData) {
        return res.status(404).send({
          message: `Cannot update Schedule with id=${id}. Maybe Schedule was not found!`,
        });
      }
      res.send({ message: "Schedule was updated successfully." });
    })
    .catch(err => {
      return res.status(500).send({
        message: `Error updating Schedule with id=${id}: ${err.message}`,
      });
    });
};

exports.updateSchedule = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Schedule information to update can not be empty!",
    });
  }

  const id = req.params.id;

  Schedule.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((scheduleData) => {
      if (!scheduleData) {
        return res.status(404).send({
          message: `Cannot update Schedule with id=${id}. Maybe Schedule was not found!`,
        });
      }

      // Increment the visit counter of the Dorm
      var incrementValue = req.body.visit_counter ? req.body.visit_counter + 1 : 1;
      var dormId = req.body.dorm_id;

      return Dorm.findByIdAndUpdate(
        dormId,
        { visit_counter: incrementValue },
        { useFindAndModify: false, upsert: true }
      );
    })
    .then((dormData) => {
      if (!dormData) {
        return res.status(404).send({
          message: `Cannot update Dorm with id=${dormId}. Maybe Dorm was not found!`,
        });
      }

      res.send({ message: "Schedule and Dorm were updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Schedule with id=" + id,
      });
    });
};


exports.deleteSchedule = (req, res) => {
  const id = req.params.id;

  Schedule.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Schedule with id=${id}. Maybe Schedule was not found!`,
        });
      } else {
        res.send({
          message: "Schedule was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Schedule with id=" + id,
      });
    });
};
