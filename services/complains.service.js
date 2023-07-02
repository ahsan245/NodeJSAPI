const { response } = require("express");
const { MONGO_DB_CONFIG } = require("../config/app.config");
const { complain } = require("../models/complain.model");
const { user } = require("../models/user.model")
const tech = require("./techs.service");

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
            const formattedDate = response.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            const formattedTime = response.createdAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric' });
            console.log("Complaint saved:", response);
            console.log("Complaint creation date:", formattedDate);
            console.log("Complaint creation time:", formattedTime);
            response = {
                complain: response,
                creationDate: formattedDate,
                creationTime: formattedTime
            };
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
        .find(condition, "complainCheckList complainStatus complainName complainDescription complainCategory userAddress userContact complainImage longitude latitude completeUpdate techComment refBill paymentStatus billAmount startComplain createdAt")
        .populate("user", "userId fullName email contact")
        .populate("assignedTech", "techId techName")
        .populate("categoryassigned", "categoryId categoryName categoryCheckList")
        .limit(perPage)
        .skip(perPage * page)
        .then((response) => {
            response.forEach(complain => {
                if (!complain.assignedTech || complain.assignedTech === "") {
                    complain.complainStatus = false;
                } else {
                    complain.complainStatus = true;
                }
            });

            const formattedDate = complain.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            const formattedTime = complain.createdAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric' });
            console.log("Complaint saved:", response);
            console.log("Complaint creation date:", formattedDate);
            console.log("Complaint creation time:", formattedTime);
            response = {
                complain: response,
                creationDate: formattedDate,
                creationTime: formattedTime
            };
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
        .populate("user", "userId fullName email contact")
        .populate("assignedTech", "techId techName")
        .then((response) => {

            if (!response) callback("Not Found complain with Id" + complainId)
            else callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        }
        );


}
async function getComplainsByUserId(userId, callback) {
    try {
        const complains = await complain.find({ user: userId })
            .populate("user", "userId fullName email contact")
            .populate("assignedTech", "techId techName")
            .exec();

        if (!complains.length) {
            callback("No complains found for user with id " + userId);
        } else {
            callback(null, complains);
        }
    } catch (error) {
        callback(error);
    }
}
async function getComplainsByTechId(techId, callback) {
    try {
        const complains = await complain.find({ assignedTech: techId })
            .populate("user", "userId fullName email contact")
            .populate("assignedTech", "techId techName")
            .populate("categoryassigned", "categoryId categoryName categoryCheckList")

            .exec();

        if (!complains.length) {
            callback("No complains found for user with id " + techId);
        } else {
            callback(null, complains);
        }
    } catch (error) {
        callback(error);
    }
}
async function getlastComplain() {

    return complain
        .find({})
        .sort({ _id: -1 }).limit(1).exec();

}

async function RoundRobinAlgorithm() {
    let complain = await this.getlastComplain();
    let technician = await tech.getAllTechs();
    console.log("complain:", complain);
    for (var i = 0; i < technician.length; i++) {
        if (complain == null) {
            console.log("null hai");
            return technician[0]._id;
        }
        else if (complain[0].assignedTech == null) {
            console.log("assign null hai");
            return technician[0]._id;
        }
        else {
            if (complain[0].assignedTech.toString() == technician[i]._id.toString()) {
                var count = technician.length - 1;
                var next = i + 1;
                if (i == count) {
                    return technician[0]._id;
                }
                else {
                    return technician[next]._id;
                }
            }
        }
    }
}


async function getComplainCount(callback) {
    complain.countDocuments().then((count) => {
        return callback(null, count);
    }).catch((error) => {
        return callback(error);
    });
}

async function countComplain(callback) {
    // create a condition to filter techs with a techStatus of true
    const condition = { complainStatus: true };

    complain.countDocuments(condition).then((count) => {
        return callback(null, count);
    }).catch((error) => {
        return callback(error);
    });
}

async function updateComplain(params, callback) {
    const complainId = params.complainId;

    if (params.complainStatus !== undefined) {
        // if the techStatus field is present, convert its value to a boolean
        params.complainStatus = !!params.complainStatus;
    }
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
    deleteComplain,
    getComplainCount,
    countComplain,
    getlastComplain,
    RoundRobinAlgorithm,
    getComplainsByUserId,
    getComplainsByTechId
};
