var user = require('./../models/user');
// var notes = require('./../models/notes')
var randomstring = require('randomstring');
var sendmail = require('./../utils/sendmail');
var jwt = require('jsonwebtoken');

module.exports = {
    register: (req,res,next)=>{
        console.log(req.body);
        var { userName, email } = req.body;
        user.findOne({
            $or: [
                {userName},
                {email}
            ]
        },(err,data)=>{
            if (err) return next(err);

            if(data) return res.json({
                data: '',
                message: 'User already exists try logging'
            });

            var verificationCode = randomstring.generate(10);

            req.body.verificationCode = verificationCode;

            user.create(req.body,(err,data)=>{
                if(err) return next(err);

                res.json({
                    data: "",
                    message: "User Successfully created"
                })  
                console.log(data);
                sendmail({
                    from: process.env.SMTP_FROM_MAIL,
                    to: data.email,
                    subject: "Account Verification mail",
                    text: `Link to verify account http://localhost:${process.env.PORT}/account/verification/${verificationCode}`
                },(err,data)=>{
                    if(err) return next(err);
                    console.log("mail sent =========> ",data);
                });
            });
        });
    },
    verfication: (req, res, next)=>{
        user.updateOne(
            {verificationCode : req.params.code}
            ,{
                $set: {
                    isVerified: true
                },
                $unset: {
                    verificationCode: ''
                }
            },
            (err,data)=>{
                if (err) return next(err);
                if(!data.nModified) return res.json({
                    data: "",
                    message: "Link isn't valid anymore"
                })

                return res.json({
                    data: "",
                    message: "Link verified successfully"
                })

            }
        );
    },
    login: (req,res,next)=>{
        var { userName, password } = req.body;
        console.log(req);
        
        user.findOne(
            { userName },
            (err,user)=>{
                if(err) return next(err);

                if(user == null) return res.json({
                    data: '',
                    message: "User not found!!"
                })

                user.comparePassword(password,(err,isMatch)=>{
                    if(err) return next(err);

                    if(!isMatch) return res.json({
                        message: "Invvalid credentials",
                        data: ''
                    })

                    return res.json({
                        data: {
                            userName,
                            email: user.email,
                            token: jwt.sign({
                                id: user._id,
                            },process.env.JWT_TOKEN)
                        }
                    })
                })
            }
        )
    },
    notes: (req,res,next) => {
        
        return user.findById(req.userId.id, function (err, data) {
            if (err) return next(err);

            var { userName, email } = data;

            user.find(
                {notes},
                (err,usernotes)=>{
                    if(err) return next(err);

                    if(usernotes.length < 1) return res.json({
                        data: '',
                        message: 'User has no notes'
                    });

                    return res.json({
                        data: usernotes,
                        message: 'user notes found!!'
                    });
                }
            )

            res.status(200).json({
                message: `notes found.`,
                data: {
                    userName,
                    email
                }
            })

        })

    },
    addnotes:(req,res, next)=>{
        console.log(req.User);
        console.log(req.User.notes);
        console.log(req.body);
        var d = Date.now();
        console.log(d);
        user.updateOne(
            req.User,
            {
                $push: {
                    "notes": {
                                "title": req.body.title,
                                "text": req.body.text
                             }
                }
            },(err,result)=>{
                if(err) return next(err);

                return res.json({
                    data: '',
                    message: 'notes created'
                })
        })
    }
        
}