const upload = require("../middleware/user.upload")
const userServices = require("../services/users.service");

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