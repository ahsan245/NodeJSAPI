function errorHandler(err, req, res, next) {
    if (typeof err === "string") {
        return res.status(400).json({ messege: err });
    }


    if (err.name === "ValidationError") {
        return res.status(400).json({ messege: err.messege });
    }

    if (err.name === "UnauthorizedError") {
        return res.status(401).json({ messege: "Token not Valid" });
    }

    return res.status(500).json({ messege: err.messege });
}

module.exports = {
    errorHandler,
};