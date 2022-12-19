const categoryController = require("../controllers/categories.controller");
const techController = require("../controllers/techs.controller");
const userController = require("../controllers/users.controller");
const express = require("express");
const router = express.Router();

router.post("/category", categoryController.create);
router.get("/category", categoryController.findAll);
router.get("/category/:id", categoryController.findOne);
router.put("/category/:id", categoryController.update);
router.delete("/category/:id", categoryController.delete);



router.post("/tech", techController.create);
router.get("/tech", techController.findAll);
router.get("/tech/:id", techController.findOne);
router.put("/tech/:id", techController.update);
router.delete("/tech/:id", techController.delete);


router.post("/register", userController.register);
router.post("/login", userController.login);

module.exports = router;