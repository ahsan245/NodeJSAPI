const mongoose = require("mongoose");

const relatedTech = mongoose.model(
    "RelatedTech",
    mongoose.Schema(
        {
            tech: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Tech"
            },
            relatedTech: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Tech"
            }
        },
        {
            toJSON:{
                transform: function(doc,ret){
                    delete ret._id;
                    delete ret.__v;
                }
            },
        }, {
            timestamps: true
        })
        
    )

module.exports = {
    relatedTech,
}