const complainService = require("../services/complains.service");
const technicianService = require("../services/techs.service");
const upload = require("../middleware/complain.upload");
const { category } = require("../models/category.model");


exports.create = (req, res, next) => {
    upload(req, res, async function (err) {
        if (err) {
            next(err);
        } else {
            const imagePath = req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";

            let techniciantoAssign = await complainService.RoundRobinAlgorithm();

            const cat = await category.findOne({ categoryName: req.body.complainCategory });

            const complainCheckList = cat ? cat.categoryCheckList : [];

            var model = {
                user: req.body.user,
                complainName: req.body.complainName,
                complainDescription: req.body.complainDescription,
                complainCategory: req.body.complainCategory,
                assignedTech: techniciantoAssign,
                userAddress: req.body.userAddress,
                userContact: req.body.userContact,
                complainImage: imagePath != "" ? "/" + imagePath : "",
                categoryassigned: cat ? cat._id : null,
                longitude: req.body.longitude,
                latitude: req.body.latitude,
                complainCheckList: complainCheckList,
                refBill: req.body.refBill,
                billAmount: req.body.billAmount,
                startComplain: req.body.startComplain


            };

            complainService.createComplain(model, (error, results) => {
                if (error) {
                    return next(error);
                } else {
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
        categoryassigned: req.query.categoryassigned,
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
exports.getComplainsByTechId = (req, res, next) => {
    const techId = req.params.techId;

    complainService.getComplainsByTechId(techId, (error, complains) => {
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
                refBill: req.body.refBill,
                complainImage: path != "" ? "/" + path : "",
                longitude: req.body.longitude,
                latitude: req.body.latitude,
                complainCheckList: req.body.complainCheckList,
                completeUpdate: req.body.completeUpdate,
                techComment: req.body.techComment,
                paymentStatus: req.body.paymentStatus,
                billAmount: req.body.billAmount,
                startComplain: req.body.startComplain

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