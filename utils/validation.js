var Validator = require('validatorjs');

module.exports = ( rules )=> (
    (req,res,next)=>{
        let validation = new Validator(req.body, rules);

        if(validation.fails()){
            var errors = validation.errors.all();
            return res.json({
                data: '',
                message: errors
            })
        }

        return next();
    }
)