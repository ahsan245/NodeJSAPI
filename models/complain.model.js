const mongoose = require("mongoose");

const complain = mongoose.model(
    "complains",
    mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        complainName: {
            type: String,
            required: true,
        },
        complainDescription: {
            type: String,
            required: false
        },
        complainCategory:{
            type:String,
            required:false
        },
        assignedTech: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tech",
            required: false
        },
        userAddress:{
            type:String,
            required:true
        },
        complainStatus: {
            type: Boolean,
            default: false  
        },
        userContact:{
            type:String,
            required:true
        },
        complainImage: {
            type: String,
            required:false
        }
    },
        {
            toJSON: {
                transform: function (doc, ret) {
                    ret.complainId = ret._id.toString();
                    delete ret._id;
                    delete ret.__v;
                },
            },
        }
    )
);

module.exports = {
    complain,
};