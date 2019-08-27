var validate = require('./validation');
var validationRules = require('./validationRules');
var sendmail = require('./sendmail');
var authenticate = require('./authenticate')

module.exports = {
    validate,
    validationRules,
    sendmail,
    authenticate
}