const express = require('express');
const { Product, Brand } = require('../models');
const { createProductForm, bootstrapField } = require('../forms');
const router = express.Router();


router.get('/', async(req,res)=>{
    //.collection()--access all the rows
    //.fetch() -- execute the query
    const products = await Product.collection().fetch();
    res.render('products/index', {
        'products': products.toJSON() 
    })

})

router.get('/create', async(req,res)=>{

    const allBrands = await Brand.fetchAll().map((brand) => {
        return [brand.get('id'), brand.get('name')];
    })
   const form = createProductForm(allBrands)
   res.render('products/create',{
    'form':form.toHTML(bootstrapField)
   })
})


router.post('/create', async(req,res)=>{
    //use caolan form to handle request

    const allBrands = await Brand.fetchAll().map((brand) => {
        return [brand.get('id'), brand.get('name')];
    })

    const form = createProductForm(allBrands);
    form.handle(req,{
        "success": async (form) => {
            //if the form has no errors
            //to access the data in the form, we use form.data
            //const x = new ModelX(); then the x refers to ONE ROW IN THE TABLE
            const product = new Product(form.data);
            product.set('name', form.data.name);
            product.set('cost', form.data.cost);
            product.set('description', form.data.description);
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


module.exports = router