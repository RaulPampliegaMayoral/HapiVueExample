const {Shopping} = require("./../models");
const Boom = require('boom');

const shoppingAPI = {
    all : async function() {
            try
            {
                return await Shopping.find({});
            }
            catch(err) { Boom.badImplementation(err); }
    },
    create : async function(name, user) {
            try
            {
                const shopping = new Shopping({
                    name : name,
                    user : user,
                    created : new Date(),
                    items : []
                });
                shopping.save();

                return shopping;
            }
            catch(err) { console.log(err); Boom.badImplementation(err); }
    },
    get: async function(shoppingId) {
            try
            {
                return await Shopping.findById({_id: shoppingId});
            }
            catch(err) { Boom.badImplementation(err); }
    },
    getByEmail: async function(email) {
        try
        {
            return await Shopping.findOne({"user": email});
        }
        catch(err) { Boom.badImplementation(err); }
    },
    update: async function(shoppingId, name) {
            try
            {
                const shopping   = await Shopping.findById({_id: shoppingId});
                if(!shopping) return Boom.badImplementation("Shopping list not found");
                shopping.name = name;
                shooping.modified = new Date()
                shopping.save();

                return { message: "ok"};
            }
            catch(err) { Boom.badImplementation(err); }
    },
    addItem: async function(shoppingId, itemId) {
            try
            {
                var item =  {"item" : itemId, "created" : new Date()};
                const data = await Shopping.findOneAndUpdate({_id: shoppingId}, {$push: {items: item}}, {new: true});
                return data;
            }
            catch(err) { Boom.badImplementation(err); }
    },
    deleteItem: async function(shoppingId, item) {
        try
        {
            const data = await Shopping.findOneAndUpdate({_id: shoppingId}, {$pull: { items: { _id: item}}}, {new: true});
            return data;
        }
        catch(err) { Boom.badImplementation(err); }
    },
    updateItem: async function(shoppingId, item, value) {
        try
        {
            const data = await Shopping.findOneAndUpdate({"items._id": item}, {$set: {"items.$.item" : value}}, {new: true});
            return data;
        }
        catch(err) { Boom.badImplementation(err); }
    }

    /* TODO: remove Shopping list */
}

module.exports = shoppingAPI;
