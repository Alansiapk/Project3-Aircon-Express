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
    },
    category(){
        return this.belongsTo('Category')
    },
    tags() {
        return this.belongsToMany('Tag');
    }
});

const Brand = bookshelf.model('Brand',{
    tableName: 'brands',
    products() {
        return this.hasMany('Product', 'brand_id');
    }
})

const Category = bookshelf.model('Category',{
    tableName: 'categories',
    products() {
        return this.hasMany('Product', 'category_id');
    }
})

const Tag = bookshelf.model('Tag',{
    tableName: 'tags',
    products() {
        return this.belongsToMany('Product')
    }
})



module.exports = { Product, Brand, Category, Tag};