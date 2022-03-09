var express = require('express');
var router = express.Router();
const Signdatabase = require('../model/sign');
const {check , validationResult} = require('express-validator');
const flash = require('connect-flash/lib/flash');
const passport = require('passport');
const Product = require('../model/products');
const Cart = require('../model/cart');

//mongodb+srv://mazhari:2875@cluster0.vokuh.mongodb.net/store
const isAdmin = (req , res , next)=>{
  console.log(req.user.email != 'admin@admin.com' );
  //console.log(req.user._id != '6228a3353dfb48d5f199bc70');
  if(req.user.email != 'admin@admin.com') {
    res.redirect('/') ;
    return 1 ;
  } 
  next();
}
/* GET home page. */
router.get('/', function(req, res, next) {
  let comps = [] ;
  let big = [] ;
  let admin = false ;
  Product.find({} ,(err,r)=>{
    if (err) console.log(err) ;
    for(let i=0 ; i<r.length ; i++) {
      comps.push(r[i]);
    }
    for(let i=0 ; i<comps.length ; i+=3){
      big.push(comps.slice(i,i+3));
    }
    if (req.isAuthenticated()) {
      if (req.user.email == 'admin@admin.com') {
        admin = true ;
      }
    }
  res.render('index', { title: 'MA store' ,
    big : big ,
    ishbs : req.isAuthenticated() ,
    admin : admin });
  });
});

const isSinged = (req , res , next)=>{
  if(!req.isAuthenticated()) {
    req.flash('gosign' , 'you are not signed in')
    res.redirect('gosign');
    return ;
  }
  next();
}

const isNotSinged = (req , res , next)=>{
  if(req.isAuthenticated()) {
    res.redirect('/');
    return ;
  }
  next();
}

router.get('/logout' , isSinged , (req,res,next)=>{
  req.logOut() ;
  res.redirect('/');
})

router.get('/signin', isNotSinged , function(req, res, next) { 
  let errMsg = req.flash('signin') ;
  res.render('signin' ,{list : errMsg , ishbs : req.isAuthenticated()});
});

/*const comps = new Array() ;
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
}*/

router.get('/gosign' , (req,res,next)=>{
  let seccessMsg = req.flash('gosign');
  res.render('gosign' , {tit : seccessMsg , ishbs : req.isAuthenticated()});
});


router.get('/test', isSinged , function(req, res, next) {
  let comps = [] ;
  let big = [] ;
  Product.find({} ,(err,r)=>{
    if (err) console.log(err) ;
    for(let i=0 ; i<r.length ; i++) {
      comps.push(r[i]);
    }
    for(let i=0 ; i<comps.length ; i+=3){
      big.push(comps.slice(i,i+3));
      res.render('test', { list: comps , big : big , ishbs : req.isAuthenticated()});
    }
  });
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
  successRedirect : '/' ,
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

router.get('/signup', isNotSinged , function(req, res, next) {
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
] , ((req,res,next)=>{
  let err = [] ;
    if (!validationResult(req).isEmpty()) {
      for (let i=0 ; i<validationResult(req).errors.length ; i++){
        err.push(validationResult(req).errors[i].msg) ;
      }
      req.flash('error' , err);
      res.redirect('signup');
      return ;
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
  */})
 , passport.authenticate('local-signup' , {
  session : false ,
  successRedirect : 'gosign' ,
  failureRedirect : 'signup' ,
  failureFlash : true 
}));

router.get('/mongo' , isAdmin , (req,res,next)=>{
  let mongoArr = req.flash('mongo') ;
  console.log(req.user._id);
  res.render('mongo' , {arr : mongoArr});
});

router.post('/mongoadd' , (req,res,next)=>{
  const product = new Product({
    productName : req.body.productName ,
    productPrice : req.body.productPrice ,
    productImg : req.body.productImg 
  });
  product.save((err,doc)=>{
    if (err) console.log(err) ;
    res.redirect('mongoget') ;
  });
});

router.get('/mongoget' , (req,res,next)=>{
  arr = [] ;
  Product.find({} , (err,r)=>{
    for (let i=0 ; i<r.length ; i++){
      arr.push(r[i]);
    }
    req.flash('mongo' , arr) ;
    res.redirect('mongo') ;
  });
});

router.post('/mongodelete' , (req,res,next)=>{
  Product.deleteOne({_id : req.body.del} , (err,r)=>{
    if (err) console.log (err) ;
    res.redirect('cleardb') ;
  })
})

router.get('/cart/:id/:price' , isSinged , (req,res,next)=>{
  const cart = new Cart({
    userCart : req.user._id ,
    itemId : req.params.id 
  });
  cart.save((err,r)=>{
    res.redirect('/');
  })
});

router.get('/usercart' , isSinged , (req,res,next)=>{
  Cart.find({userCart:req.user._id} , (err,r)=>{
    if(err) console.log(err) ;
    console.log(r.length);
    let cartHbs = [] ;
    let totalPrice = 0 ;
    if(r.length === 0) {
      res.render('cart' , {cart : cartHbs,
      totalPrice : totalPrice , 
      ishbs : req.isAuthenticated()});
    } else {
      for(let i=0 ; i<r.length ; i++){
       // cartHbs[i] = r[i].itemId ;
       Product.findOne({_id : r[i].itemId} , (error,doc)=>{
        if(error) console.log(error) ;
        cartHbs.push(doc);
        totalPrice += doc.productPrice ;
        if (i === r.length-1) {
          let cartFormated = [] ;
          for(let j=0 ; j<cartHbs.length ; j+=4){
           cartFormated.push(cartHbs.slice(j,j+4));
          }
          res.render('cart' , {cart : cartFormated ,
             totalPrice : totalPrice , 
             ishbs : req.isAuthenticated()});
         }
        });
      }
    }
  });
});

router.get('/cleardb' , isAdmin , (req,res,next)=>{
  Cart.deleteMany((err,r)=>{
    if(err) console.log(err) ;
    res.redirect('mongoget');
  });
});

router.post('/deletecart' , (req,res,next)=>{
  Cart.deleteOne({itemId : req.body.deleteCart ,
     userCart : req.user._id } ,(err,r)=>{
    if (err) console.log(err) ;
    res.redirect('cleardb');
  });
});

router.get('/admin' , isAdmin , (req,res,next)=>{
  res.render ('admin' , {ishbs : req.isAuthenticated()})
});

router.get('/adminusers' , isAdmin , (req,res,next)=>{
  Signdatabase.find({} , (err , r)=>{
    if (err) console.log(err) ;
    arr = [] ;
    for(let i=0 ; i<r.length ; i++){
      arr.push(r[i]);
    }
    req.flash('adminusers' , arr) ;
    res.redirect('adminuser') ;
  });
});

router.get('/adminuser' , isAdmin , (req,res,next)=>{
  let usersArray = req.flash('adminusers');
  res.render('users' , {arr : usersArray} ) ;
});

router.post('/userdelete' , (req,res,next)=>{
  Signdatabase.deleteOne({_id : req.body.del} , (err,r)=>{
    if (err) console.log (err) ;
    res.redirect('adminusers') ;
  });
});



module.exports = router;
