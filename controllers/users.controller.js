const userServices = require("../services/users.service");
const upload = require("../middleware/user.upload")
require("dotenv").config();


exports.create = (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            next(err);
        }
        else {
            const path =
                req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";

            var model = {
                fullName: req.body.fullName,
                email: req.body.email,
                password: req.body.password,
                contact: req.body.contact,
                userImage: path != "" ? "/" + path : "",

            };
            userServices.register(model, (error, results) => {
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
};


exports.update = (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            next(err);
        } else {
            const path =
                req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";
            var model = {
                userId: req.params.id,
                fullName: req.body.fullName,
                email: req.body.email,
                contact: req.body.contact,
                password: req.body.password,
                userImage: path != "" ? "/" + path : "",


            };
            userServices.updateUser(model, (error, results) => {
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
exports.resetPassword = (req, res, next) => {
    const { email, password } = req.body;

    userServices.resetPassword(email, password, (error, result) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            message: "Success",
            data: result,
        });
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


exports.otpEmailLogin = (req, res, next) => {
    userServices.createEmailOtp(req.body, (error, results) => {
        if (error) {
            return next(error);

        }

        return res.status(200).send({
            message: "Success",
            data: results
        })
    });

};


exports.otpEmailLoginFarzam = (req, res, next) => {
    userServices.farzamcreateEmailOtp(req.body, (error, results) => {
        if (error) {
            return next(error);

        }

        return res.status(200).send({
            message: "Success",
            data: results
        })
    });

};
exports.rashidEmailLogin = (req, res, next) => {
    userServices.rashidEmailOtp(req.body, (error, results) => {
        if (error) {
            return next(error);

        }

        return res.status(200).send({
            message: "Success",
            data: results
        })
    });

};

exports.verifyEmailOTP = (req, res, next) => {
    userServices.verifyEmailOTP(req.body, (error, results) => {
        if (error) {
            return next(error);

        }

        return res.status(200).send({
            message: "Success",
            data: results,
        })
    });
};
