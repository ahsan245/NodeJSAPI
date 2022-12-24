const mongoose = require("mongoose");

const slider = mongoose.model(
    
    "sliders",

    mongoose.Schema(
        {
            sliderName: {
                type: String,
                required: true,
                unique:true

            },
            sliderDescription: {
                type: String,
                required: false
            },

            sliderURL: {
                type: String,
                required: false
            },

            sliderImage: {
                type: String,
                required: true
            }


        }
    )
);

module.exports = {
    slider
}



