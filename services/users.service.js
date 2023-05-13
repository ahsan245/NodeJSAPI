const { user } = require("../models/user.model");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const { MONGO_DB_CONFIG } = require("../config/app.config");
const otpGenerator = require("otp-generator");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const key = "otp-secret-key";
require("dotenv").config();

const accountSid = process.env.ACCKEY;
const authToken = process.env.AUThTOKENKEY;
const client = require('twilio')(accountSid, authToken);




async function login({ email, password }, callback) {
    const userModel = await user.findOne({ email });

    if (userModel != null) {
        if (bcrypt.compareSync(password, userModel.password)) {
            const token = auth.generateAccessToken(userModel.toJSON());
            return callback(null, { ...userModel.toJSON(), token });
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
    console.log(params.userImage);
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
    if (!params.contact) {
        return callback(
            {
                message: "Contact Required",
            },
            ""
        );
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
        .find(condition, "fullName email contact userImage")
        .limit(perPage).skip(perPage * page)
        .then((response) => {
            return callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });


}


async function updateUser(params, callback) {
    const userId = params.userId;
    const salt = bcrypt.genSaltSync(10);
    params.password = bcrypt.hashSync(params.password, salt);

    user
        .findByIdAndUpdate(userId, params, { useFindAndModify: false })
        .then((response) => {
            if (!response) callback("Not Found User with Id" + userId)
            else callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        }
        );


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

async function createOtp(params, callback) {
    const otp = otpGenerator.generate(4, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    });

    const ttl = 5 * 60 * 1000;
    const expires = Date.now() + ttl;
    const data = `${params.phone}.${otp}.${expires}`;
    const hash = crypto.createHmac("sha256", key).update(data).digest("hex");
    const fullHash = `${hash}.${expires}`;
    const otpp = `${otp}`;

    console.log(`Your OTP is ${otp}`);

    //SEND SMS;
    client.messages
        .create({
            body: otpp + " is your Theek-Karo OTP. Do not share it with anyone.",
            to: "+92" + params.phone,
            from: '+16063571913'
        })
        .then(message => console.log(message))
        .catch(error => console.log(error))
    return callback(null, fullHash);
}


async function verifyOTP(params, callback) {

    let [hashValue, expires] = params.hash.split('.');
    let now = Date.now();
    if (now > parseInt(expires)) return callback("OTP Expired");

    let data = `${params.phone}.${params.otp}.${expires}`;
    let newCalculateHash = crypto
        .createHmac("sha256", key)
        .update(data)
        .digest("hex");

    if (newCalculateHash === hashValue) {
        return callback(null, "Success");
    }

    return callback("Invalied OTP");
}

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "ahsan23saleem1@gmail.com",
        pass: "jvqoxndbxxhgtzbj"
    }
});

function createEmailOtp(params, callback) {
    const otp = otpGenerator.generate(4, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    });

    const ttl = 5 * 60 * 1000;
    const expires = Date.now() + ttl;
    const data = `${params.email}.${otp}.${expires}`;
    const hash = crypto.createHmac("sha256", key).update(data).digest("hex");
    const fullHash = `${hash}.${expires}`;

    console.log(`Your OTP is ${otp}`);

    // Send email with OTP
    const mailOptions = {
        from: "ahsan23saleem1@gmail.com",
        to: params.email,
        subject: "Your OTP for Theek-Karo",
        text: `${otp} is your Theek-Karo OTP. Do not share it with anyone.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return callback(error);
        } else {
            console.log(`OTP email sent to ${params.email}`);
            return callback(null, fullHash);
        }
    });
}


module.exports = {
    login,
    register,
    getUsers,
    getUserbyId,
    createOtp,
    verifyOTP,
    updateUser,
    createEmailOtp
};
