const express = require('express');
const { Product, Brand, Category, Tag } = require('../models');
const { createProductForm, bootstrapField } = require('../forms');
const router = express.Router();


router.get('/', async (req, res) => {

 

    //.collection()--access all the rows
    //.fetch() -- execute the query
    const products = await Product.collection().fetch({
        withRelated: ['brand', 'category', 'tags']
    });
    res.render('products/index', {
        'products': products.toJSON(),
       
    })

})

router.get('/create', async (req, res) => {

    const allBrands = await Brand.fetchAll().map((brand) => {
        return [brand.get('id'), brand.get('name')];
    })
    const allCategories = await Category.fetchAll().map((category) => {
        return [category.get('id'), category.get('name')];
    })

    const allTags = await Tag.fetchAll().map(tag => [tag.get('id'), tag.get('name')]);

    const form = createProductForm(allBrands, allCategories, allTags)
    res.render('products/create', {
        'form': form.toHTML(bootstrapField)
    })
})


router.post('/create', async (req, res) => {
    //use caolan form to handle request

    const allBrands = await Brand.fetchAll().map((brand) => {
        return [brand.get('id'), brand.get('name')];
    })

    const allCategories = await Category.fetchAll().map((category) => {
        return [category.get('id'), category.get('name')];
    })


    const form = createProductForm(allBrands, allCategories);
    form.handle(req, {
        "success": async (form) => {
            //if the form has no errors
            //to access the data in the form, we use form.data
            //const x = new ModelX(); then the x refers to ONE ROW IN THE TABLE

            // separate out tags from the other product data
            // as not to cause an error when we create
            // the new product
            let { tags, ...productData } = form.data;

            const product = new Product(productData);
            // product.set('name', form.data.name);
            // product.set('cost', form.data.cost);
            // product.set('description', form.data.description);
            // product.set('brand_id', form.data.brand_id);
            // product.set('category_id', form.data.category_id);
            await product.save();
            //save the many to many relationships
            if (tags) {
                await product.tags().attach(tags.split(","));
            }
            //display a flash massage
            req.flash("success_messages", `New Product ${product.get('name')} has been created`)
            res.redirect('/products');
        },
        "empty": async (form) => {
            //if the form is empty
            res.render('products/create', {
                'form': form
            });
        },
        "error": async (form) => {
            //if the form has errors in validation
            res.render('products/create', {
                'form': form.toHTML(bootstrapField)
            });
        }
    })
})

router.get('/:product_id/update', async (req, res) => {
    // retrieve the product
    const productId = req.params.product_id
    const product = await Product.where({
        'id': productId
    }).fetch({
        require: true,
        withRelated: ['tags']
    });

    // fetch all the tags
    const allTags = await Tag.fetchAll().map(tag => [tag.get('id'), tag.get('name')]);

    // fetch all the brands
    const allBrands = await Brand.fetchAll().map((brand) => {
        return [brand.get('id'), brand.get('name')];
    })

    // fetch all the categories
    const allCategories = await Category.fetchAll().map((category) => {
        return [category.get('id'), category.get('name')];
    })

    //pass in allTags
    const productForm = createProductForm(allBrands, allCategories, allTags);

    // fill in the existing values
    productForm.fields.name.value = product.get('name');
    productForm.fields.cost.value = product.get('cost');
    productForm.fields.description.value = product.get('description');
    productForm.fields.brand_id.value = product.get('brand_id');
    productForm.fields.category_id.value = product.get('category_id');

    // fill in the multi-select for the tags
    let selectedTags = await product.related('tags').pluck('id');
    productForm.fields.tags.value = selectedTags;


    res.render('products/update', {
        'form': productForm.toHTML(bootstrapField),
        'product': product.toJSON()
    })

})

router.post('/:product_id/update', async (req, res) => {

    // fetch all the brands
    const allBrands = await Brand.fetchAll().map((brand) => {
        return [brand.get('id'), brand.get('name')];
    })

    const allCategories = await Category.fetchAll().map((category) => {
        return [category.get('id'), category.get('name')];
    })


    // fetch the product that we want to update
    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        require: true,
        withRelated: ['tags']
    });

    // process the form
    const productForm = createProductForm(allBrands, allCategories);
    productForm.handle(req, {
        'success': async (form) => {
            let { tags, ...productData } = form.data;
            product.set(productData);
            product.save();
            // update the tags
            let tagIds = tags.split(',');
            let existingTagIds = await product.related('tags').pluck('id');

            // remove all the tags that aren't selected anymore
            let toRemove = existingTagIds.filter(id => tagIds.includes(id) === false);
            await product.tags().detach(toRemove);

            // add in all the tags selected in the form
            await product.tags().attach(tagIds);


            res.redirect('/products');
        },
        'error': async (form) => {
            res.render('products/update', {
                'form': form.toHTML(bootstrapField),
                'product': product.toJSON()
            })
        }
    })
})

router.get('/:product_id/delete', async (req, res) => {
    // fetch the product that we want to delete
    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        require: true
    });

    res.render('products/delete', {
        'product': product.toJSON()
    })

});

router.post('/:product_id/delete', async (req, res) => {
    // fetch the product that we want to delete
    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        require: true
    });
    await product.destroy();
    res.redirect('/products')
})


module.exports = router