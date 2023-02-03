const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { MONGO_DB_CONFIG } = require("./config/app.config");
const errors = require("./middleware/errors.js");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express"), swaggerDocument = require("./swagger.json");
require("dotenv").config();




mongoose.Promise = global.Promise;
mongoose
    .connect(MONGO_DB_CONFIG.DB, {
     useNewUrlParser: true,
     useUnifiedTopology: true,
})
    .then(
        () => {
            console.log("Database connected");
            console.log(process.env.KEY);

        },
        (error) => {

            console.log("Database can't be connected:" + error);
        }
    );
app.use(cors({
    origin:"*"
}));
app.use(express.json());
app.use("/uploads",express.static("uploads"));
app.use("/api",require("./routes/app.routes"));
app.use(errors.errorHandler);
app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerDocument));



app.listen(process.env.port || 4000,function(){
    console.log("Ready to Go!");



});

