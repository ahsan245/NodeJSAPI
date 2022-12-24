const { relatedTech } = require("../models/related-techs.model");
const { tech } = require("../models/tech.model");

async function addRelatedTech(params, callback) {
    if (!params.tech) {
        return callback(
            {
                message: "Tech Id required"
            }

        );
    }
    if (!params.relatedTech) {
        return callback(
            {
                message: "Related Tech Id  required"
            });
    }
    const relatedTechModel = new relatedTech(params);
    relatedTechModel
        .save()
        .then(async (response) => {
            await tech.findOneAndUpdate(
                {
                    _id: params.tech
                },
                {
                    $addToSet: {
                        "relatedTechs": relatedTechModel
                    }
                }
            );
            return callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });
}

async function removeRelatedTech(params, callback) {
    const id = params.id;

    relatedTech
        .findByIdAndRemove(id)
        .then((response) => {
            if (!response) {
                callback("Tech Id not foound")
            }
            else {
                callback(null, response);
            }
        })
        .catch((error) => {
            return callback(error);
        });


}

module.exports = {
    addRelatedTech,
    removeRelatedTech
}