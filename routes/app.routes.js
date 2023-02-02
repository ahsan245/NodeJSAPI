const categoryController = require("../controllers/categories.controller");
const techController = require("../controllers/techs.controller");
const userController = require("../controllers/users.controller");
const sliderController = require("../controllers/slider.controller");
const relatedTechController = require("../controllers/related-tech.controller");
const complainController = require("../controllers/complains.controller")

const express = require("express");
const { slider } = require("../models/slider.model");
const router = express.Router();

router.post("/category", categoryController.create);
router.get("/category", categoryController.findAll);
router.get("/category/count", categoryController.countAll);
router.get("/category/:id", categoryController.findOne);
router.put("/category/:id", categoryController.update);
router.delete("/category/:id", categoryController.delete);




router.post("/tech", techController.create);
router.get("/tech", techController.findAll);
router.get("/tech/count", techController.countAll);
router.get("/tech/activecount", techController.countTechs);
router.get("/tech/:id", techController.findOne);
router.put("/tech/:id", techController.update);
router.delete("/tech/:id", techController.delete);

router.post("/slider", sliderController.create);
router.get("/slider", sliderController.findAll);
router.get("/slider/:id", sliderController.findOne);
router.put("/slider/:id", sliderController.update);
router.delete("/slider/:id", sliderController.delete);

router.post("/relatedTech", relatedTechController.create);
router.delete("/relatedTech/:id", relatedTechController.delete);

router.post("/complain", complainController.create);
router.get("/complain", complainController.findAll);
router.get("/lastcomplain", complainController.find);
router.get("/complain/activecount", complainController.countComplain);
router.get("/complain/count", complainController.countAll);
router.get("/complain/:id", complainController.findOne);
router.put("/complain/:id", complainController.update);
router.delete("/complain/:id", complainController.delete);

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/login", userController.findAll);
router.post("/otpLogin", userController.otpLogin);
router.post("/verifyOTP", userController.verifyOTP);
router.get("/login/:id", userController.findOne);



module.exports = router;