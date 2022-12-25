const relatedTechServices = require("../services/related-techs.services");


exports.create = (req, res, next) => {
    relatedTechServices.addRelatedTech(req.body, (error, results) => {
        if (error) {
            return next(error);

        }
        return res.status(200).send({
            message: "Success",
            data: results
        });
    })
};

exports.delete = (req, res, next) => {
    var model = {
        id: req.params.id,
    };
    relatedTechServices.removeRelatedTech(model, (error, results) => {
        if (error) {
            return next(error);
        }
        else {
            return res.status(200).send({
                message: "Success",
                data: results
            })
        }
    })
};