const {User} = require('./../models');
const shopping = require('./shopping');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Boom = require('boom');

const userAPI = {
    validate : async function(decode, request) {
        const user = await User.findById(decode.id);
        if( !user )
             return { isValid: false };
        else return { isValid: true };
    },
    create : async function(request, h) {
        try
        {
            ///Check email
            let user = await User.findOne({ "email" : request.payload.email});
            if( user )
                return Boom.badImplementation('Email in use');
            
            ///Check display name
            user = await User.findOne({ "login" : request.payload.login});
            if( user )
                return Boom.badImplementation('Display name in use');

            user = new User({
                name  : request.payload.login,
                login :  request.payload.login,
                email : request.payload.email,
                password : await bcrypt.hash(request.payload.password, 10, null)
            });
            user.save();

            ///Defensive strategy, it must not exists
            let data = await shopping.getByEmail(user.email);
            if( !data )
                data = await shopping.create(user.name, user.email);

            return { message : "ok"};
        }
        catch(err) { console.log(err); Boom.badImplementation(err); }
    },
    logIn : async function(request, h) {
        try
        {
            const user = await User.findOne({"email" : request.payload.email});
            if( !user )
                return Boom.unauthorized('Email does not exists');

            const match = await bcrypt.compare(request.payload.password, user.password);
            if( !match )
                return Boom.unauthorized('Password wrong');
            
            const data = await shopping.getByEmail(user.email);

            ///token in server always will expire in 14 days at the most
            let token = jwt.sign({id: user._id}, "RaúlPampliegaGameHouse", {expiresIn: 1209600});
            return {"token" : token, "shopping" : data._id};
        }
        catch(err) {console.log(err); Boom.badImplementation(err); }
    }
}

module.exports = userAPI;