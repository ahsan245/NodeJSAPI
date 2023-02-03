require("dotenv").config();

const MONGO_DB_CONFIG = {
    DB:process.env.MONGODB_URI,
    //DB:"mongodb://127.0.0.1:27017",
    PAGE_SIZE:10,
};



module.exports={
    MONGO_DB_CONFIG,
};



