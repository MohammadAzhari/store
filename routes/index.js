var express = require('express');
var router = express.Router();
const {check , validationResult} = require('express-validator');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MA store' });
});
var err = [] ;
router.get('/signin', function(req, res, next) { 
  res.render('signin' ,{list : err});
});

const comps = new Array() ;
comps[0] = {
  tit : 'first' ,
  info : 'ffff' ,
  img : "/images/1.jpg" 
};
comps[1] = {
  tit : 'second' ,
  info : 'ssss' ,
  img : "/images/2.jpg"
};
comps[2] = {
  tit : 'third' ,
  info : 'tttt' ,
  img : "/images/3.jpg"
};
comps[3] = {
  tit : 'fourth' ,
  info : 'ffff' ,
  img : "/images/2.jpg"
};

comps[4] = {
  tit : 'fifth' ,
  info : 'ffff' ,
  img : "/images/3.jpg"
};

comps[5] = {
  tit : 'othman' ,
  info : 'oooo' ,
  img : "/images/1.jpg"
};

comps[6] = {
  tit : 'dakbkd' ,
  info : 'dbjs' ,
  img : "/images/2.jpg"
};

let big = [];
for (let i=0 ; i<comps.length ; i+=3){
  big.push(comps.slice(i,i+3)) ;
}

router.get('/test', function(req, res, next) {
  res.render('test', { list: comps , big : big });
});

/*router.post('/col',(req,res,next)=>{
  comps[4].tit = req.body.tit ;
  comps[4].info = req.body.info ;
  comps[4].img = '/images/1.jpg' ;
  big = [];
  for (let i=0 ; i<comps.length ; i+=3){
    big.push(comps.slice(i,i+3)) ;
  }
  res.redirect('/test');
});*/

router.get('/col',(req,res,next)=>{
  res.render('post');
});

router.post('/signin' , [
  check('email').not().isEmpty().withMessage('please enter your email') ,
  check('email').isEmail().withMessage('enter currect email') ,
  check('password').not().isEmpty().withMessage('please enter your password') ,
  check('password').isLength({min:4}).withMessage('password must be more than 4 chars') 
] , (req,res,next)=>{
  err = [] ;
  const errors = validationResult(req) ;
  if (! errors.isEmpty()) {
    //res.send(errors.errors) ;
    for(let i=0 ; i<errors.errors.length ; i++){
        err.push(errors.errors[i].msg) ;
    }
    res.redirect('signin') ;
  } else {
  res.redirect('test') ;
  }
});


module.exports = router;
