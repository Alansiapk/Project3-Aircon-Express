const express = require('express');
const { Product } = require('../models');
const { createProductForm } = require('../forms');
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
   const form = createProductForm()
   res.render('products/create',{
    'form':form.toHTML()
   })
})


module.exports = router