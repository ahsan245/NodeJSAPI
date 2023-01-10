const { tech } = require("../models/tech.model");
const { category } = require("../models/category.model");
const { MONGO_DB_CONFIG } = require("../config/app.config");



async function createTech(params, callback) {
    if (!params.techName) {
        return callback(
            {
                message: "Tech Name required",
            },
            ""
        );
    }
    if (!params.category) {
        return callback(
            {
                message: "Category required",
            },
            ""
        );
    }
    const techModel = new tech(params);
    techModel.save()
        .then((response) => {
            return callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });
}

async function getTechs(params, callback) {
    const techName = params.techName;
    const categoryId = params.categoryId;
    var condition = {};

    if (techName) {
        condition["techName"] = {
            $regex: new RegExp(techName), $options: "i"
        };
    }
    if (categoryId) {
        condition["category"] = categoryId;
    }
    if(params.techIds){
        condition["_id"] = {
            $in: params.techIds.split(",")
        };
    }

    let perPage = Math.abs(params.pageSize) || MONGO_DB_CONFIG.PAGE_SIZE;
    let page = (Math.abs(params.page) || 1) - 1;

    tech
        .find(condition, "techId techName techShortDescription techPrice techSalePrice techImage techType techStatus createdAT updatedAt")
        .sort(params.sort)
        .populate("category", "categoryName categoryImage")
        .populate("relatedTechs", "relatedTech")
        .limit(perPage)
        .skip(perPage * page)
        .then((response) => {

            var res = response.map(r => {
                if (r.relatedTechs.length > 0) {
                    r.relatedTechs = r.relatedTechs.map(x => x.relatedTech);
                }
                return r;
            });



            return callback(null, res);
        })
        .catch((error) => {
            return callback(error);
        });


}
async function getTechCount(callback) {
    tech.countDocuments().then((count) => {
      return callback(null, count);
    }).catch((error) => {
      return callback(error);
    });
  }
  async function countTechs(callback) {
    // create a condition to filter techs with a techStatus of true
    const condition = { techStatus: true };
  
    tech.countDocuments(condition).then((count) => {
      return callback(null, count);
    }).catch((error) => {
      return callback(error);
    });
  }

async function getTechById(params, callback) {
    const techId = params.techId;

    tech
        .findById(techId)
        .populate("category", "categoryName categoryImage")
        .populate("relatedTechs", "relatedTech")

        .then((response) => {
            response.relatedTechs = response.relatedTechs.map(x =>{return x.relatedTech});

            return callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });
}



async function updateTech(params, callback) {
    const techId = params.techId;
  
    // check if the techStatus field is present in the params object
    if (params.techStatus !== undefined) {
      // if the techStatus field is present, convert its value to a boolean
      params.techStatus = !!params.techStatus;
    }
  
    tech
      .findByIdAndUpdate(techId, params, { useFindAndModify: false })
      .then((response) => {
        if (!response) {
          callback(`Cannot update Tech with id ${techId}`);
        } else {
          callback(null, response);
        }
      })
      .catch((error) => {
        return callback(error);
      });
  }
  

async function deleteTech(params, callback) {
    const techId = params.techId;

    tech
        .findByIdAndRemove(techId)
        .then((response) => {
            if (!response) {
                callback(`Cannot delete tech with id ${techId}`)
            }

            else callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });
}

async function getAllTechs()
{
    return tech.find({});
}

module.exports = {
    createTech,
    getTechs,
    getTechById,
    updateTech,
    deleteTech,
    getTechCount,
    countTechs,
    getAllTechs
};