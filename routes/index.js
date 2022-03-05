var express = require('express');
var router = express.Router();
const signdatabase = require('../model/sign');
const {check , validationResult} = require('express-validator');
const flash = require('connect-flash/lib/flash');
const passport = require('passport');
const Item = require('../model/items');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session);
  console.log(req.user);
  res.render('index', { title: 'MA store' });
});

router.get('/signin', function(req, res, next) { 
  let errMsg = req.flash('signin') ;
  res.render('signin' ,{list : errMsg});
});

const comps = new Array() ;
comps[0] = {
  tit : 'first' ,
  info : '1$' ,
  img : "/images/1.jpg" 
};
comps[1] = {
  tit : 'second' ,
  info : '2$' ,
  img : "/images/2.jpg"
};
comps[2] = {
  tit : 'third' ,
  info : '3$' ,
  img : "/images/3.jpg"
};
comps[3] = {
  tit : 'fourth' ,
  info : '4$' ,
  img : "/images/2.jpg"
};
comps[4] = {
  tit : 'fifth' ,
  info : '5$' ,
  img : "/images/3.jpg"
};
comps[5] = {
  tit : '6th' ,
  info : '6$' ,
  img : "/images/1.jpg"
};
comps[6] = {
  tit : '7th' ,
  info : '7$' ,
  img : "/images/2.jpg"
};

let big = [];
for (let i=0 ; i<comps.length ; i+=3){
  big.push(comps.slice(i,i+3)) ;
}

router.get('/gosign' , (req,res,next)=>{
  let seccessMsg = req.flash('gosign');
  res.render('gosign' , {tit : seccessMsg});
});

router.get('/test', (req , res , next)=>{
  if(!req.isAuthenticated()) {
    req.flash('gosign' , 'you are not signed in')
    res.redirect('gosign');
    return ;
  }
  next();
} , function(req, res, next) {
  res.render('test', { list: comps , big : big });
});


router.get('/col',(req,res,next)=>{
  res.render('post');
});

router.post('/signin' , [
  check('email').not().isEmpty().withMessage('please enter your email') ,
  check('email').isEmail().withMessage('enter currect email') ,
  check('password').not().isEmpty().withMessage('please enter your password') ,
  check('password').isLength({min:4}).withMessage('password must be more than 4 chars') 
] , (req,res,next)=>{
  let err = [] ;
  const errors = validationResult(req) ;
  if (! errors.isEmpty()) {
    //res.send(errors.errors) ;
    for(let i=0 ; i<errors.errors.length ; i++){
        err.push(errors.errors[i].msg) ;
    }
    req.flash('signin' , err) ;
    res.redirect('signin') ;
    return ;
  } 
  next();
} , passport.authenticate('local-signin' , {
  successRedirect : '/test' ,
  failureRedirect : '/signin' ,
  failureFlash : true  
})); /*[
  check('email').not().isEmpty().withMessage('please enter your email') ,
  check('email').isEmail().withMessage('enter currect email') ,
  check('password').not().isEmpty().withMessage('please enter your password') ,
  check('password').isLength({min:4}).withMessage('password must be more than 4 chars') 
] , (req,res,next)=>{
  let err = [] ;
  const errors = validationResult(req) ;
  if (! errors.isEmpty()) {
    //res.send(errors.errors) ;
    for(let i=0 ; i<errors.errors.length ; i++){
        err.push(errors.errors[i].msg) ;
    }
    req.flash('signin' , err) ;
    res.redirect('signin') ;
  } else {
    signdatabase.findOne({email : req.body.email} , (error,r)=>{
      if(!r || r.password !== req.body.password ) {
        req.flash( 'signin' ,'Wrong email and password') ;
        res.redirect('signin') ;
      } else {
        res.redirect('test');
      }
    });
  }
});*/

router.get('/signup', function(req, res, next) {
  let msgErr = req.flash('error'); 
  res.render('signup' ,{list : msgErr});
});

router.post('/signup', [
  check('email').not().isEmpty().withMessage('please entre your email') ,
  check('email').isEmail().withMessage('entre currect email') ,
  check('password').not().isEmpty().withMessage('please entre your password') ,
  check('password').isLength({min:4}).withMessage('password must be more than 4 chars') ,
  check('repassword').custom((value , {req})=>{
    if (value !== req.body.password ){
      return false ;
    } else {
    return true ;
    }
  }).withMessage('password and confirm password didnt match')
] , (req,res,next)=>{
  let err = [] ;
  signdatabase.findOne({email : req.body.email} ,(error,r)=>{
    if (!validationResult(req).isEmpty()) {
      for (let i=0 ; i<validationResult(req).errors.length ; i++){
        err.push(validationResult(req).errors[i].msg) ;
      }
      req.flash('error' , err);
      res.redirect('signup');
    }
    next();
    /*if (validationResult(req).isEmpty()) {
      if(!r){
        const user = new signdatabase({
          email : req.body.email ,
          password : req.body.password
        });
        user.save((err,r)=>{
          if(err){
            console.log(err);
          }
          res.redirect('signin');
        });
      } else {
        req.flash( 'error' , 'this user is already exist');
        res.redirect('signup');
      }
    } else {
      for (let i=0 ; i<validationResult(req).errors.length ; i++){
        err.push(validationResult(req).errors[i].msg) ;
      }
      req.flash('error' , err);
      res.redirect('signup');
    }
  */});
} , passport.authenticate('local-signup' , {
  session : false ,
  successRedirect : 'gosign' ,
  failureRedirect : 'signup' ,
  failureFlash : true 
}));


module.exports = router;
