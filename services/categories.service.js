const { response } = require("express");
const { MONGO_DB_CONFIG } = require("../config/app.config");
const { category } = require("../models/category.model");

async function createCategory(params, callback) {
    if (!params.categoryName) {
        return callback({
            messege: "Category Name Required"
        }, ""

        );
    }

    const model = new category(params);
    model
        .save()
        .then((response) => {
            return callback(null, response);

        })
        .catch((error) => {
            return callback(error);
        });
}


async function getCategory(params, callback) {
    const categoryName = params.categoryName;
    var condition = categoryName ? {
        categoryName: { $regex: new RegExp(categoryName), $options: "i" },

    }
        : {};

    let perPage = Math.abs(params.pageSize) || MONGO_DB_CONFIG.pageSize;
    let page = (Math.abs(params.page) || 1) - 1;


    category
    .find(condition, "categoryName categoryImage")
    .limit(perPage)
    .skip(perPage * page)
    .then((response) => {
    
        return callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        }
        );


}



async function getCategoryById(params, callback) {
    const categoryId = params.categoryId;

    category
        .findById(categoryId)
        .then((response) => {
            if (!response) callback("Not Found Category with Id" + categoryId)
            else callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        }
        );


}



async function updateCategory(params, callback) {
    const categoryId = params.categoryId;

    category
        .findByIdAndUpdate(categoryId, params, { useFindAndModify: false })
        .then((response) => {
            if (!response) callback("Not Found Category with Id" + categoryId)
            else callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        }
        );


}



async function deleteCategory(params, callback) {
    const categoryId = params.categoryId;

    category
        .findByIdAndDelete(categoryId)
        .then((response) => {
            if (!response) callback("Not Found Category with Id" + categoryId)
            else callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        }
        );


}


module.exports = {
    createCategory,
    getCategory,
    getCategoryById,
    updateCategory,
    deleteCategory
};