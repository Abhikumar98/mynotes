var jwt = require('jsonwebtoken');
require('dotenv').config();
var user = require('./../models/user')

module.exports = function (req, res, next) {
    if (!req.headers || !req.headers.token) {

        return res.status(422).json({
            message: "token is required",
            data: ""
        })

    }
    jwt.verify(
        req.headers.token,
        process.env.JWT_TOKEN,
        function (err, userId) {  // userId ==========================>  { id: '5d6380ca259233484063e346', iat: 1566802231 }
        // the userId is an object which contains the id of user which was stored as jwt during login
        // the .verify takes the encoded jwt token form header of postman and decodes it
        // return an object.
            if (err) return next(err)
            if (!userId) {
                return res.status(442).json({
                    message: "The user is not authorised or expired token.",
                    data: ""
                })
            }
            user.findById(userId.id, function (err, data) {
                if (err) return next(err);
                // console.log("user ==========================> ",userId);
                // console.log("data --------------------------> ",data);
                
                
                // 5d6380ca259233484063e346
                req.User = data;
                req.userId = userId
                next();
            })
        }
    )
}