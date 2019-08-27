var express = require('express');
var router = express.Router();

var {
  validate,
  validationRules,
  authenticate
} = require('./../utils/index');

var {
  register: registerController,
  verfication: verficationController,
  login: loginController,
  notes: notesController,
  addnotes: addnotesController
} = require('./../controllers/index')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// User Signup
router.post('/signup',
  validate(validationRules.signUp),
  registerController
);


// link to verify user
router.get('/account/verification/:code',
  verficationController
);

// user login
router.post('/login',
validate(validationRules.login),
loginController);


// load existing notes from database
router.get('/notes',
authenticate,
notesController);

// add notes from user to database

router.post('/addnotes',
authenticate,
addnotesController)

module.exports = router;
