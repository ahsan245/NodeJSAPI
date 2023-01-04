const techServices = require("../services/techs.service");
const upload = require("../middleware/tech.upload");

exports.create = (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            next(err);
        }
        else {
            const path =
                req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";

            var model = {
                techName: req.body.techName,
                category: req.body.category,
                techShortDescription: req.body.techShortDescription,
                techDescription: req.body.techDescription,
                techPrice: req.body.techPrice,
                techSalePrice: req.body.techSalePrice,
                techType: req.body.techType,
                techStatus: req.body.techStatus,
                techImage: path != "" ? "/" + path : ""

            }
            techServices.createTech(model, (error, results) => {
                if (error) {
                    return next(error);
                }
                else {
                    return res.status(200).send({
                        message: "Success",
                        data: results
                    });
                }


            });
        }
    });
}

exports.findAll = (req, res, next) => {
    var model = {
        techIds:req.query.techIds,
        techName: req.query.techName,
        categoryId: req.query.categoryId,
        pageSize: req.query.pageSize,
        page: req.query.page,
        sort:req.query.sort
    };

    techServices.getTechs(model, (error, results) => {
        if (error) {
            return next(error);
        }
        else {
            return res.status(200).send({
                message: "Success",
                data: results
            });
        }


    });
}



exports.findOne = (req, res, next) => {
    var model = {
        techId: req.params.id,

    };

    techServices.getTechById(model, (error, results) => {
        if (error) {
            return next(error);
        }
        else {
            return res.status(200).send({
                message: "Success",
                data: results
            });
        }


    });
}
exports.countAll = (req, res, next) => {
    techServices.getTechCount((error, count) => {
      if (error) {
        return next(error);
      } else {
        return res.status(200).send({
            messege: "Success",
          count: count,
        });
      }
    });
  };
  exports.countTechs = (req, res, next) => {
    techServices.countTechs((error, results) => {
      if (error) {
        return next(error);
      } else {
        return res.status(200).send({
          messege: "Success",
          data: results,
        });
      }
    });
  };


exports.update = (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            next(err);
        }
        else {
            const path =
                req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";

            var model = {
                techId: req.params.id,
                techName: req.body.techName,
                category: req.body.category,
                techShortDescription: req.body.techShortDescription,
                techDescription: req.body.techDescription,
                techPrice: req.body.techPrice,
                techSalePrice: req.body.techSalePrice,
                techType: req.body.techType,
                techStatus: req.body.techStatus,
                techImage: path != "" ? "/" + path : ""

            }
            techServices.updateTech(model, (error, results) => {
                if (error) {
                    return next(error);
                }
                else {
                    return res.status(200).send({
                        message: "Success",
                        data: results
                    });
                }


            });
        }
    });
}



exports.delete = (req, res, next) => {
    var model = {
        techId: req.params.id,

    };

    techServices.deleteTech(model, (error, results) => {
        if (error) {
            return next(error);
        }
        else {
            return res.status(200).send({
                message: "Success",
                data: results
            });
        }


    });
}