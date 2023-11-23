const { verifyAdminSignUp } = require("../middlewares");
const controller = require("../controllers/admin.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers: *", 
      "Origin, Content-Type, Accept"
      );
    next();
  });

  app.post(
    "/api/admin/signup",
    [
      verifyAdminSignUp.checkDuplicateUsernameOrEmail,
      verifyAdminSignUp.checkRolesExisted,
    ],
    controller.signup
  );

  app.post("/api/admin/signin", controller.signin);
  app.post("/api/admin/signout", controller.signout);

  app.get("/api/admin/all_user", controller.retrieveAllUser);
  app.get("/api/admin/count_user", controller.countUser);
  app.put("/api/admin/update_user/:id", controller.updateUser)
  app.delete("/api/admin/delete_user/:id", controller.deleteUserById)

  app.get("/api/admin/all_dorm", controller.retrieveAllDorm);
  app.get("/api/admin/count_dorm", controller.countDorm);
  app.get("/api/admin/count_dorm_approved", controller.countDormApproved);
  app.get("/api/admin/find_one/:id", controller.findOne);
  app.post("/api/admin/create_dorm", controller.createDorm);
  app.put("/api/admin/update_dorm/:id", controller.updateDorm)
  app.delete("/api/admin/delete_dorm/:id", controller.deleteDormById)
};
