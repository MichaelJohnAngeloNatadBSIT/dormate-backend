const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/test/landlord",
    [authJwt.verifyToken, authJwt.isLandlord],
    controller.landlordBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  app.put("/user/update_user_image/:id", controller.updateUserImage);
  app.put("/user/update_valid_id/:id", controller.updateValidId);
  app.put("/user/update_user_details/:id", controller.updateUser);
  app.put("/user/change_password/:id", controller.changePassword);
  app.get("/user/files", controller.getListFiles);
  app.get("/user/files/:name", controller.download);
  app.get("/user/:id", controller.retrieveUser);
  app.get("/user_image/:name", controller.download);

  // return app.use("/", router);
};