const db = require("../models");
const Dorm = db.dormitory;

const upload = require("../middlewares/dormUpload");
const uploadCert = require("../middlewares/certificateUpload");
const dbConfig = require("../config/db.config");

const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;

const url = dbConfig.url;

// const baseUrl = "http://localhost:8080/api/dorm/dorm_images/";
// const certBaseUrl = "http://localhost:8080/api/dorm/dorm_images/certificate/" https://dormate-app.onrender.com

// const baseUrl = "http://192.168.1.178:8080/api/dorm/dorm_images/";
// const certBaseUrl = "http://192.168.1.178:8080/api/dorm/dorm_images/certificate/"

const baseUrl = "https://dormate-app.onrender.com/api/dorm/dorm_images/";
const certBaseUrl = "https://dormate-app.onrender.com/api/dorm/dorm_images/certificate/"

// const baseUrl = process.env.RENDER_URL+"/api/dorm/dorm_images/";
// const certBaseUrl = process.env.RENDER_URL+"/api/dorm/dorm_images/certificate/"

const mongoClient = new MongoClient(url);

// Create and Save a new Dormitory
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Dorm
  const dormitory = new Dorm({
    user_id: req.body.user_id,
    title: req.body.title,
    description: req.body.description,
    address: req.body.address,
    lessor: req.body.lessor,
    bedroom: req.body.bedroom,
    bathroom: req.body.bathroom,
    rent: req.body.rent,
    contact_number: req.body.contact_number,
    username: req.body.username,
    user_image: req.body.user_image,
    for_rent: req.body.for_rent ? req.body.for_rent : false,
    dorm_images: req.body.dorm_images,
    publish: false,
  });

  // Save Dorm in the database
  dormitory
    .save(dormitory)
    .then((data) => {
      console.log(data);
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

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Dorm information to update can not be empty!"
    });
  }

  const id = req.params.id;

  Dorm.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
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

exports.addDormImages = async (req, res) => {
  const id = req.params.id;
  try {
    //image uploading
    await upload(req, res).then();
    let file_array = [];

    for (let i = 0; i < req.files.length; i++) {
      var dormLink = baseUrl + req.files[i].filename;

      file_array.push(dormLink);
    }
    console.log(file_array);

    if (req.files.length <= 0) {
      return res
        .status(400)
        .send({ message: "You must select at least 1 file." });
    }

    //updates dorm images field
    Dorm.findByIdAndUpdate(
      id,
      { dorm_images: file_array },
      { useFindAndModify: false }
    )
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update Dorm with id=${id}. Maybe Dorm was not found!`,
          });
        }
        console.log("Dorm was updated successfully.");
        res.send({ message: "Dorm was updated successfully." });
      })
      .catch((err) => {
        if (err) {
          res.status(500).send({
            message:
              "Error updating Dorm with id=" + id + "Dorm ID is not valid",
          });
          console.log("Error updating Dorm with id=" + id);
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

exports.addBusinessRegImage = async (req, res) => {
  const id = req.params.id;

  try {
    //image uploading
    await uploadCert(req, res).then();

    if (req.file == undefined) {
      return res.send({
        message: "You must select a file.",
      });
    }

    var businessRegImage = certBaseUrl + req.file.filename;

    //updates user_image field
    Dorm.findByIdAndUpdate(
      id,
      { business_registration_image: businessRegImage },
      { useFindAndModify: false }
    )
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update Dorm with id=${id}. Maybe Dorm was not found!`,
          });
        }
        console.log("Dorm was updated successfully.");
        res.send({ message: "Dorm was updated successfully." });
      })
      .catch((err) => {
        if (err) {
          res.status(500).send({
            // message: "Error updating User with id=" + id
            message:
              "Error updating Dorm with id=" + id + "Dorm ID is not valid",
          });
          console.log("Error updating Dorm with id=" + id);
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

exports.addBarangayClearanceImage = async (req, res) => {
  const id = req.params.id;
  try {
    //image uploading
    await uploadCert(req, res).then();

    if (req.file == undefined) {
      return res.send({
        message: "You must select a file.",
      });
    }

    var barangayClearanceImg = certBaseUrl + req.file.filename;

    //updates user_image field
    Dorm.findByIdAndUpdate(
      id,
      { barangay_clearance_image: barangayClearanceImg },
      { useFindAndModify: false }
    )
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update Dorm with id=${id}. Maybe Dorm was not found!`,
          });
        }
        console.log("Dorm was updated successfully.");
        res.send({ message: "Dorm was updated successfully." });
      })
      .catch((err) => {
        if (err) {
          res.status(500).send({
            // message: "Error updating User with id=" + id
            message:
              "Error updating Dorm with id=" + id + "Dorm ID is not valid",
          });
          console.log("Error updating Dorm with id=" + id);
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

exports.addMayorPermitImage = async (req, res) => {
  const id = req.params.id;
  try {
    //image uploading
    await uploadCert(req, res).then();

    if (req.file == undefined) {
      return res.send({
        message: "You must select a file.",
      });
    }

    var mayorPermitImg = certBaseUrl + req.file.filename;

    //updates user_image field
    Dorm.findByIdAndUpdate(
      id,
      { mayor_permit_image: mayorPermitImg },
      { useFindAndModify: false }
    )
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update Dorm with id=${id}. Maybe Dorm was not found!`,
          });
        }
        console.log("Dorm was updated successfully.");
        res.send({ message: "Dorm was updated successfully." });
      })
      .catch((err) => {
        if (err) {
          res.status(500).send({
            // message: "Error updating User with id=" + id
            message:
              "Error updating Dorm with id=" + id + "Dorm ID is not valid",
          });
          console.log("Error updating Dorm with id=" + id);
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

exports.addBfpImage = async (req, res) => {
  const id = req.params.id;
  try {
    //image uploading
    await uploadCert(req, res).then();

    if (req.file == undefined) {
      return res.send({
        message: "You must select a file.",
      });
    }

    var bfpImage = certBaseUrl + req.file.filename;

    //updates user_image field
    Dorm.findByIdAndUpdate(
      id,
      { bfp_permit_image: bfpImage },
      { useFindAndModify: false }
    )
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update Dorm with id=${id}. Maybe Dorm was not found!`,
          });
        }
        console.log("Dorm was updated successfully.");
        res.send({ message: "Dorm was updated successfully." });
      })
      .catch((err) => {
        if (err) {
          res.status(500).send({
            // message: "Error updating User with id=" + id
            message:
              "Error updating Dorm with id=" + id + "Dorm ID is not valid",
          });
          console.log("Error updating Dorm with id=" + id);
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

exports.addSanitaryImage = async (req, res) => {
  const id = req.params.id;
  try {
    //image uploading
    await uploadCert(req, res).then();

    if (req.file == undefined) {
      return res.send({
        message: "You must select a file.",
      });
    }

    var sanitaryImg = certBaseUrl + req.file.filename;

    //updates user_image field
    Dorm.findByIdAndUpdate(
      id,
      { sanitary_permit_image: sanitaryImg },
      { useFindAndModify: false }
    )
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update Dorm with id=${id}. Maybe Dorm was not found!`,
          });
        }
        console.log("Dorm was updated successfully.");
        res.send({ message: "Dorm was updated successfully." });
      })
      .catch((err) => {
        if (err) {
          res.status(500).send({
            // message: "Error updating User with id=" + id
            message:
              "Error updating Dorm with id=" + id + "Dorm ID is not valid",
          });
          console.log("Error updating Dorm with id=" + id);
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

// exports.uploadFiles = async (req, res) => {
//   try {
//     await upload(req, res);
//     let file_array = [];

//     for (let i = 0; i < req.files.length; i++) {
//       var dormLink = baseUrl + req.files[i].filename;
//       // console.log(req.files[i].filename);
//       // dormLink = req.file[i].filename;
//       file_array.push(dormLink);
//     }
//     console.log(file_array);
//   } catch (error) {
//     console.log(error);

//     if (error.code === "LIMIT_UNEXPECTED_FILE") {
//       return res.status(400).send({
//         message: "Too many files to upload.",
//       });
//     }
//     return res.status(500).send({
//       message: `Error when trying upload many files: ${error}`,
//     });

//     // return res.send({
//     //   message: "Error when trying upload image: ${error}",
//     // });
//   }
// };

exports.getListFiles = async (req, res) => {
  try {
    await mongoClient.connect();

    const database = mongoClient.db(dbConfig.database);
    const images = database.collection(dbConfig.imgBucket + ".files");

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

exports.download = async (req, res) => {
  try {
    await mongoClient.connect();

    const database = mongoClient.db(dbConfig.database);
    const bucket = new GridFSBucket(database, {
      bucketName: dbConfig.imgBucketDorm,
    });

    let downloadStream = bucket.openDownloadStreamByName(req.params.name);

    downloadStream.on("data", function (data) {
      return res.status(200).write(data);
    });

    downloadStream.on("error", function (err) {
      return res.status(404).send({ message: "Cannot download the Image!" });
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

exports.downloadCert = async (req, res) => {
  try {
    await mongoClient.connect();

    const database = mongoClient.db(dbConfig.database);
    const bucket = new GridFSBucket(database, {
      bucketName: dbConfig.imgBucketCertificate,
    });

    let downloadStream = bucket.openDownloadStreamByName(req.params.name);

    downloadStream.on("data", function (data) {
      return res.status(200).write(data);
    });

    downloadStream.on("error", function (err) {
      return res.status(404).send({ message: "Cannot download the Image!" });
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

// Retrieve all Dorm from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;

  Dorm.find({ $or: [ { title: {$regex: new RegExp(title), $options: "i" } }, { address: {$regex: new RegExp(title), $options: "i" } } ] })
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

//find all dorm posts that are approved
exports.findAllApproved = (req, res) => {
  var condition = { 
      publish: true
    };

  Dorm.find(condition)
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


exports.findAllApprovedDormByUser = (req, res) => {
  var id = req.params.id
  var condition = { 
      user_id: id,
      publish: true
    };

  Dorm.find(condition)
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


// Find a single Dorm with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Dorm.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Dormitory with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Dormitory with id=" + id });
    });
};

// Update a Dorm by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Dorm.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Dormitory with id=${id}. Maybe Dormitory was not found!`,
        });
      } else res.send({ message: "Dormitory was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Dormitory with id=" + id,
      });
    });
};

// Delete a Dormitory with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Dorm.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
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

// Delete all Dorm from the database.
// exports.deleteAll = (req, res) => {
//   Dorm.deleteMany({})
//     .then((data) => {
//       res.send({
//         message: `${data.deletedCount} Dormitory were deleted successfully!`,
//       });
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while removing all dormitory.",
//       });
//     });
// };

// Find all published Dormitory
exports.findAllForRent = (req, res) => {
  Dorm.find({ for_rent: true })
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

exports.findAllForApproval = (req, res) => {
  const id = req.params.id;
  Dorm.find({ user_id: id, published: false })
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
