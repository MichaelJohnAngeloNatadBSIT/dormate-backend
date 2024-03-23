module.exports = app => {
  const dormitory = require("../controllers/dorm.controller.js");

  var router = require("express").Router();

  // Create a new Dorm
  // router.post("/", dormitory.create);

  // Retrieve all Dormitory
  router.get("/", dormitory.findAll);

  // Retrieve all Dormitory
  router.get("/rent_high", dormitory.findAllWithRentLowToHigh);

  // Retrieve all Dormitory
  router.get("/rent_low", dormitory.findAllWithRentHighToLow);

  // Retrieve all Dormitory
  router.get("/find_all_approved", dormitory.findAllApproved);

  // Retrieve all for rent Dormitory
  router.get("/for_rent", dormitory.findAllForRent);

  // Retrieve all published Dormitory
  router.get("/for_approval/:id", dormitory.findAllForApproval);
  router.get("/approved_dorm/:id", dormitory.findAllApprovedDormByUser);

  // Retrieve a single Dorm with id
  router.get("/find_one/:id", dormitory.findOne);

  // Update a Dorm with id
  router.put("/update/:id", dormitory.update);

  // Delete a Dorm with id
  router.delete("/delete/:id", dormitory.delete);

  router.post("/create/", dormitory.create);

  router.put("/add_images/:id", dormitory.addDormImages);
  router.put("/add_business_registration_image/:id", dormitory.addBusinessRegImage);
  router.put("/add_baragay_clearance_image/:id", dormitory.addBarangayClearanceImage);
  router.put("/add_bfp_image/:id", dormitory.addBfpImage);
  router.put("/add_mayor_permit_image/:id", dormitory.addMayorPermitImage);
  router.put("/add_sanitary_image/:id", dormitory.addSanitaryImage);

  // router.post("/upload/dorm_images", dormitory.uploadFiles);

  router.get("/dorm_images/:name", dormitory.download);
  router.get("/dorm_images/certificate/:name", dormitory.downloadCert);
  router.post("/get/dorm/images", dormitory.getListFiles);

  app.use('/api/dorm', router);
  };