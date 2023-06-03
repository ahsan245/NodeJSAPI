const mongoose = require('mongoose');

const techUser = mongoose.model(
    "techUser",
    mongoose.Schema({
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },

        techID:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tech"
        },
    },
        {
            toJSON: {
                transform: function (doc, ret) {
                    ret.loginTechId = ret._id.toString();
                    delete ret._id;
                    delete ret.__v;
                    delete ret.password;
                }
            }

        }, {
    })
);

module.exports = {
    techUser
}