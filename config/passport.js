const passport = require('passport');
const strategy = require('passport-local').Strategy ;
const User = require('../model/sign');

passport.serializeUser((user , done )=>{
    return done(null , user.id);
});

passport.deserializeUser((id , done)=>{
    User.findById(id , ('email') , (err , user)=>{
        return done(err , user);
    });
});

passport.use('local-signin' , new strategy({
    usernameField : 'email' ,
    passwordField : 'password' ,
    passReqToCallback : true 
} , (req, email , password , done )=>{
    User.findOne({email : email} , (err , user)=>{
        if(err) {
            return done(err , false);
        }
        if(!user || password !== user.password){
            return done(null , false , req.flash('signin' , 'wrong email and password'));
        } else {
            return done(null , user);
        }
    });
}));

passport.use('local-signup' , new strategy({
    usernameField : 'email' ,
    passwordField : 'password' ,
    passReqToCallback : true 
} , (req , email , password , done)=>{
    User.findOne({email : email} , (err , user)=>{
        if(err) return done(err , false) ;
        if(user) return done(null , false , req.flash('error' , 'this email is already used'));
        const newUser = new User({
            email : email ,
            password : password 
        });
        newUser.save((err , r)=>{
            if(err) console.log(err) ;
            else return done(null , r , req.flash('gosign' , 'you are signed up seccessfuly!') );
        });
    });
}));