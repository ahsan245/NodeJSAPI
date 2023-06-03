const techUserServices = require("../services/tech-login.service");

exports.create = (req, res, next) => {
    var model = {
        email: req.body.email,
        password: req.body.password,
        techID: req.body.techID
    };

    techUserServices.registerTech(model, (error, results) => {
        if (error) {
            console.log(error);
            return next(error);
        }
        else {
            return res.status(200).send({
                message: "Success",
                data: results
            });
        }
    });
};

exports.login = (req, res, next) => {
    const { email, password } = req.body;

    techUserServices.loginTech({ email, password }, (error, results) => {
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
};

exports.findAll = (req, res, next) => {
    var model = {
        pageSize: req.query.pageSize,
        page: req.query.page,
    };

    techUserServices.getTechUsers(model, (error, results) => {
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
