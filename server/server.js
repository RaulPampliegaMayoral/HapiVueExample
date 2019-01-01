'use strict';

const Hapi = require('hapi');
const api = require('./api');
const {User} = require('./models');
const {Shopping} = require('./models');
const Boom = require('boom');
const Joi = require('joi')
const nes  = require('nes');

require('./database');

const server = Hapi.server({
    port: 3000,
    host: 'localhost',
    routes: {
	cors: true
    },
    cache: [
        {
            name: 'mongoCache',
            engine: require('catbox-mongodb'),
            host: '127.0.0.1',
            partition: 'cache'
        }
    ]
});

///Validation function
const validate = api.user.validate;

const Cache = server.cache({segment: 'gamehouse', expiresIn: 5000 * 5 });
const mainCacheKey = {
    segment : 'gamehouse',
    id : "main"
};


///Server plugins and route definition
const init = async function() { 

    ////Websocket updates registration
    await server.register({ plugin: nes, options: { auth: false  } });
    server.subscription("/updates/{shopping}", { auth: false });
    
    ///Authentication registration
    await server.register(require('hapi-auth-jwt2'));
    server.auth.strategy('jwt', 'jwt', {key: 'RaúlPampliegaGameHouse', validate: validate, verifyOptions: { algorithms: [ 'HS256' ] }});
    server.auth.default('jwt');

    server.route({
        method: "GET",
        path: "/",
        handler : async(request, h) => {    
            const cached = await Cache.get(mainCacheKey);
            if( cached ) {
                return cached.item;
            }

            const data = await api.main.data();
            await Cache.set(mainCacheKey, {item : data}, 15000);

            return data;
        },
        options: { 
            auth: false,
        },
    });

    server.route({
        method: "POST",
        path: "/user",
        handler : api.user.create,
        options: { 
            auth: false,
            validate: {
                payload : {
                    email : Joi.string().email().required(),
                    login : Joi.string().required(),
                    password : Joi.string().required(),
                }
            }
        }
    });

    server.route({
        method: "POST",
        path: "/login",
        handler : api.user.logIn,
        options: { 
            auth: false,
            validate: {
                payload : {
                    email : Joi.string().email().required(),
                    password : Joi.string().required(),
                }
            }
        }
    });

    server.route({
        method: "GET",
        path: "/shopping",
        handler : async(request, h) => {
            return data = await api.shopping.all();
        },
        options : {
            auth: false
        }
    });
    server.route({
        method: "GET",
        path: "/shopping/{shopping}",
        handler: async(request, h) => {
            const shoppingId = request.params.shopping;
            const data = await api.shopping.get(shoppingId);

            return data;
        },
        options : {
            auth : false
        }
    });

    server.route({
        method: "PUT",
        path: "/shopping/{shopping}",
        handler: async(request, h) => {
            const shoppingId = request.params.shopping;
            const name = request.payload.name;
            const data = await api.shopping.update(shoppingId, name);

            return data;
        },
        options : {
            auth : 'jwt'
        }
    });

    server.route({
        method: "POST",
        path: "/shopping/{shopping}/item",
        handler : async(request, h) => {
            const shoppingId = request.params.shopping;
            const itemId = request.payload.item;
            const data = await api.shopping.addItem(shoppingId, itemId);

            server.publish("/updates/"+ shoppingId, data);

            return data;
        },
        options : {
            auth : 'jwt',
            validate : {
                payload : {
                    item : Joi.string().max(100).required()
                }
            }
        }
    });

    server.route({
        method: "PUT",
        path: "/shopping/{shopping}/item/{item}",
        handler: async(request, h) => {
            const shoppingId = request.params.shopping;
            const item = request.params.item;
            const value = request.payload.value;

            const data = await api.shopping.updateItem(shoppingId, item, value);

            server.publish("/updates/"+ shoppingId, data);

            return data;
        },
        options : {
            auth : 'jwt',
            validate : {
                payload : {
                    value : Joi.string().max(100).required()
                }
            }
        }
    });

    server.route({
        method: "DELETE",
        path: "/shopping/{shopping}/item/{item}",
        handler: async(request, h) => {
            const shoppingId = request.params.shopping;
            const item = request.params.item;
            const data = await api.shopping.deleteItem(shoppingId, item);

            server.publish("/updates/"+ shoppingId, data);

            return data;
        },
        options : {
            auth : 'jwt'
        }
    });

    await server.start();
};
    console.log(`Server started at ${server.info.uri}`);

init().catch((err) => {
    console.error(err);
    process.exit(1);
});