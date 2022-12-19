const jwt = require("jsonwebtoken");


const TOKEN_KEY = "RANDOM_KEY";

function authenticationToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, TOKEN_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

function generateAccessToken(userModel) {
    return jwt.sign({ data: userModel }, TOKEN_KEY, {
        expiresIn: "1h"
    });
}

module.exports = {
    authenticationToken,
    generateAccessToken,
};