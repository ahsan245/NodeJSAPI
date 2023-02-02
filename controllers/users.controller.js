const { user } = require("../models/user.model");
const userServices = require("../services/users.service");

exports.register = (req, res, next) => {
    userServices.register(req.body, (error, results) => {
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

exports.login = (req, res, next) => {
    const { email, password } = req.body;

    userServices.login({ email, password }, (error, results) => {
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
        fullName: req.query.fullName,
        pageSize: req.query.pageSize,
        page: req.query.page,

    };

    userServices.getUsers(model, (error, results) => {
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

exports.findOne = (req, res, next) => {
    var model = {
        userId: req.params.id,
    };

    userServices.getUserbyId(model, (error, results) => {
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

exports.otpLogin = (req, res, next) => {
    userServices.createOtp(req.body, (error, results) => {
        if (error) {
            return next(error);

        }

        return res.status(200).send({
            message: "Success",
            data: results
        })
    });

};

exports.verifyOTP = (req, res, next) => {
    userServices.verifyOTP(req.body, (error, results) => {
        if (error) {
            return next(error);

        }

        return res.status(200).send({
            message: "Success",
            data: results,
        })
    });
};