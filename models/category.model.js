const mongoose= require("mongoose");

const category = mongoose.model(
    "Category",
    mongoose.Schema({
        categoryName:{
            type:String,
            required:true,
            unique:true,
        },
        categoryDescription:{
            type:String,
            required:false
        },
        categoryImage:{
            type:String,
        },
    })
);

module.exports={
    category,
};