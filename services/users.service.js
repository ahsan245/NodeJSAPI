const { user } = require("../models/user.model");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const { MONGO_DB_CONFIG } = require("../config/app.config");


async function login({ email, password }, callback) {
    const userModel = await user.findOne({ email });

    if (userModel != null) {
        if (bcrypt.compareSync(password, userModel.password)) {
            const token = auth.generateAccessToken(userModel.toJSON());
            return callback(null, {...userModel.toJSON(), token });
        } else {
            return callback({
                message: "Invalid Email/Password"
            });
        }
    }
    else {
        return callback({
            message: "Invalid Email/Password"
        });
    }
}

async function register(params, callback) {
    if (params.email === undefined) {
        return callback({
            message: "Email Required!"
        });
    }
    let isUserExist = await user.findOne({ email: params.email });

    if (isUserExist) {
        return callback({
            message: "Email is already registered"
        });
    }

    const salt = bcrypt.genSaltSync(10);
    params.password = bcrypt.hashSync(params.password, salt);

    const userSchema = new user(params);
    userSchema.save()
        .then((response) => {
            return callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });
}
async function getUsers(params, callback) {
    const fullName = params.fullName;
    var condition = fullName ? { fullName: { $regex: new RegExp(fullName), $options: "i" } }

        : {};

    let perPage = Math.abs(params.pageSize) || MONGO_DB_CONFIG.pageSize;
    let page = (Math.abs(params.page) || 1) - 1;

    user
        .find(condition, "fullName email")
        .limit(perPage).skip(perPage * page)
        .then((response) => {
            return callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });




}

async function getUserbyId(params, callback) {
    const userId = params.userId;

    user
        .findById(userId)
        .then((response) => {
            if (!response) callback("Not Found User with Id" + userId)
            else callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        }
        );
}


module.exports = {
    login,
    register,
    getUsers,
    getUserbyId
};