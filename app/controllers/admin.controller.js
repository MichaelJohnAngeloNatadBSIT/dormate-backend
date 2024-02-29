const config = require("../config/admin.auth.config");
const db = require("../models");
const Admin = db.admin;
const Role = db.role;
const User = db.user;
const Schedule = db.schedule;
const Dorm = db.dormitory;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");


exports.signup = (req, res) => {
  const admin = new Admin({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    address: req.body.address,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    user_image: req.body.user_image,
    mobile_number: req.body.mobile_number,
  });

  admin.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          admin.roles = roles.map((role) => role._id);
          admin.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "Admin was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "admin" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "Admin was registered successfully!" });
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  Admin.findOne({
    username: req.body.username,
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(400).send({ message: "Username or Password does not match" });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({ message: "Invalid Password!" });
      }

      const token = jwt.sign({ id: user.id },
                              config.secret,
                              {
                                algorithm: 'HS256',
                                allowInsecureKeySizes: true,
                                expiresIn: 86400, // 24 hours
                              });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }

      req.session.token = token;

      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        address: user.address,
        mobile_number: user.mobile_number,
        roles: authorities,
        accessToken: token,
        message: "Logged in Successfully"
      });
      
    });
    
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};


// Create and Save a new Dormitory
exports.createDorm = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Dorm
  const dormitory = new Dormitory({
    user_id: req.body.user_id,
    title: req.body.title,
    description: req.body.description,
    address: req.body.address,
    lessor: req.body.lessor,
    bedroom: req.body.bedroom,
    bathroom: req.body.bathroom,
    rent: req.body.rent,
    for_rent: req.body.for_rent ? req.body.for_rent : false,
    dorm_images: req.body.dorm_images,
    publish: false,
  });

  // Save Dorm in the database
  dormitory
    .save(dormitory)
    .then((data) => {
      res.send({
        message: "Dormitory post was created successfully.",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Dormitory.",
      });
    });
};

// Find a single Dorm with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Dorm.findById(id)
    .then((data) => {
      if (!data)
        res.status(400).send({ message: "Not found Dormitory with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Dormitory with id=" + id });
    });
};

// Retrieve All Dorm
exports.retrieveAllDorm = (req, res) => {
  Dorm.find()
    .then((data) => {
      if (!data)
        res.status(400).send({ message: "There are currently no dorm."});
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving Dorms" });
    });
};

exports.countDorm = (req, res) => {
  Dorm.countDocuments().then((data) => {
  if (!data)
      res.status(400).send({ message: "There are currently no dorm."});
  else res.status(200).send({data});
  })
  .catch((err) => {
    res.status(500).send({ message: "Error retrieving count of Dorms" });
  });;
}

exports.countDormApproved = (req, res) => {
  var condition = { 
    publish: true
  };
  Dorm.find(condition).countDocuments().then((data) => {
  if (!data)
      res.status(400).send({ message: "There are currently no dorm."});
  else res.status(200).send({data});
  })
  .catch((err) => {
    res.status(500).send({ message: "Error retrieving count of Dorms" });
  });;
}

exports.updateDorm = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Dorm information to update can not be empty!"
    });
  }

  const id = req.params.id;

  Dorm.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(400).send({
          message: `Cannot update Dorm with id=${id}. Maybe Dorm was not found!`
        });
      } else res.send({ message: "Dorm was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Dorm with id=" + id
      });
    });
};

// Delete a Dormitory with the specified id in the request
exports.deleteDormById = (req, res) => {
  const id = req.params.id;

  Dorm.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(400).send({
          message: `Cannot delete Dormitory with id=${id}. Maybe Dormitory was not found!`,
        });
      } else {
        res.send({
          message: "Dormitory was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Dormitory with id=" + id,
      });
    });
};


// Retrieve All User
exports.retrieveAllUser = (req, res) => {
  const id = req.params.id;

  User.find()
    .then((data) => {
      if (!data)
        res.status(400).send({ message: "There are currently no user."});
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving User" });
    });
};
exports.findOneUser = (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .then((data) => {
      if (!data)
        res.status(400).send({ message: "Not found User with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving User with id=" + id });
    });
};

exports.countUser = (req, res) => {
  User.countDocuments().then((data) => {
  if (!data)
      res.status(400).send({ message: "There are currently no user."});
  else res.status(200).send({data});
  })
  .catch((err) => {
    res.status(500).send({ message: "Error retrieving count of Users" });
  });;
}


// Edit details of a User by the id in the request
exports.updateUser = (req, res) => {
  const id = req.params.id;

  User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(400).send({
          message: `Cannot update User with id=${id}. Maybe User was not found!`,
        });
      } else res.send({ message: "User was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User with id=" + id,
      });
    });
};



// Delete a Dormitory with the specified id in the request
exports.deleteUserById = (req, res) => {
  const id = req.params.id;

  User.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(400).send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
        });
      } else {
        res.send({
          message: "User was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with id=" + id,
      });
    });
};

// Retrieve All User
exports.retrieveAllSchedules = (req, res) => {
  const id = req.params.id;

  Schedule.find()
    .then((data) => {
      if (!data)
        res.status(400).send({ message: "There are currently no user."});
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving User" });
    });
};

exports.countSchedules = (req, res) => {
  Schedule.countDocuments().then((data) => {
  if (!data)
      res.status(400).send({ message: "There are currently no dorm."});
  else res.status(200).send({data});
  })
  .catch((err) => {
    res.status(500).send({ message: "Error retrieving count of Dorms" });
  });;
}










