const complainService = require("../services/complains.service");
const technicianService = require("../services/techs.service");
const upload = require("../middleware/complain.upload");

exports.create = (req, res, next) => {
    upload(req, res, async function (err) {
        if (err) {
            next(err);

        } else {
            const path =
                req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";

            let techniciantoAssign = await complainService.RoundRobinAlgorithm();

            // Find the category that matches the complainCategory value
            const category = await category.findOne({ categoryName: req.body.complainCategory });

            var model = {
                user: req.body.user,
                complainName: req.body.complainName,
                complainDescription: req.body.complainDescription,
                complainCategory: req.body.complainCategory,
                categoryassigned: category != null ? category._id : null, // Assign the matching category's ID to the new field, or null if no match was found
                assignedTech: techniciantoAssign,
                userAddress: req.body.userAddress,
                userContact: req.body.userContact,
                complainImage: path != "" ? "/" + path : "",
            };

            complainService.createComplain(model, (error, results) => {
                if (error) {
                    return next(error);
                }
                else {
                    return res.status(200).send({
                        messege: "Success",
                        data: results,
                    });
                }

            });
        }
    });
};


exports.findAll = (req, res, next) => {

    var model = {
        complainName: req.query.complainName,
        userId: req.query.userId,
        assignedTech: req.query.assignedTech,
        pageSize: req.query.pageSize,
        page: req.query.page,


    };

    complainService.getComplain(model, (error, results) => {
        if (error) {
            return next(error);
        }
        else {
            return res.status(200).send({
                messege: "Success",
                data: results,
            });
        }
    });
};
exports.countAll = (req, res, next) => {
    complainService.getComplainCount((error, count) => {
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

exports.countComplain = (req, res, next) => {
    complainService.countComplain((error, results) => {
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
exports.findOne = (req, res, next) => {
    var model = {
        complainId: req.params.id,
    };

    complainService.getComplainById(model, (error, results) => {
        if (error) {
            return next(error);
        }
        else {
            return res.status(200).send({
                messege: "Success",
                data: results,
            });
        }

    });

};
exports.getComplainsByUserId = (req, res, next) => {
    const userId = req.params.userId;

    complainService.getComplainsByUserId(userId, (error, complains) => {
        if (error) {
            return next(error);
        } else {
            return res.status(200).send({
                message: "Success",
                data: complains,
            });
        }
    });
};



exports.find = (req, res, next) => {
    var model = {
        pageSize: req.query.pageSize,
        page: req.query.page,
    }
    complainService.getlastComplain((error, results) => {
        if (error) {
            return next(error);
        }
        else {
            return res.status(200).send({
                messege: "Success",
                data: results,
            });
        }

    });

}

exports.update = (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            next(err);
        } else {
            const path =
                req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";
            var model = {
                complainId: req.params.id,
                complainName: req.body.complainName,
                user: req.body.user,
                complainDescription: req.body.complainDescription,
                complainCategory: req.body.complainCategory,
                assignedTech: req.body.assignedTech,
                userAddress: req.body.userAddress,
                userContact: req.body.userContact,
                complainStatus: req.body.complainStatus,
                complainImage: path != "" ? "/" + path : "",
            };

            complainService.updateComplain(model, (error, results) => {
                if (error) {
                    return next(error);
                }
                else {
                    return res.status(200).send({
                        messege: "Success",
                        data: results,
                    });
                }
            });
        }
    });
};

exports.delete = (req, res, next) => {

    var model = {
        complainId: req.params.id,
    };

    complainService.deleteComplain(model, (error, results) => {
        if (error) {
            return next(error);
        }
        else {
            return res.status(200).send({
                messege: "Success",
                data: results,
            });
        }
    });
};