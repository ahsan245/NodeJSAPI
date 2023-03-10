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
        .find(condition, "complainStatus complainName complainDescription complainCategory userAddress userContact complainImage")
        .populate("user", "userId fullName")
        .populate("assignedTech", "techId techName")
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
    countComplain
};