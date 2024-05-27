const upload = require("../middlewares/userUpload");
const dbConfig = require("../config/db.config");

const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;
var bcrypt = require("bcryptjs");

const url = dbConfig.url;

// const baseUrl = "http://localhost:8080/user_image/";
// const baseUrl = "http://192.168.1.178:8080/api/user/user_image/";
const baseUrl = "https://dormate-app.onrender.com/api/user/user_image/";
// const baseUrl = process.env.RENDER_URL+"/api/user/user_image/";

const mongoClient = new MongoClient(url);

const db = require("../models");
const User = db.user;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.landlordBoard = (req, res) => {
  res.status(200).send("Landlord Content.");
};

exports.updateUserImage = async (req, res) => {
  const id = req.params.id;
  try {
    //image uploading
    await upload(req, res).then();

    if (req.file == undefined) {
      return res.send({
        message: "You must select a file.",
      });
    }

    var userImage = baseUrl + req.file.filename;
    var imageId = req.file.id;
    image_id_string = imageId.toString();

    console.log(userImage);

    //updates user_image field
    User.findByIdAndUpdate(
      id,
      { user_image: userImage, image_id: image_id_string },
      { useFindAndModify: false }
    )
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update User with id=${id}. Maybe User was not found!`,
          });
        }
        res.send({ message: "User Image was updated successfully." });
      })
      .catch((err) => {
        if (err) {
          res.status(500).send({
            // message: "Error updating User with id=" + id
            message:
              "Error updating User with id=" + id + "user ID is not valid",
          });
          console.log("Error updating User with id=" + id);
        }
      });
  } catch (error) {
    console.log(error);
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).send({
        message: "Too many files to upload.",
      });
    }

    return res.send({
      message: `Error when trying upload image: ${error}`,
    });
  }
};

exports.updateValidId = async (req, res) => {
  const id = req.params.id;
  try {
    //image uploading
    await upload(req, res).then();

    if (req.file == undefined) {
      return res.send({
        message: "You must select a file.",
      });
    }

    var IdImage = baseUrl + req.file.filename;
    var imageId = req.file.id;
    image_id_string = imageId.toString();

    //updates user_image field
    User.findByIdAndUpdate(
      id,
      { valid_identification_image: IdImage, valid_image_id: image_id_string },
      { useFindAndModify: false }
    )
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update User with id=${id}. Maybe User was not found!`,
          });
        }
        res.send({ message: "User Valid ID was updated successfully." });
      })
      .catch((err) => {
        if (err) {
          res.status(500).send({
            // message: "Error updating User with id=" + id
            message:
              "Error updating User with id=" + id + "user ID is not valid",
          });
          console.log("Error updating User with id=" + id);
        }
      });
  } catch (error) {
    console.log(error);
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).send({
        message: "Too many files to upload.",
      });
    }

    return res.send({
      message: `Error when trying upload image: ${error}`,
    });
  }
};

//get list of image files
exports.getListFiles = async (req, res) => {
  try {
    await mongoClient.connect();

    const database = mongoClient.db(dbConfig.database);
    const images = database.collection(dbConfig.imgBucketUser + ".files");

    const cursor = images.find({});

    if ((await cursor.count()) === 0) {
      return res.status(500).send({
        message: "No files found!",
      });
    }

    let fileInfos = [];
    await cursor.forEach((doc) => {
      fileInfos.push({
        name: doc.filename,
        url: baseUrl + doc.filename,
      });
    });

    return res.status(200).send(fileInfos);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

//generate download link for image files
exports.download = async (req, res) => {
  try {
    await mongoClient.connect();

    const database = mongoClient.db(dbConfig.database);
    const bucket = new GridFSBucket(database, {
      bucketName: dbConfig.imgBucketUser,
    });

    let downloadStream = bucket.openDownloadStreamByName(req.params.name);

    downloadStream.on("data", function (data) {
      return res.status(200).write(data);
    });

    downloadStream.on("error", function (err) {
      return res
        .status(404)
        .send({ message: "Cannot download the Image!" + err });
    });

    downloadStream.on("end", () => {
      return res.end();
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

// Retrieve all User from the database.
exports.findAll = (req, res) => {
  const first_name = req.query.first_name;
  var condition = name
    ? {
        first_name: { $regex: new RegExp(first_name), $options: "i" },
        first_name: { $regex: new RegExp(first_name), $options: "i" },
        first_name: { $regex: new RegExp(first_name), $options: "i" },
      }
    : {};

  User.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

// Find a user with an id
exports.retrieveUser = (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found User with id " + id });
      else
        res.send({
          id: data._id,
          username: data.username,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          address: data.address,
          mobile_number: data.mobile_number,
          user_image: data.user_image,
          verified: data.verified,
          dorm_id: data.dorm_id,
          dorm_landlord_user_id: data.dorm_landlord_user_id,
          dorm_title: data.dorm_title,
          is_tenant: data.is_tenant,
          dorm_tenant_date: data.dorm_tenant_date,
        });
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving User with id=" + id });
    });
};

// Edit details of a User by the id in the request
exports.updateUser = (req, res) => {
  const id = req.params.id;

  User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
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

//change password of user
exports.changePassword = (req, res) => {
  const id = req.params.id;
  const newPassword = bcrypt.hashSync(req.body.new_password, 8);
  User.findOne({ _id: id })
    .populate("password")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!user) {
        return res
          .status(404)
          .send({ message: "Username or Password does not match" });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res
          .status(401)
          .send({ message: "Current Password does not match!" });
      }

      User.findByIdAndUpdate(
        id,
        { password: newPassword },
        { useFindAndModify: false }
      )
        .then((data) => {
          if (!data) {
            res.status(404).send({
              message: `Cannot update User Password with id=${id}. Maybe User was not found!`,
            });
          } else
            res.send({ message: "User Password was updated successfully." });
        })
        .catch((err) => {
          res.status(500).send({
            message: "Error updating User Password with id =" + id,
          });
        });
    });

  // User.findByIdAndUpdate(id, {password: newPassword}, { useFindAndModify: false })
  //   .then((data) => {
  //     if (!data) {
  //       res.status(404).send({
  //         message: `Cannot update User Password with id=${id}. Maybe User was not found!`,
  //       });
  //     } else res.send({ message: "User Password was updated successfully." });
  //   })
  //   .catch((err) => {
  //     res.status(500).send({
  //       message: "Error updating User Password with id =" + id,
  //     });
  //   });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  User.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
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

exports.addFriend = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "User information to update cannot be empty!",
    });
  }

  try {
    const { id } = req.params;
    const newFriends = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send({
        message: `User not found with id ${id}.`,
      });
    }

    const usersToAdd = [];
    const alreadyFriends = [];

    for (const newFriend of newFriends) {
      const { friend_user_id } = newFriend;

      const friend = await User.findById(friend_user_id);
      if (!friend) {
        return res.status(404).send({
          message: `Friend not found with id ${friend_user_id}.`,
        });
      }

      const existingFriend = user.friend_list.some(
        (friend) => friend.friend_user_id === friend_user_id
      );

      if (!existingFriend) {
        usersToAdd.push(newFriend);
      } else {
        alreadyFriends.push(friend_user_id);
      }
    }

    if (usersToAdd.length > 0) {
      user.friend_list.push(...usersToAdd);
      await user.save();
    }

    let responseMessage = "Friends added successfully.";
    if (alreadyFriends.length > 0) {
      responseMessage += ` Friend were already in the friend list`;
    }

    res.send({
      message: responseMessage,
      addedFriends: usersToAdd,
      alreadyFriends,
    });
  } catch (err) {
    console.error("Error adding user as friend:", err);
    res.status(500).send({
      message: "Failed to add user as friend.",
    });
  }
};




// Retrieve all Dorm from the database.
exports.findAllUser = (req, res) => {
  const title = req.query.title;
  var condition = {
    verified: true,
  };

  User.find({
    $and: [
      {
        $or: [
          { username: { $regex: new RegExp(title), $options: "i" } },
          { first_name: { $regex: new RegExp(title), $options: "i" } },
          { last_name: { $regex: new RegExp(title), $options: "i" } },
        ],
      },
      condition,
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving dormitory.",
      });
    });
};

// Retrieve all Dorm from the database.
exports.findUserFriendRequest = (req, res) => {
  const title = req.query.title;
  const userId = req.params.id;
  const condition = {
    friend_approved: false,
    verified: true,
    friend_user_id: userId,
    requested_by_user_id: { $ne: userId },
  };

  User.find(
    // {
    // $and: [
    //   {
    //     $or: [
    //       { username: { $regex: new RegExp(title), $options: "i" } },
    //       { first_name: { $regex: new RegExp(title), $options: "i" } },
    //       { last_name: { $regex: new RegExp(title), $options: "i" } },
    //     ],
    //   },
      condition
  //   ],
  // }
  )
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving dormitory.",
      });
    });
};
