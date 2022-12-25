const { response } = require("express");
const { MONGO_DB_CONFIG } = require("../config/app.config");
const { complain } = require("../models/complain.model");
const {user} = require("../models/user.model")

async function createComplain(params, callback) {
    if (!params.complainName) {
        return callback({
            messege: "Complain Name Required"
        }, ""

        );
    }
    if (!params.user) {
        return callback(
            {
                message: "User required",
            },
            ""
        );
    }

    const model = new complain(params);
    model
        .save()
        .then((response) => {
            return callback(null, response);

        })
        .catch((error) => {
            return callback(error);
        });
}


async function getComplain(params, callback) {
    const complainName = params.complainName;
    const userId = params.userId;
    var condition = {};
    

    if (complainName) {
        condition["complainName"] = {
            $regex: new RegExp(complainName), $options: "i"
        };
    }
    if (userId) {
        condition["user"] = userId;
    }
   

    let perPage = Math.abs(params.pageSize) || MONGO_DB_CONFIG.pageSize;
    let page = (Math.abs(params.page) || 1) - 1;


    complain
        .find(condition, "complainName complainDescription complainCategory assignedTech userAddress userContact complainImage")
        .populate("user", "userId fullName")
        .limit(perPage)
        .skip(perPage * page)
        .then((response) => {
            return callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });


}



async function getComplainById(params, callback) {
    const complainId = params.complainId;

    complain
        .findById(complainId)
        .populate("user", "userId")
        .then((response) => {
            if (!response) callback("Not Found complain with Id" + complainId)
            else callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        }
        );


}



async function updateComplain(params, callback) {
    const complainId = params.complainId;

    complain
        .findByIdAndUpdate(complainId, params, { useFindAndModify: false })
        .then((response) => {
            if (!response) callback("Not Found complain with Id" + complainId)
            else callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        }
        );


}



async function deleteComplain(params, callback) {
    const complainId = params.complainId;

    complain
        .findByIdAndDelete(complainId)
        .then((response) => {
            if (!response) callback("Not Found Category with Id" + complainId)
            else callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        }
        );


}


module.exports = {
    createComplain,
    getComplain,
    getComplainById,
    updateComplain,
    deleteComplain
};