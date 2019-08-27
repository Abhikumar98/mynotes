var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: String,
    email: String,
    password: String,
    verificationCode: String,
    isVerified: {
        default: false,
        type: Boolean
    },
    notes: {
        type: Array,
        title: String,
        text: String
    }
});

userSchema.pre('save',function(next){
    
    var user = this;    

    if(!user.isNew) return next();

    if(!user.password) return next();
    
    bcrypt.hash(
        user.password, 10, function(err,hash){
            if(err) return console.log("error in hashing password");
            user.password = hash;
            next();
        });
});

userSchema.methods.comparePassword = function(enteredPassword,cb){

    bcrypt.compare(enteredPassword,this.password,function(err,data){
        return cb(err,data);
    })

}

module.exports = mongoose.model('User', userSchema)