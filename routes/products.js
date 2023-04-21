const express = require('express');
const { Product, Brand, Category } = require('../models');
const { createProductForm, bootstrapField } = require('../forms');
const router = express.Router();


router.get('/', async(req,res)=>{
    //.collection()--access all the rows
    //.fetch() -- execute the query
    const products = await Product.collection().fetch({
        withRelated:['brand', 'category']
    });
    res.render('products/index', {
        'products': products.toJSON() 
    })

})

router.get('/create', async(req,res)=>{

    const allBrands = await Brand.fetchAll().map((brand) => {
        return [brand.get('id'), brand.get('name')];
    })
    const allCategories = await Category.fetchAll().map((category) => {
        return [category.get('id'), category.get('name')];
    })
   const form = createProductForm(allBrands,allCategories)
   res.render('products/create',{
    'form':form.toHTML(bootstrapField)
   })
})


router.post('/create', async(req,res)=>{
    //use caolan form to handle request

    const allBrands = await Brand.fetchAll().map((brand) => {
        return [brand.get('id'), brand.get('name')];
    })

    const allCategories = await Category.fetchAll().map((category) => {
        return [category.get('id'), category.get('name')];
    })


    const form = createProductForm(allBrands, allCategories);
    form.handle(req,{
        "success": async (form) => {
            //if the form has no errors
            //to access the data in the form, we use form.data
            //const x = new ModelX(); then the x refers to ONE ROW IN THE TABLE
            const product = new Product(form.data);
            product.set('name', form.data.name);
            product.set('cost', form.data.cost);
            product.set('description', form.data.description);
            product.set('brand_id', form.data.brand_id);
            product.set('category_id', form.data.category_id);
            await product.save();
            res.redirect('/products');
        },
        "empty":async (form) => {
            //if the form is empty
            res.render('products/create',{
                'form':form
            });
        },
        "error":async (form) =>{
            //if the form has errors in validation
            res.render('products/create',{
                'form':form.toHTML(bootstrapField)
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
        require: true
    });

     // fetch all the brands
     const allBrands = await Brand.fetchAll().map((brand)=>{
        return [brand.get('id'), brand.get('name')];
    })

       // fetch all the categories
       const allCategories = await Category.fetchAll().map((category)=>{
        return [category.get('id'), category.get('name')];
    })

    const productForm = createProductForm(allBrands, allCategories);

    // fill in the existing values
    productForm.fields.name.value = product.get('name');
    productForm.fields.cost.value = product.get('cost');
    productForm.fields.description.value = product.get('description');
    productForm.fields.brand_id.value = product.get('brand_id');
    productForm.fields.category_id.value = product.get('category_id');

    res.render('products/update', {
        'form': productForm.toHTML(bootstrapField),
        'product': product.toJSON()
    })

})

router.post('/:product_id/update', async (req, res) => {

     // fetch all the brands
     const allBrands = await Brand.fetchAll().map((brand)=>{
        return [brand.get('id'), brand.get('name')];
    })

    const allCategories = await Category.fetchAll().map((category)=>{
        return [category.get('id'), category.get('name')];
    })


    // fetch the product that we want to update
    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        require: true
    });

    // process the form
    const productForm = createProductForm(allBrands, allCategories);
    productForm.handle(req, {
        'success': async (form) => {
            product.set(form.data);
            product.save();
            res.redirect('/products');
        },
        'error': async (form) => {
            res.render('products/update', {
                'form': form.toHTML(bootstrapField),
                'product': product.toJSON()
            })
        }})
    })

    router.get('/:product_id/delete', async(req,res)=>{
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
    
    router.post('/:product_id/delete', async(req,res)=>{
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