const {User} = require('./../models');
const {Shopping} = require('./../models');
const Boom = require('boom');

const mainAPI = {
    data : async function() {
        try
        {
            const users = await User.estimatedDocumentCount({});
            const itemsWithElements = await Shopping.find({'items.0' : {$exists : true}}, {name:0,user:0,created:0,modified:0,items:0}).count();
            ///bug: I dont know why if the aggregate function return simple object an error ocurred. When an array is returned, all is ok
            let items = 0;
            const items_ = await Shopping.aggregate([{$group:{_id:null, items:{$sum: {$size: { "$ifNull" : ["$items", []]}}}}}]);
            if( items_ && items_[0] )
                items = items_[0].items;

            const retorno = { "users" : users, "itemsWithElements" : itemsWithElements, "items" : items};

            return retorno;
        }
        catch(err) { console.log(err); Boom.badImplementation(err); }
    }
}

module.exports = mainAPI;