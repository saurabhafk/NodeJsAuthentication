const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User=require('../models/user');
const env = require('./enviroment')




passport.use(new googleStrategy({

    clientID: env.google_client_id,
    clientSecret: env.google_client_secret,
    callbackURL: env.google_call_back_url

    // clientID: "297293548800-9531e9p5lt38mc702c5mkb0o6a6g0i71.apps.googleusercontent.com",
    // clientSecret: "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",
    // callbackURL: "http://localhost:8003/users/auth/google/callback"
    },
    function(accessToken,refreshToken,profile,done){
        User.findOne({email:profile.emails[0].value}).exec(function(err,user){
            if(err){
                console.log("error in google strategy passport",err);
                return;
            }
            console.log(profile);

            if(user){
                return done(null, user);
            }
            else{
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                },function(err,user){

                    if(err){
                        console.log("error in creating user google strategy passport",err);
                        return;
                    }
                    return done(null, user);
                })
            }
        })
    }
))

module.exports = passport;
