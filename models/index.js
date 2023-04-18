//represents one row in the table
const bookshelf = require('../bookshelf');

//create a product model
//A bookshelf model represents one table in your database

//the first paramter: the name of the Model
// const bookshelf = require('../bookshelf')

const Product = bookshelf.model('Product', {
    tableName:'products',
    brand() {
        return this.belongsTo('Brand')
    }
});

const Brand = bookshelf.model('Brand',{
    tableName: 'brands',
    products() {
        return this.hasMany('Product', 'brand_id');
    }
})


module.exports = { Product, Brand};